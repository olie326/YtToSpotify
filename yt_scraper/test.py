

myDict = {
    'title': 'this is my title',
    'song1': {
        'song_title': 'something1',
        'artist_name': 'name1'
    },
    'song2': {
        'song_title': 'something2',
        'artist_name': 'name2'
    },
}

def function(dictionary):
    
    for index, items in enumerate(dictionary):
        if items == 'title':    
            continue
        print(index, dictionary[items]['song_title'])


function(myDict)
    