"use client";

import { useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file:
    typeof window === "undefined"
      ? z.any()
      : z.instanceof(FileList).refine((files) => files.length > 0, "Required"),
});

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { organization } = useOrganization();
  const { userId } = useAuth();
  const orgId = organization?.id ?? userId;
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  const isSubmitting = form.formState.isSubmitting;

  const fileTypes = {
    "application/pdf": "pdf",
    "image/png": "image",
    "image/jpeg": "image",
    "text/csv": "csv",
  } as Record<string, "pdf" | "image" | "csv">;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) return;

    const selectedFile = values.file[0];
    console.log(selectedFile.type);
    // Step 1: Get a short-lived upload URL
    const postURl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postURl, {
      method: "POST",
      headers: { "Content-Type": selectedFile.type },
      body: selectedFile,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: fileTypes[selectedFile.type],
      });

      setIsOpen(false);

      form.reset();

      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Now everyone can view your file",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your file could not be uploaded. Try again later",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload A File</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({}) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
