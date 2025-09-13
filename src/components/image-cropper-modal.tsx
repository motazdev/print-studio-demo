import React, { useState, useRef, useEffect, useContext } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";
import Image from "next/image";

async function getCroppedImageUrl(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = crop.width;
  canvas.height = crop.height;
  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        (blob as any).name = fileName;
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/png");
    });
  }
}

const ImageCropperModal = ({
  imageUrl,
  onSave,
  onClose,
}: {
  imageUrl: string;
  onSave: (imageUrl: string) => void;
  onClose: () => void;
}) => {
  const [crop, setCrop] = useState<Crop | undefined>();
  const [completedCrop, setCompletedCrop] = useState<Crop | undefined>();
  const imgRef = useRef<HTMLImageElement>(null);
  const { selectedImage } = useContext(SidebarEditorContext);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(
      centerCrop(
        makeAspectCrop(
          { unit: "%", width: Number(selectedImage?.width()) },
          16 / 9,
          width,
          height
        ),
        width,
        Number(selectedImage?.height())
      )
    );
  };

  const handleSaveCrop = async () => {
    if (completedCrop?.width && completedCrop?.height) {
      const croppedImageUrl = await getCroppedImageUrl(
        imgRef.current as HTMLImageElement,
        completedCrop,
        "new-cropped-image.png"
      );
      console.log({ croppedImageUrl });
      onSave(croppedImageUrl as string);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: selectedImage?.getAttr("y"),
        left: selectedImage?.getAttr("x"),
        width: selectedImage?.getAttr("width"),
        height: selectedImage?.getAttr("height"),
        backgroundColor: "rgba(50,0,0,0.5)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          borderRadius: "8px",
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={16 / 9}
        >
          <div
            className="relative"
            style={{
              width: selectedImage?.getAttr("width") || "auto",
              height: selectedImage?.getAttr("height") || "auto",
            }}
          >
            <Image
              alt="cropped"
              ref={imgRef}
              src={imageUrl}
              fill
              onLoad={handleImageLoad}
              className="absolute"
              style={{
                //   width: selectedImage?.getAttr("width") || "auto",
                //   height: selectedImage?.getAttr("height") || "auto",
                display: "block",
              }}
            />
          </div>
        </ReactCrop>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            className="bg-white cursor-pointer rounded-2xl py-1 px-3 text-sm font-medium shadow-sm border-0 "
            onClick={onClose}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white cursor-pointer rounded-2xl py-1 px-3 text-sm font-medium shadow-sm border-0 "
            onClick={handleSaveCrop}
            disabled={!completedCrop}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
