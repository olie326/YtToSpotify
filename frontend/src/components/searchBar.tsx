import { useRef, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Inset,
  Section,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import DisplayTable from "./SongTable/page";
import { Song } from "@/hooks/GetSongs";

import { Label } from "./ui/label";

import useDataIds from "@/hooks/useDataIds";
import { createPlaceholder } from "./SongTable/table_skeleton";
import portToSpotify, { getSongs } from "@/api/apiConfig";
import { FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";

export default function SearchBar() {
  const queryRef = useRef<HTMLInputElement>(null);

  const placeholder_data = createPlaceholder();

  const [songs, setSongs] = useState<Song[]>(placeholder_data);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<string | undefined>();
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

  const handleCoverSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const coverFile = e.target.files;

    if (coverFile) {
      setCover(URL.createObjectURL(coverFile[0]));
    }
  };

  function PortToSpotify() {
    if (songs.length > 0) {
      return (
        <div className="mt-2">
          <Button
            className="btn btn-success mb-2"
            onClick={() =>
              portToSpotify(title, descriptRef.current?.value, dataIds, cover)
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
      <Flex direction="row" gap="3" className="mt-3">
        <Label className="group basis-1/3 hover:opacity-80 active:opacity-50">
          <Card>
            <Inset className="bg-stone-50">
              <AspectRatio
                ratio={1}
                className="flex items-center justify-center align-center"
              >
                {/* <div className="z-10 h-full w-full">
                  <PlusIcon
                    height={30}
                    width={30}
                    className="opacity-0 group-hover:opacity-50 group-active:opacity-20"
                  />
                </div> */}
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleCoverSubmit}
                ></input>

                <img
                  src={cover}
                  className="h-full w-full bg-stone-50 object-cover"
                />
              </AspectRatio>
            </Inset>
          </Card>
        </Label>
        <Flex direction="column" grow="1" gap="2">
          <Label htmlFor="title">Title</Label>
          <TextField.Input
            variant="soft"
            size="3"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            type="string"
            placeholder="Write your title here!"
          ></TextField.Input>
          <Label htmlFor="description">Description</Label>
          <TextArea
            name="description"
            size="3"
            ref={descriptRef}
            id="description"
            placeholder="Write your description in here!"
            className="grow"
          ></TextArea>
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <div className="max-w-[688px] w-full">
        <form className="w-full" onSubmit={handleSubmit}>
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
      </div>
      {typeof loading === "boolean" ? (
        <div className="max-w-[880px] w-full">
          <Flex direction="column" gap="2">
            {playlist_options()}
            <DisplayTable
              data={songs}
              setData={setSongs}
              dataIds={dataIds}
              loading={loading}
            ></DisplayTable>
            {PortToSpotify()}
          </Flex>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
