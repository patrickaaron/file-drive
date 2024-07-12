"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileIcon, Star, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden h-full md:block md:fixed md:inset-y-0 md:w-72 bg-blue-50">
      <div className="flex h-[60px] items-center px-4 cursor-pointer">
        <div className="relative h-8 w-8 mr-4">
          <Image src="/logo.png" alt="File Drive logo" fill />
        </div>
        <h1 className="text-xl font-bold">FileDrive</h1>
      </div>
      <div className="flex flex-col space-y-1 text-sm md:text-base">
        <Link
          href="/"
          className={cn(
            "relative group flex w-full justify-start  hover:bg-blue-100/25 transition",
            pathname === "/" && "active-link"
          )}
        >
          <div className="flex p-3 items-center flex-1 gap-x-2 pl-6">
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
          <div className="flex p-3 items-center flex-1 gap-x-2 pl-6">
            <Star className="h-4 w-4" />
            Favorites
          </div>
        </Link>

        <Link
          href="/trash"
          className={cn(
            "relative group flex w-full justify-start  hover:bg-blue-100/25 transition",
            pathname === "/trash" && "active-link"
          )}
        >
          <div className="flex p-3 items-center flex-1 gap-x-2 pl-6">
            <Trash className="h-4 w-4" />
            Trash
          </div>
        </Link>
      </div>
    </div>
  );
};
