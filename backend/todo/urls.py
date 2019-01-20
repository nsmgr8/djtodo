from django.urls import include, path
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/', views.UserListView.as_view()),
    path('login/', views.login),
    path('logout/', views.logout),
    path('is_authenticated/', views.is_authenticated),
    path('whoami/', views.whoami),
    path('api-auth/', include('rest_framework.urls',
                              namespace='rest_framework'))
]
