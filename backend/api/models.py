from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # automatically populate created_at, don't want to pass it everytime
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notes"
    )  # CASCADE - if i delete user, also delete the notes that reference the user
    # "notes" related_name is field name of User that references all its notes

    def __str__(self):
        return self.title
