import { useState } from "react";
import { MoreVertical, Trash } from "lucide-react";
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

export const FileCard = ({ file }: { file: Doc<"files"> }) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="group relative">
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Download</Button>
      </CardFooter>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 cursor-pointer">
            <MoreVertical className="h-6 w-6 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start" side="bottom">
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
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
