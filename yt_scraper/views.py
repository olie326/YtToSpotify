from django.shortcuts import render
from rest_framework.views import APIView
import re
import json
from bs4 import BeautifulSoup
import requests
from rest_framework.response import Response
import urllib.parse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from base64 import b64encode
from PIL import Image



def yt_scraper(url: str):
    '''
    returns a list of songs as [ ('Song title', 'Artist Name'), ... ]
    '''
    response = requests.get(url)
    
    soup = BeautifulSoup(response.text, 'html.parser')

    pattern = re.compile(r'"videoAttributeViewModel":{.*?"title":"(.*?)","subtitle":"(.*?)",', re.MULTILINE | re.DOTALL)

    title = soup.find('meta', {'name': 'title'})['content']
    script = soup.find('script', string=pattern)

    if script:
        songList = re.findall(pattern, script.text)
    else:
        songList = []
    
    return title, songList


class yt_music_scraper(APIView):
    def post(self, request):
        
        response = {}

        url = request.data.get('url')
        title, songList = yt_scraper(url)

        response['title'] = title
        
        for count, (song_title, artist_name) in enumerate(songList):
            response[f'song{count+1}'] = {
                'song_title': song_title,
                'artist_name': artist_name
            }

        playlist = create_playlist(request, response) # python dictionary
        playlist['query'] = response
        
        return Response(playlist)


def get_song_details(request, song_title, artist_name):

    query = f"{song_title} artist:{artist_name}"
    response = requests.get('https://api.spotify.com/v1/search', params={
        'q': query,
        'type': 'track',
        'limit': 10
    }, headers={
        'Authorization': request.session['Authorization']
    })

    response_json = response.json()

    return response_json


def create_playlist(request, yt_data: dict):
    '''
    takes in JSON of a playlist and gets song data from spotify API
    title: 
    song0:
        song_title:
        artist_name:
    song1:
        ...
    '''

    playlist = {
        "title": yt_data["title"]
    }
    for index, song in enumerate(yt_data):
        if song == "title":
            continue
        
        song_title = yt_data[song]['song_title']
        artist_name = yt_data[song]['artist_name']

        response = get_song_details(request, song_title, artist_name)

        playlist[f"song{index}"] = response["tracks"]["items"]
    
    return playlist #python dictionary

@api_view(['GET', 'POST'])
def create_spotify_playlist(request):
    user_id = requests.get("https://api.spotify.com/v1/me", headers={
        'Authorization': request.session['Authorization']
    }).json().get('id')
    
    print(request.session["Authorization"])

    name = str(request.data.get('title', ""))
    description = str(request.data.get('description', ""))
    # print(name)
    playlist_data = {
        'name': name,
        'public': 'false'
    }
    # print(json.dumps(playlist_data))
    init_playlist = requests.post(f"https://api.spotify.com/v1/users/{user_id}/playlists", json={
        'name': name,
        'description': description,
        'public': 'false'
    }, headers={
        'Authorization': request.session['Authorization']
    })

    
    playlist_id = init_playlist.json().get('id')



    uris = json.loads(request.data.get('uris'))

    response = requests.post(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks", json={
        'uris': uris
    }, headers={
        'Authorization': request.session['Authorization']
    })

    cover_file = request.FILES.get("cover")

    if cover_file:
        cover_file = cover_file.read()

        encoded_cover = b64encode(cover_file)

        put_cover = requests.put(f"https://api.spotify.com/v1/playlists/{playlist_id}/images", 
            data= encoded_cover, 
            headers={
            'Authorization': request.session['Authorization']
        })

        print(put_cover)
    
    return Response(response, status=200)





    #copy pasta
    # {"url": "https://www.youtube.com/watch?v=G2-hrLPQQKw"}
        
    # track:say%2520anything%20artist:girl%2520in%2520red
        
        #query=track:Mystery%20of%20Love%20artist:Sufjan%20Stevens