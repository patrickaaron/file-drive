"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchInputProps {
  disabled?: boolean;
}

export const SearchInput = ({ disabled }: SearchInputProps) => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onClick = () => {
    router.push(`/?search=${value}`);
  };

  return (
    <div className="rounded-lg border py-3 px-3 md:px-4 flex justify-between items-center mb-4 gap-x-2">
      <Input
        placeholder="What file are you looking for?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
      />
      <Button onClick={onClick} disabled={disabled || !value} variant="ghost">
        <Search className="h-5 w-5 " />
      </Button>
    </div>
  );
};
