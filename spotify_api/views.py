from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import Request, post
from django.http import HttpResponse, JsonResponse
import base64
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID=os.getenv("CLIENT_ID")
CLIENT_SECRET=os.getenv("CLIENT_SECRET")
REDIRECT_URI=os.getenv("REDIRECT_URI")
REACT_HOME=os.getenv("REACT_HOME")

print(CLIENT_ID)
class spotify_auth_request(APIView):
    def get(self, request):
        scope = 'playlist-modify-private playlist-modify-public ugc-image-upload'

        response_url = Request("GET", "https://accounts.spotify.com/authorize", params={
            'client_id': CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'scope': scope,
            'show_dialog': 'true'
        }).prepare().url

        return Response( {'url': response_url} )
    

def spotify_callback(request):
    code = request.GET.get('code')
    Authorization = f'Basic {base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()}'

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }, headers={
        'Authorization': Authorization,
        'Content-Type': 'application/x-www-form-urlencoded'
    }).json()

    set_session(request, response)

    return redirect(REACT_HOME)


def set_session(request, response):
    request.session['Authorization'] = f"Bearer {response['access_token']}"
    request.session['refresh_token'] = response['refresh_token']

    expiration_time = datetime.datetime.now() + datetime.timedelta(seconds=response['expires_in'])

    request.session['expires_at'] = expiration_time.isoformat()


def reauthenticate(request):
    request.session.flush()
    return HttpResponse("session flushed!")

    
class is_authenticated(APIView):
    def get(self, request):
        if 'Authorization' in request.session:
            if request.session['expires_at'] > datetime.datetime.now().isoformat():
                return Response({ 'is_authenticated': 'true'})
            else:
                return Response({ 'is_authenticated': 'false'})
        else:
            return Response({ 'is_authenticated': 'false'})
    