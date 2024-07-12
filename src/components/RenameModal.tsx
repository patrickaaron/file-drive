"use client";

import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface RenameModalProps {
  id: Id<"files">;
  initialFileName: string;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export const RenameModal = ({
  id,
  initialFileName,
  isOpen,
  onOpenChange,
}: RenameModalProps) => {
  const renameFile = useMutation(api.files.renameFile);
  const [pending, setPending] = useState(false);

  const [filename, setFileName] = useState(initialFileName);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setPending(true);

    renameFile({ fileId: id, name: filename })
      .then(() => {
        toast({
          title: "Done",
          description: "File renamed",
        });
        onOpenChange(false);
      })
      .catch(() =>
        toast({
          variant: "destructive",
          description: "Failed to rename board",
        })
      )
      .finally(() => setPending(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit file name</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new name for this file</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={filename}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Board title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
