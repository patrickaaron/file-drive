"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileIcon, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden h-full md:block md:fixed md:inset-y-0 md:w-72 bg-blue-50">
      <div className="flex h-[60px] items-center px-4 cursor-pointer">
        🗂️ FileDrive
      </div>
      <div className="flex flex-col space-y-1 text-sm md:text-base">
        <Link
          href="/"
          className={cn(
            "relative group flex w-full justify-start  hover:bg-blue-100/25 transition",
            pathname === "/" && "active-link"
          )}
        >
          <div className="flex p-3 items-center flex-1 gap-x-2">
            <FileIcon className="h-4 w-4" />
            All Files
          </div>
        </Link>

        <Link
          href="/favorites"
          className={cn(
            "relative group flex w-full justify-start  hover:bg-blue-100/25 transition",
            pathname === "/favorites" && "active-link"
          )}
        >
          <div className="flex p-3 items-center flex-1 gap-x-2">
            <Star className="h-4 w-4" />
            Favorites
          </div>
        </Link>
      </div>
    </div>
  );
};
