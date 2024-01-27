from django.contrib import admin
from django.urls import path
from .views import yt_music_scraper, create_spotify_playlist

urlpatterns = [
    path('getPlaylist', yt_music_scraper.as_view()),
    path('portToSpotify', create_spotify_playlist)
]
