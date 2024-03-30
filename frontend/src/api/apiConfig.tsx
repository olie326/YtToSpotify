import { Cover, Song } from "@/hooks/GetSongs";
import { UniqueIdentifier } from "@dnd-kit/core";
import axios from "axios";

// const BaseUrl = "http://127.0.0.1:8000/";

export async function isAuthenticated() {
  const authenticated = await axios.get(
    "http://127.0.0.1:8000/login/authenticated"
  );
  if (authenticated.data.is_authenticated === "true") return true;
  else return false;
}

export default async function PortToSpotify(
  title: string,
  description: string | undefined,
  uris: UniqueIdentifier[],
  cover: Cover | undefined
) {
  let data = new FormData();

  data.append("title", title);
  if (description) data.append("description", description);
  data.append("uris", JSON.stringify(uris));

  if (cover?.file) data.append("cover", cover.file[0]);

  const response = (
    await axios.post("http://127.0.0.1:8000/playlist/portToSpotify", data)
  ).status;
  return response;
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

export async function auth_redirect() {
  const redirectUrl = await axios.get("http://127.0.0.1:8000/login/request");
  if (redirectUrl.data.url) {
    return redirectUrl.data.url;
  } else return "";
}

export async function reauthenticate() {
  axios.get("http://127.0.0.1:8000/login/reauthenticate");
}
