from datetime import date

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.admin.sites import AdminSite

from .models import Task
from .admin import TaskAdmin


class TaskModelTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user = get_user_model().objects.create(username='user',
                                                   is_staff=True,
                                                   is_superuser=True)
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        get_user_model().objects.all().delete()
        super().tearDownClass()

    def tearDown(self):
        Task.objects.all().delete()

    def test_fields(self):
        expected = {'id', 'created_by', 'description', 'created_on', 'name',
                    'status', 'done_by', 'done_at'}
        field_names = {x.name for x in Task._meta.get_fields()}
        self.assertEqual(expected, field_names)

    def test_create(self):
        name, description = 'Task 1', 'Desc 1'
        t1 = Task.objects.create(name=name, description=description,
                                 created_by=self.user)

        task1 = Task.objects.get(name=name)
        self.assertEqual(task1, t1)

        self.assertFalse(task1.status)
        self.assertEqual(task1.created_on.date(), date.today())
        self.assertIsNone(task1.done_by)
        self.assertIsNone(task1.done_at)
