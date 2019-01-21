from django.conf import settings
from django.db import models


class Task(models.Model):
    """
    The task model for todo
    """
    STATUS_DONE = True
    STATUS_UNDONE = False
    STATUS = {
        STATUS_DONE: 'Done',
        STATUS_UNDONE: 'Undone',
    }

    name = models.CharField(max_length=256)
    description = models.TextField(default='')

    status = models.BooleanField(default=False, choices=STATUS.items())

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    done_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True,
                                blank=True, on_delete=models.CASCADE,
                                related_name='done')
    done_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        get_latest_by = '-created_on'
        ordering = ('-created_on',)

    def __str__(self):
        return self.name and self.name[:20] or '<None>'
