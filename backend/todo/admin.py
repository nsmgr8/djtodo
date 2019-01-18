"""
django admin based task UI
"""

from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fields = ('name', 'description', 'status', ('created_by', 'created_on'))

    own_readonly_fields = ('created_on', 'created_by')
    others_readonly_fields = ('name', 'description') + own_readonly_fields

    list_display = ('name', 'created_by', 'created_on', 'status')
    list_filter = ('status', 'created_by', 'created_on')

    def get_form(self, request, obj=None, **kwargs):
        """
        Setup the form to edit a task
        """
        if obj and obj.created_by != request.user:
            # allow everyone to mark task done
            self.readonly_fields = self.others_readonly_fields
            if obj.status:  # only allow marking done
                self.readonly_fields = self.readonly_fields + ('status',)
        else:
            # allow updating own task
            self.readonly_fields = self.own_readonly_fields
        return super().get_form(request, obj, **kwargs)

    def save_model(self, request, obj, form, change):
        """
        Save a task
        """
        if not change:
            # when creating new task, creator is current user
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        """
        Check deletion permission
        """
        # only own tasks can be deleted
        return obj and request.user == obj.created_by
