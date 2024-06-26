"use client";

import Image from "next/image";
import { Loader } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { FileCard } from "@/components/FileCard";
import { SearchInput } from "@/components/SearchInput";
import { UploadButton } from "@/components/UploadButton";

interface FileBrowserProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: boolean;
  };
}

export const FileBrowser = ({ orgId, query }: FileBrowserProps) => {
  const files = useQuery(api.files.getFiles, { orgId, ...query });

  const isLoading = files === undefined;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {!query.favorites ? "Your Files" : "Your Favorites"}
        </h1>
        <UploadButton />
      </div>
      <SearchInput disabled={isLoading} />
      {/* Loading state */}
      {isLoading && (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
      )}
      {/* Render empty state when no files are found  */}
      {files?.length === 0 && (
        <div className="mt-20 flex flex-col items-center justify-center gap-y-8">
          <Image
            alt="picture of a clipboard"
            width={200}
            height={200}
            src="/empty.svg"
          />
          {!query.search ? (
            <p>This organization does not have any files yet</p>
          ) : (
            <p>No files found</p>
          )}

          {!query.search && <UploadButton />}
        </div>
      )}
      {/* Render file cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </div>
  );
};
