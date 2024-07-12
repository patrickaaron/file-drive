"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";

import { Heading } from "@/components/Heading";
import { FileBrowser } from "./_components/FileBrowser";
import { UploadButton } from "@/components/UploadButton";

interface DashboardPageProps {
  searchParams: {
    search?: string;
  };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { organization } = useOrganization();
  const { userId } = useAuth();
  const organizationId = organization?.id ?? userId;

  if (!organizationId) {
    return (
      <div className="pt-12 px-4 lg:px-8">
        <div>Loading organization...</div>
      </div>
    );
  }

  return (
    <div className="pt-12 px-4 lg:px-8">
      <Heading title="Your Files" formActionElement={<UploadButton />} />
      <FileBrowser orgId={organizationId} query={{ ...searchParams }} />
    </div>
  );
}
