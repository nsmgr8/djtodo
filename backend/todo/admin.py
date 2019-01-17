from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fields = ('name', 'description', 'status', ('created_by', 'created_on'))
    readonly_fields = ('created_on', 'created_by')

    list_display = ('name', 'created_by', 'created_on', 'status')
    list_filter = ('status', 'created_by', 'created_on')

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return obj and request.user == obj.created_by
