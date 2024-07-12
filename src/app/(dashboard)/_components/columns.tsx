"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../convex/_generated/dataModel";

import { format } from "date-fns";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { FileActions } from "./FileActions";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    accessorKey: "authorName",
    header: "Owner",
  },
  {
    accessorKey: "name",
    header: "title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "_creationTime",
    header: "Uploaded",
    cell: ({ row }) => {
      const uploadDate = new Date(row.getValue("_creationTime"));

      return (
        <div className="text-sm font-light text-slate-700">
          {format(uploadDate, "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const file = row.original;
      const getImageUrl = new URL(
        `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
      );
      getImageUrl.searchParams.set("storageId", file.fileId);

      return (
        <FileActions
          id={file._id}
          fileName={file.name}
          url={getImageUrl.href}
          authorName={file.authorName}
          authorId={file.authorId}
          isArchived={file.isArchived}
        >
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
          </Button>
        </FileActions>
      );
    },
  },
];
