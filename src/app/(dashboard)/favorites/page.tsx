"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";

import { Heading } from "@/components/Heading";
import { FileBrowser } from "../file-browser";

interface FavoritesPageProps {
  searchParams: {
    search?: string;
  };
}

export default function FavoritesPage({ searchParams }: FavoritesPageProps) {
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
      <Heading title="Favorites" />
      <FileBrowser
        orgId={organizationId}
        query={{ ...searchParams, favorites: true }}
      />
    </div>
  );
}
