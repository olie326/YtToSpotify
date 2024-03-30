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
import { Label } from "./ui/label";
import { Cover } from "@/hooks/GetSongs";
import { Pencil1Icon, PlusCircledIcon } from "@radix-ui/react-icons";

export default function PlaylistOptions({
  title,
  setTitle,
  descriptRef,
  cover,
  setCover,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  descriptRef: React.RefObject<HTMLTextAreaElement>;
  cover: Cover | undefined;
  setCover: React.Dispatch<React.SetStateAction<Cover | undefined>>;
}) {
  const handleCoverSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.currentTarget.files;
    if (files) {
      const cover: Cover = { file: files, url: URL.createObjectURL(files[0]) };

      setCover(cover);
    }
  };

  return (
    <Flex direction="row" gap="3" className="w-full">
      <Card className="basis-1/3 border-none">
        <Label className="basis-1/3 text-white">
          <Inset className="">
            <AspectRatio ratio={1}>
              <div className="group absolute flex h-full w-full items-center justify-center hover:bg-black/50 active:bg-black/75">
                <div className="flex flex-col items-center invisible group-hover:visible">
                  <Pencil1Icon height={50} width={50} />
                  Change Photo
                </div>
              </div>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleCoverSubmit}
              ></input>

              <img src={cover?.url} className="object-cover h-full w-auto" />
            </AspectRatio>
          </Inset>
        </Label>
      </Card>
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
