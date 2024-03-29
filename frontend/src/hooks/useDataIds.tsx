import { UniqueIdentifier } from "@dnd-kit/core";
import { useMemo } from "react";
import { Song } from "./GetSongs";

export default function useDataIds(data: Song[]): UniqueIdentifier[] {
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ uri }) => uri),
    [data]
  );
  return dataIds;
}
