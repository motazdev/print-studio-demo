"use client";

import React, { useContext, type SyntheticEvent } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileWithPath } from "react-dropzone";

type FileWithPreview = FileWithPath;

import { CropIcon, Trash2Icon } from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import { SidebarEditorContext } from "../sidebar/SidebarEditorProvider";

interface ImageCropperProps {
  selectedFile: string | null;
  imageId?: string;
  konvaImage?: HTMLImageElement | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  onCropComplete?: (croppedImageUrl: string, cropData: PixelCrop) => void;
}

export function ImageCropper({
  selectedFile,
  setSelectedFile,
  imageId,
  konvaImage,
  onCropComplete,
}: ImageCropperProps) {
  const aspect = 1;

  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const { setImages } = useContext(SidebarEditorContext);
  const [crop, setCrop] = React.useState<Crop>({
    x: 0,
    y: 20,
    width: 20,
    height: 100,
    unit: "%",
  });
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop | null>(
    null
  );
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropCompleteHandler(crop: PixelCrop) {
    setCompletedCrop(crop);

    // For Konva cropping, store the crop rectangle in context
    if (
      crop &&
      typeof crop.width === "number" &&
      typeof crop.height === "number" &&
      crop.width > 0 &&
      crop.height > 0
    ) {
      setImages((prev) => {
        return prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                crop: {
                  x: crop.x,
                  y: crop.y,
                  width: crop.width,
                  height: crop.height,
                },
              }
            : img
        );
      });
    }
  }

  function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      // Convert canvas to blob and create URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        },
        "image/png",
        0.95
      );
    });
  }

  async function onCrop() {
    if (!completedCrop || !imgRef.current) {
      console.warn("No crop data or image reference available");
      return;
    }

    try {
      // Get the cropped image URL
      const croppedUrl = await getCroppedImg(imgRef.current, completedCrop);
      setCroppedImageUrl(croppedUrl);

      // If we're working with Konva, create a new image element for Konva to use
      if (imageId && konvaImage) {
        const croppedImage = new Image();
        croppedImage.crossOrigin = "anonymous";

        croppedImage.onload = () => {
          // Update the image in the context with the cropped version
          setImages((prev) => {
            return prev.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    src: croppedUrl,
                    width: croppedImage.width,
                    height: croppedImage.height,
                    // Reset crop since we've applied it
                    crop: undefined,
                  }
                : img
            );
          });

          // Call the optional callback
          if (onCropComplete) {
            onCropComplete(croppedUrl, completedCrop);
          }
        };

        croppedImage.src = croppedUrl;
      }

      // Close the cropper
      setSelectedFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }

  // Cleanup function for blob URLs
  React.useEffect(() => {
    return () => {
      if (croppedImageUrl && croppedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(croppedImageUrl);
      }
    };
  }, [croppedImageUrl]);

  return (
    <div>
      <div className="p-0 gap-0">
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropCompleteHandler(c)}
            aspect={aspect}
            className="w-full"
            minWidth={10}
            minHeight={10}
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="size-full rounded-none object-contain"
                alt="Image Cropper Shell"
                src={konvaImage ? konvaImage.src : (selectedFile as string)}
                onLoad={onImageLoad}
                crossOrigin="anonymous"
              />
              <AvatarFallback className="size-full min-h-[460px] rounded-none">
                Loading...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <div className="p-6 pt-0 justify-center flex gap-2">
          <Button
            size={"sm"}
            type="button"
            className="w-fit"
            variant={"outline"}
            onClick={() => {
              setSelectedFile(null);
            }}
          >
            <Trash2Icon className="mr-1.5 size-4" />
            Cancel
          </Button>
          <Button
            type="button"
            size={"sm"}
            className="w-fit"
            onClick={onCrop}
            disabled={!completedCrop}
          >
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Utility function to apply crop to Konva Image node
export function applyCropToKonvaImage(
  konvaImage: any, // Konva.Image
  cropData: PixelCrop,
  originalImageElement: HTMLImageElement
) {
  if (!konvaImage || !cropData || !originalImageElement) return;

  const scaleX = originalImageElement.naturalWidth / originalImageElement.width;
  const scaleY =
    originalImageElement.naturalHeight / originalImageElement.height;

  // Set crop properties on Konva image
  konvaImage.crop({
    x: cropData.x * scaleX,
    y: cropData.y * scaleY,
    width: cropData.width * scaleX,
    height: cropData.height * scaleY,
  });

  // Update the size to match the crop
  konvaImage.size({
    width: cropData.width,
    height: cropData.height,
  });

  // Redraw the layer
  if (konvaImage.getLayer()) {
    konvaImage.getLayer().batchDraw();
  }
}
