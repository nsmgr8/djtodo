from rest_framework import viewsets, serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('pk', 'created_by', 'created_on', 'name', 'description',
                  'status', 'done_by', 'done_at')


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
