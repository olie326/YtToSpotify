import axios from "axios";

axios.defaults.withCredentials = true;

export type Song = {
  title: string;
  image_url: string;
  artist: string;
  uri: string;
};

export const initSong = (
  title: string,
  image_url: string,
  artist: string,
  uri: string
) => {
  const newSong: Song = {
    title: title,
    image_url: image_url,
    artist: artist,
    uri: uri,
  };
  return newSong;
};
