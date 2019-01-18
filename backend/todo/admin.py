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
        if obj and obj.created_by != request.user:
            self.readonly_fields = self.others_readonly_fields
            if obj.status:
                self.readonly_fields = self.readonly_fields + ('status',)
        else:
            self.readonly_fields = self.own_readonly_fields
        return super().get_form(request, obj, **kwargs)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return obj and request.user == obj.created_by
