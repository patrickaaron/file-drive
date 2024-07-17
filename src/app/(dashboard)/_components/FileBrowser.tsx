"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { FileCard } from "./FileCard";
import { SearchInput } from "@/components/SearchInput";
import { UploadButton } from "@/components/UploadButton";
import { DataTable } from "./DataTable";
import { columns } from "./columns";

import { ViewToggler } from "@/components/ViewToggler";

interface FileBrowserProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: boolean;
    trash?: boolean;
  };
}

export const FileBrowser = ({ orgId, query }: FileBrowserProps) => {
  const files = useQuery(api.files.getFiles, { orgId, ...query });

  const isLoading = files === undefined;

  const [activeView, setActiveView] = useState<"grid" | "list">("grid");

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <SearchInput disabled={isLoading} />
      {/* View Toggler */}
      <div className="flex justify-between items-center my-8 border-b border-base-300 pb-5">
        <h4 className="text-xl font-medium">{files?.length} files found</h4>
        {files.length !== 0 && (
          <ViewToggler activeValue={activeView} onClick={setActiveView} />
        )}
      </div>
      {/* Render empty state when no files are found  */}
      {files.length === 0 && (
        <div className="mt-20 flex flex-col items-center justify-center gap-y-8">
          <Image
            alt="picture of a clipboard"
            width={200}
            height={200}
            src="/empty.svg"
          />
          {query.search && (
            <h1 className="text-xl font-medium">
              No files matched your search
            </h1>
          )}
          {query.favorites && (
            <h1 className="text-xl font-medium">No favorited files</h1>
          )}
          {query.trash && (
            <h1 className="text-xl font-medium">Nothing in trash</h1>
          )}
          {Object.values(query).length === 0 && (
            <>
              <h1 className="text-xl font-medium">
                This organization does not have any files
              </h1>
              <UploadButton />
            </>
          )}
        </div>
      )}
      {/* Render Files View */}
      {activeView === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {files.map((file) => {
            return <FileCard key={file._id} file={file} />;
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={files} />
      )}
    </div>
  );
};
