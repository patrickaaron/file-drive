"use client";

import { useOrganization, useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { UploadButton } from "@/components/UploadButton";
import { FileCard } from "@/components/FileCard";

export default function Home() {
  const { organization } = useOrganization();
  const { userId } = useAuth();

  const orgId = organization?.id ?? userId;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadButton />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
