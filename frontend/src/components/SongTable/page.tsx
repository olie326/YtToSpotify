import { Card, Skeleton } from "@radix-ui/themes";
import { Song } from "../../hooks/GetSongs";
// import { columns } from "./column";
import { SongTable } from "./data-table";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect } from "react";

export default function DisplayTable({
  data,
  setData,
  dataIds,
  loading,
}: {
  data: Song[];
  setData: React.Dispatch<React.SetStateAction<Song[]>>;
  dataIds: UniqueIdentifier[];
  loading: boolean | null;
}) {
  return (
    <>
      {typeof loading === "boolean" ? (
        <Card className="w-full">
          <SongTable
            data={data}
            setData={setData}
            dataIds={dataIds}
            loading={loading}
          />
        </Card>
      ) : (
        <></>
      )}
    </>
  );
}
