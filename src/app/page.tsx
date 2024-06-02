"use client";

import { useOrganization, useAuth, useUser } from "@clerk/nextjs";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/UploadButton";

export default function Home() {
  const { organization } = useOrganization();
  const { userId } = useAuth();

  const orgId = organization?.id ?? userId;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadButton />
      </div>
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}
