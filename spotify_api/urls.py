from django.contrib import admin
from django.urls import path
from .views import spotify_auth_request, spotify_callback, is_authenticated, reauthenticate

urlpatterns = [
    path('request', spotify_auth_request.as_view(), name="authentication-get-request"),
    path('callback', spotify_callback),
    path('authenticated', is_authenticated.as_view()),
    path('reauthenticate', reauthenticate)
]
