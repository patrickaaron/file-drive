"use client";

import Image from "next/image";
import { useOrganization, useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { UploadButton } from "@/components/UploadButton";
import { FileCard } from "@/components/FileCard";
import { Loader } from "lucide-react";

export default function Home() {
  const { organization } = useOrganization();
  const { userId } = useAuth();

  const orgId = organization?.id ?? userId;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  console.log(files);
  if (files === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <main className="container mx-auto pt-12">
      {files.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <UploadButton />
        </div>
      )}
      {files.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center gap-y-8">
          <Image
            alt="picture of a clipboard"
            width={300}
            height={300}
            src="/empty.svg"
          />
          <p>You have have no files</p>
          <UploadButton />
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
