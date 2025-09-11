"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

const ImagesUpload = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const { setImages } = React.useContext(SidebarEditorContext);
  const handleDrop = (files: File[]) => {
    setFiles(files);
    if (files && files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          const img = new window.Image();
          img.src = src;
          setImages((prev) => [
            ...prev,
            {
              id: `img_${Date.now()}`,
              type: "image",
              src,
              image: img, // now real HTMLImageElement
              x: 100,
              y: 100,
              width: 200,
              height: 200,
              draggable: true,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg font-medium mb-4">Images Upload</h2>
      <Dropzone
        accept={{ "image/*": [] }}
        maxFiles={10}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

export default ImagesUpload;
