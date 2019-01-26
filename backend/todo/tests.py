import json
from datetime import date
from unittest import mock

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.admin.sites import AdminSite

from .models import Task
from .admin import TaskAdmin
from . import views


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


class MockRequest:
    pass


class TaskAdminTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user1 = get_user_model().objects.create(username='user1',
                                                    is_staff=True,
                                                    is_superuser=True)
        cls.user2 = get_user_model().objects.create(username='user2',
                                                    is_staff=True,
                                                    is_superuser=True)
        cls.site = AdminSite()
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        get_user_model().objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.task = Task.objects.create(name='Task', created_by=self.user1)

    def tearDown(self):
        Task.objects.all().delete()

    def test_delete_perm(self):
        ta = TaskAdmin(Task, self.site)

        request = MockRequest()
        self.assertFalse(ta.has_delete_permission(request))

        # only own tasks can be deleted
        request.user = self.user1
        self.assertTrue(ta.has_delete_permission(request, self.task))

        request.user = self.user2
        self.assertFalse(ta.has_delete_permission(request, self.task))

    def test_save_model(self):
        ta = TaskAdmin(Task, self.site)
        request = MockRequest()
        request.user = self.user1

        task = Task(name='t1')

        ta.save_model(request, task, {}, False)
        task.refresh_from_db()

        # new task is owned by current user and not done
        self.assertEqual(task.created_by, self.user1)
        self.assertFalse(task.status)
        self.assertIsNone(task.done_by)

        task.status = True
        ta.save_model(request, task, {}, False)
        task.refresh_from_db()

        # setting task done mark current user to be completer
        self.assertTrue(task.status)
        self.assertEqual(task.done_by, self.user1)
        self.assertEqual(task.done_at.date(), date.today())

        task.status = False
        ta.save_model(request, task, {}, False)
        task.refresh_from_db()

        # marking undone removes completer
        self.assertFalse(task.status)
        self.assertIsNone(task.done_by)

        # allow others to mark done
        request.user = self.user2
        task.status = True
        ta.save_model(request, task, {}, False)
        task.refresh_from_db()

        # setting task done mark current user to be completer
        self.assertTrue(task.status)
        self.assertEqual(task.done_by, self.user2)

    def test_form(self):
        ta = TaskAdmin(Task, self.site)
        request = MockRequest()
        request.user = self.user1

        fields = {x.name for x in Task._meta.get_fields()} - {'id'}
        task = Task.objects.create(name='t1', created_by=self.user1)

        ta.get_form(request, task)

        # users can modify own task
        editable_fields = {'name', 'description', 'status'}
        self.assertEqual(fields - set(ta.readonly_fields), editable_fields)

        request.user = self.user2
        ta.get_form(request, task)

        # users can only mark done/undone others tasks
        editable_fields = {'status'}
        self.assertEqual(fields - set(ta.readonly_fields), editable_fields)


class TaskAPIAuthTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user3 = get_user_model().objects.create(username='user3',
                                                    is_staff=True,
                                                    is_superuser=True)
        cls.user3.set_password('password')
        cls.user3.save()

        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        get_user_model().objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.task = Task.objects.create(name='Task', created_by=self.user3)

    def tearDown(self):
        Task.objects.all().delete()

    @mock.patch('todo.views.auth_login')
    def test_login(self, auth_login):
        request = MockRequest()
        request.body = json.dumps({
            'username': 'user3',
            'password': 'password',
        })
        request.method = 'POST'
        response = views.login(request)
        user = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user['username'], 'user3')

        request.body = json.dumps({'username': 'not-exist'})
        response = views.login(request)
        user = json.loads(response.content)
        self.assertEqual(response.status_code, 400)
        self.assertIn('failed', user['error'])

    @mock.patch('todo.views.auth_logout')
    def test_logout(self, auth_logout):
        request = MockRequest()
        request.method = 'POST'
        response = views.logout(request)
        data = json.loads(response.content)
        self.assertEqual(data['success'], 'logout')

    def test_is_authenticated(self):
        request = mock.Mock()
        request.user.is_authenticated = False
        response = views.is_authenticated(request)
        self.assertEqual(response.status_code, 401)

        request.user.is_authenticated = True
        request.user.pk = 1
        request.user.username = 'user'
        request.user.email = ''
        response = views.is_authenticated(request)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['username'], 'user')

    def test_whoami(self):
        request = mock.Mock()
        request.user.is_authenticated = False
        response = views.whoami(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{}')

        request.user.is_authenticated = True
        request.user.pk = 1
        request.user.username = 'user'
        request.user.email = ''
        response = views.is_authenticated(request)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['username'], 'user')
