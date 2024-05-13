import { useEffect, useRef, useState } from "react";
import { Button, Container, Flex, TextField } from "@radix-ui/themes";
import DisplayTable from "./SongTable/page";
import { Song, Cover } from "@/hooks/GetSongs";

import useDataIds from "@/hooks/useDataIds";
import { createPlaceholder } from "./SongTable/table_skeleton";
import PortToSpotify, { getSongs } from "@/api/apiConfig";
import PlaylistOptions from "./playlistOptions";

export default function SearchBar() {
  const portingState = {
    initial: "Port to Spotify",
    porting: "Porting...",
    done: "Done!",
  };

  const queryRef = useRef<HTMLInputElement>(null);

  const placeholder_data = createPlaceholder();

  const [songs, setSongs] = useState<Song[]>(placeholder_data);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<Cover | undefined>();
  const [loading, setLoading] = useState<boolean | null>(null);
  const [porting, setPorting] = useState<string>(portingState.initial);

  const dataIds = useDataIds(songs);
  const descriptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("cover updated!");
    console.log(cover?.file);
  }, [cover]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (queryRef.current?.value) {
      setLoading(true);
      setPorting(portingState.initial);
      setSongs(placeholder_data);

      const [title, songs] = await getSongs(queryRef.current?.value);
      console.log(title);
      setTitle(title);
      setSongs(songs);
      setLoading(false);
    }
  };

  function ToSpotify() {
    if (songs.length > 0) {
      return (
        <>
          {porting === "Port to Spotify" ? (
            <Button
              size="4"
              className="max-w-[688px] w-full"
              onClick={async () => {
                setPorting(portingState.porting);
                await PortToSpotify(
                  title,
                  descriptRef.current?.value,
                  dataIds,
                  cover
                ).then((response: number) => {
                  response === 200
                    ? setPorting(portingState.done)
                    : console.log(response);
                });
              }}
            >
              {porting}
            </Button>
          ) : (
            <Button
              disabled
              size="4"
              className="max-w-[688px] w-full"
              onClick={async () => {
                setPorting(portingState.porting);
                await PortToSpotify(
                  title,
                  descriptRef.current?.value,
                  dataIds,
                  cover
                ).then((response: number) => {
                  response === 200
                    ? setPorting(portingState.done)
                    : console.log(response);
                });
              }}
            >
              {porting}
            </Button>
          )}
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <div className="max-w-[688px] w-full">
        <form className="w-full" onSubmit={handleSubmit}>
          <Flex gap="2">
            <Flex grow="1">
              <Container>
                <TextField.Input
                  size="3"
                  ref={queryRef}
                  type="url"
                  placeholder="put your url here!"
                ></TextField.Input>
              </Container>
            </Flex>
            <Button size="3">Search</Button>
          </Flex>
        </form>
      </div>
      {typeof loading === "boolean" ? (
        <Flex
          direction="column"
          gap="2"
          align="center"
          className="max-w-[880px] w-full"
        >
          <PlaylistOptions
            title={title}
            setTitle={setTitle}
            descriptRef={descriptRef}
            cover={cover}
            setCover={setCover}
          />
          <DisplayTable
            data={songs}
            setData={setSongs}
            dataIds={dataIds}
            loading={loading}
          ></DisplayTable>

          {ToSpotify()}
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
}
