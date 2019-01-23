import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth import (
    get_user_model, authenticate, login as auth_login, logout as auth_logout
)
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, serializers, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('pk', 'username', 'email')


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('pk', 'created_by', 'created_on', 'name', 'description',
                  'status', 'done_by', 'done_at')


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        status = request.query_params.get('status')
        if status == 'done':
            self.queryset = self.queryset.filter(status=True)
        if status == 'undone':
            self.queryset = self.queryset.filter(status=False)
        return super().list(request)

    def create(self, request):
        request.data['created_by'] = request.user.pk
        return super().create(request)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.created_by != request.user:
            return Response({'error': 'Updating own tasks only allowed'}, status=403)
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def mark_done(self, request, pk=None):
        obj = self.get_object()
        status = request.data['status']
        if not status or obj.status:
            return Response({'error': 'Only marking done allowed'}, status=400)

        serializer = self.get_serializer(
            obj,
            data={
                'status': True,
                'done_by': request.user.pk,
                'done_at': timezone.now(),
            },
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


@require_POST
@csrf_exempt
def login(request):
    creds = json.loads(request.body)
    user = authenticate(**creds)
    if user is None:
        resp = JsonResponse({'error': 'login failed'}, status=400)
        return resp

    auth_login(request, user)
    return JsonResponse({
        'pk': user.pk,
        'username': user.username,
        'email': user.email,
    })


@require_POST
def logout(request):
    auth_logout(request)
    return JsonResponse({'success': 'logout'})


def is_authenticated(request):
    user = _whoami(request)
    if user:
        return JsonResponse(user)
    return JsonResponse({'error': 'not authenticated'}, status=401)


def whoami(request):
    return JsonResponse(_whoami(request))


def _whoami(request):
    if request.user.is_authenticated:
        return {
            'pk': request.user.pk,
            'username': request.user.username,
            'email': request.user.email,
        }
    return {}
