import { Song } from "@/hooks/GetSongs";
import { UniqueIdentifier } from "@dnd-kit/core";
import axios from "axios";

// const BaseUrl = "http://127.0.0.1:8000/";

export async function isAuthenticated() {
  const authenticated: string = await axios.get(
    "http://127.0.0.1:8000/login/authenticated"
  );
  if (authenticated === "true") return true;
  else return false;
}

export default function portToSpotify(
  title: string,
  description: string | undefined,
  uris: UniqueIdentifier[]
) {
  axios.post("http://127.0.0.1:8000/playlist/portToSpotify", {
    title: title,
    description: description,
    uris: uris,
  });
  console.log("request went though");
}

export const getSongs = async (url: string | undefined) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/playlist/getPlaylist",
    {
      url: url,
    }
  );
  console.log(response);
  const data = response.data;
  const songs: Song[] = [];

  Object.keys(data).forEach((key) => {
    if (key.startsWith("song") && data[key].length > 0) {
      const query_title = data.query[key].song_title;
      const current_title = data[key].find((item: any) => {
        item.name.includes(query_title);
      });

      const current_item = current_title || data[key][0];

      const album = current_item.album;
      const imageUrl = album.images[1]?.url || ""; // Provide a default value if url is undefined
      const artistName = album.artists[0]?.name || ""; // Provide a default value if name is undefined
      const songName = current_item.name;
      const uri = current_item.uri;
      songs.push({
        title: songName,
        image_url: imageUrl,
        artist: artistName,
        uri: uri,
      });
    }
  });
  return [data.title, songs];
};
