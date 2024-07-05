import Image from "next/image";
import { useState } from "react";
import {
  File,
  FileImage,
  MoreVertical,
  Sheet,
  Star,
  StarIcon,
  Trash,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: Doc<"files"> & { url?: string | null | undefined; isFavorite: boolean };
}
export const FileCard = ({ file }: FileCardProps) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      </CardFooter>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 cursor-pointer">
            <MoreVertical className="h-6 w-6 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start" side="bottom">
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
          >
            <StarIcon className="h-4 w-4 mr-2" />
            Favorite
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-500"
          >
            <Trash className="h-4 w-4 mr-2 " />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        {/* Placed outside the dropdownmenu content to avoid unmounting */}
        <ConfirmDeleteModal
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() =>
            deleteFile({ fileId: file._id }).then(() =>
              toast({
                variant: "default",
                title: "File deleted",
                description: "Your file is gone",
              })
            )
          }
        />
      </DropdownMenu>
    </Card>
  );
};
