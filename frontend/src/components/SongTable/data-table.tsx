"use client";

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Skeleton } from "@radix-ui/themes";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { Song } from "@/hooks/GetSongs";
import { createPlaceholder } from "./table_skeleton";

interface DataTableProps<TData> {
  //   column: ColumnDef<TData, TValue>[];
  data: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
  dataIds: UniqueIdentifier[];
  loading: boolean;
  //   setDataIds: React.Dispatch<React.SetStateAction<UniqueIdentifier[]>>
}

// Cell Component
export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <Button {...attributes} {...listeners}>
      🟰
    </Button>
  );
};

// Row Component
export const DraggableRow = ({
  row,
  loading,
}: {
  row: Row<Song>;
  loading: boolean;
}) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.original.uri,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow
      ref={setNodeRef}
      style={style}
      className="rounded-lg hover:bg-[var(--accent-3)]"
      {...attributes}
      {...listeners}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          <Skeleton loading={loading}>
            <div className="inline-block">
              {/* extra div because Skeleton isn't applying the span onto flexRendered cells*/}
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </Skeleton>
        </TableCell>
      ))}
    </TableRow>
  );
};

export function SongTable<TData extends Song>({
  data,
  setData,
  dataIds,
  loading,
}: DataTableProps<TData>) {
  const tes = useEffect(() => console.log("data changed"), [data]);

  const columns = useMemo<ColumnDef<Song>[]>(
    () => [
      {
        accessorKey: "image_url",
        header: "",
        cell: ({ getValue }) => {
          const image_url = getValue();
          return typeof image_url === "string" ? (
            <img
              src={image_url}
              alt="Description"
              style={{ width: "50px", height: "50px" }}
            />
          ) : null;
        },
      },
      {
        accessorKey: "title",
        header: "",
        cell: ({ row, column }) => (
          <div style={{ textAlign: "left" }}>{row.getValue(column.id)}</div>
        ),
      },
      {
        accessorKey: "artist",
        header: "",
        cell: ({ row, column }) => (
          <div className="text-left">{row.getValue(column.id)}</div>
        ),
      },
      {
        accessorKey: "uri",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.uri,
    initialState: {
      columnVisibility: {
        title: true,
        image_url: true,
        artist: true,
        uri: false,
      },
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      console.log("handing drag end...");
      setData((Data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(Data, oldIndex, newIndex); //this is just a splice util
      });
      console.log(dataIds);
      console.log(data);
      console.log(table.getRowModel().rows);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableBody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DraggableRow key={row.id} row={row} loading={loading} />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </>
  );
}

// background: rgb(255,229,100);
// background: radial-gradient(circle, rgba(255,229,100,1) 9%, rgba(255,250,220,1) 69%, rgba(255,252,244,1) 100%);
