import Image from "next/image";
import { File, FileImage, MoreVertical, Sheet, Star } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileActions } from "./FileActions";

interface FileCardProps {
  file: Doc<"files"> & {
    url?: string | null | undefined;
    isFavorite?: boolean;
  };
}
export const FileCard = ({ file }: FileCardProps) => {
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const fileIcon = {
    image: <FileImage className="w-6 h-6" />,
    pdf: <File className="w-6 h-6" />,
    csv: <Sheet className="w-6 h-6" />,
  };

  return (
    <Card className="group relative border rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-x-3 text-base">
            {fileIcon[file.type]}
            <div className="truncate">{file.name}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center relative">
        {file.type === "image" && (
          <Image
            alt={file.name}
            fill
            src={file.url!}
            className="object-cover p-[inherit]"
          />
        )}
        {file.type === "pdf" && (
          <Image alt={file.name} height={100} width={200} src="/pdf.webp" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!file.isArchived && (
          <>
            <Button
              onClick={() => {
                if (file.url) {
                  window.open(file.url, "_blank");
                }
              }}
            >
              Download
            </Button>
            <Button
              onClick={() => {
                toggleFavorite({ fileId: file._id });
              }}
              variant="ghost"
              className="p-0 hover:bg-transparent"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  file.isFavorite && "fill-yellow-200 text-yellow-200"
                )}
              />
            </Button>
          </>
        )}
      </CardFooter>

      <FileActions
        id={file._id}
        fileName={file.name}
        authorName={file.authorName}
        authorId={file.authorId}
        isArchived={file.isArchived}
      >
        <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 cursor-pointer">
          <MoreVertical className="h-6 w-6 text-muted-foreground" />
        </div>
      </FileActions>
    </Card>
  );
};
