import { Song, initSong } from "@/hooks/GetSongs";

export function createPlaceholder() {
  const placeholder_data: Song[] = [];

  for (var i = 0; i < 11; i++) {
    placeholder_data.push(
      initSong("temp_song_name", "temp_image_url", "temp_artist_name", `${i}`)
    );
  }
  return placeholder_data;
}
