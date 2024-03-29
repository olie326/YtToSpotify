import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Flex,
  Skeleton,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import DisplayTable from "./SongTable/page";
import { Song } from "@/hooks/GetSongs";

import { Label } from "./ui/label";

import useDataIds from "@/hooks/useDataIds";
import { createPlaceholder } from "./SongTable/table_skeleton";
import portToSpotify, { getSongs } from "@/api/apiConfig";

axios.defaults.withCredentials = true;

export default function SearchBar() {
  const queryRef = useRef<HTMLInputElement>(null);

  const placeholder_data = createPlaceholder();

  const [songs, setSongs] = useState<Song[]>(placeholder_data);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState<boolean | null>(null);

  const dataIds = useDataIds(songs);
  const descriptRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSongs(placeholder_data);

    const [title, songs] = await getSongs(queryRef.current?.value);
    console.log(title);
    setTitle(title);
    setSongs(songs);
    setLoading(false);
  };

  function PortToSpotify() {
    if (songs.length > 0) {
      return (
        <div className="mt-2">
          <Button
            className="btn btn-success mb-2"
            onClick={() =>
              portToSpotify(title, descriptRef.current?.value, dataIds)
            }
            style={{ width: "100%" }}
          >
            Port to Spotify
          </Button>
        </div>
      );
    } else {
      return null;
    }
  }
  function playlist_options() {
    return (
      <div className="mt-3">
        <Label htmlFor="title">Title</Label>
        <TextField.Input
          variant="soft"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          type="string"
          placeholder="Write your title here!"
        ></TextField.Input>
        <Label htmlFor="description">Description</Label>
        <TextArea
          name="description"
          ref={descriptRef}
          id="description"
          placeholder="Write your description in here!"
        ></TextArea>
      </div>
    );
  }

  return (
    <>
      <form className="" onSubmit={handleSubmit}>
        <Flex gap="2">
          <Flex grow="1">
            <Container>
              <TextField.Input
                ref={queryRef}
                type="url"
                placeholder="put your url here!"
              ></TextField.Input>
            </Container>
          </Flex>
          <Button>Search</Button>
        </Flex>
      </form>
      {typeof loading === "boolean" ? (
        <>
          {playlist_options()}
          <DisplayTable
            data={songs}
            setData={setSongs}
            dataIds={dataIds}
            loading={loading}
          ></DisplayTable>
          {PortToSpotify()}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
