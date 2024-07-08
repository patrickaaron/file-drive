import { useState } from "react";
import { Protect, useAuth } from "@clerk/nextjs";
import { ArchiveRestore, Edit, Trash, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";

import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { toast } from "./ui/use-toast";
import { RenameModal } from "./RenameModal";

interface FileActionsProps {
  children: React.ReactNode;
  id: Id<"files">;
  fileName: string;
  authorId: string;
  authorName: string;
  isArchived: boolean;
}

export const FileActions = ({
  children,
  id,
  fileName,
  authorId,
  authorName,
  isArchived,
}: FileActionsProps) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restore);

  const { userId } = useAuth();
  const isFileAuthor = authorId === userId;

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start" side="bottom">
        {isArchived ? (
          <div>
            <DropdownMenuItem
              onClick={() =>
                restoreFile({ fileId: id }).then(() =>
                  toast({
                    variant: "default",
                    title: "Done",
                    description: "File has been restored",
                  })
                )
              }
              className="text-green-500"
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </div>
        ) : (
          <div>
            {isFileAuthor && (
              <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2 " />
                Rename
              </DropdownMenuItem>
            )}
            <Protect
              condition={(has) => has({ role: "org:admin" }) || isFileAuthor}
              fallback={<></>}
            >
              <DropdownMenuItem
                onClick={() =>
                  deleteFile({ fileId: id }).then(() =>
                    toast({
                      variant: "default",
                      title: "Done",
                      description: "File has been to your trash",
                    })
                  )
                }
              >
                <Trash className="h-4 w-4 mr-2 " />
                Move to trash
              </DropdownMenuItem>
            </Protect>
          </div>
        )}

        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Uploaded by: {authorId === userId ? "You" : authorName}
        </div>
      </DropdownMenuContent>
      {/* Placed outside the dropdownmenu content to avoid unmounting */}
      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() =>
          deleteFile({ fileId: id, permanentDelete: true }).then(() =>
            toast({
              variant: "default",
              title: "File deleted",
              description: "Your file is gone",
            })
          )
        }
      />
      <RenameModal
        id={id}
        initialFileName={fileName}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </DropdownMenu>
  );
};
