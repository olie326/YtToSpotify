import { useRef, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function SearchBar() {
  interface Song {
    song_name: string;
    url: string;
    artist_name: string;
    uri: string;
  }

  const queryRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<Song[]>([]);
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  // const descritRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/playlist/getPlaylist", {
        url: queryRef.current?.value,
      })
      .then((response) => {
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
              song_name: songName,
              url: imageUrl,
              artist_name: artistName,
              uri: uri,
            });
          }
        });

        setTitle(data.title);
        setState(songs);
      });
  };

  const all_songs = state.map((item) => {
    return (
      <li className="list-group-item">
        <div className="row text-start align-items-center p-1">
          <img
            className="col-2 object-fit-contain p-0 pe-2"
            src={item.url}
            alt=""
          />
          <h3 className="col fs-6 m-0 ps-0">{item.song_name}</h3>
          <h3 className="col-4 fs-6 m-0 d-none d-sm-block">
            {item.artist_name}
          </h3>
          {/* <button type="button" className="btn-close col-1 p-4"></button> */}
        </div>
      </li>
    );
  });

  function options_column() {
    if (state.length > 0) {
      return (
        <ul className="list-group col-4 d-none d-md-block">
          <button
            className="btn btn-success mb-2"
            onClick={portToSpotify}
            style={{ width: "100%" }}
          >
            Port to Spotify
          </button>
          <div className="input-group">
            <textarea
              name="description"
              id="description"
              className="form-control"
              placeholder="Write your description in here!"
            ></textarea>
          </div>
        </ul>
      );
    } else {
      return null;
    }
  }

  function portToSpotify() {
    axios.post("http://127.0.0.1:8000/playlist/portToSpotify", {
      title: titleRef.current?.value,
      uris: state.map((item: Song) => item.uri),
    });
    console.log("request went though");
  }

  return (
    <div className="container" style={{ maxWidth: "900px" }}>
      <form className="row" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            ref={queryRef}
            type="url"
            className="form-control"
            placeholder="put your url here!"
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary">Search</button>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-md-8 col-12">
          <ul className="list-group">
            {state.length > 0 ? (
              <input
                ref={titleRef}
                type="text"
                defaultValue={title}
                className="form-control-lg mb-2"
              />
            ) : null}
            {all_songs}
          </ul>
        </div>
        {options_column()}
      </div>
    </div>
  );
}
