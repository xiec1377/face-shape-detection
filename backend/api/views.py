from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = (
        User.objects.all()
    )  # list of all objs, make sure we don't create user that already exists
    serializer_class = UserSerializer  # tells view what data to accept to make a new user (username, password)
    permission_classes = [
        AllowAny
    ]  # allows anyone (even not authenticated) to use this view


class NoteListView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [
        IsAuthenticated
    ]  # cannot access this route unless pass valid JWT token, user must be authenticated

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # filters all notes with this user

    def perform_create(self, serializer):
        # check if serializer passed all checks for data
        if serializer.is_valid():
            serializer.save(author=self.request.user)  # manually add author
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # filters all notes with this user
