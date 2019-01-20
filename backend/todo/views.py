import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth import (
    get_user_model, authenticate, login as auth_login, logout as auth_logout
)

from rest_framework import viewsets, serializers, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

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


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def create(self, request):
        request.data['created_by'] = request.user.pk
        return super().create(request)


class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


@require_POST
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
