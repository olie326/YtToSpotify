import {
  AspectRatio,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Section,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Label } from "./ui/label";

export default function playlistOptions({
  title,
  setTitle,
  descriptRef,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  descriptRef: React.RefObject<HTMLTextAreaElement>;
}) {
  return (
    <Flex direction="row" gap="3" className="mt-3">
      <Card className="basis-1/3 bg-stone-50">
        <AspectRatio ratio={1}>
          <img
            src="something"
            alt="playlist_image"
            className="h-full w-full bg-stone-50"
          />
        </AspectRatio>
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
