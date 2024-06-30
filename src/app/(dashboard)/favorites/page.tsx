"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";

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

  return (
    <div className="pt-12 px-4 lg:px-8">
      {!organizationId ? (
        <div>Loading organization...</div>
      ) : (
        <FileBrowser
          orgId={organizationId}
          query={{ ...searchParams, favorites: true }}
        />
      )}
    </div>
  );
}
