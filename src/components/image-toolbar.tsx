"use client";
import { Blend, Crop, Check, X } from "lucide-react";
import React, { useContext, useState } from "react";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Konva from "konva";

const ImageToolbar = () => {
  const {
    selectedImage,
    handleCropCancel,
    handleCropSave,
    imageToCrop,
    setImageToCrop,
    setIsCropping,
    images,
    isCropping,
    setSelectedImageId,
    selectedImageId,
  } = useContext(SidebarEditorContext);

  const [opacityValue, setOpacityValue] = React.useState(
    selectedImage?.opacity
      ? Number(selectedImage?.getAttr("opacity")) * 100
      : 100
  );

  return (
    <div className="flex bg-white fixed top-0 mt-4 border rounded-2xl shadow-sm">
      {selectedImage && (
        <div className="flex flex-row items-center gap-2 p-2">
          {/* Crop Controls */}
          <Button
            size={"icon"}
            className="bg-transparent cursor-pointer hover:bg-gray-200 text-black shadow-none"
            onClick={() => {
              setSelectedImageId(null);
              const imageToCrop = images.find(
                (img) => img.id === selectedImageId
              );
              if (imageToCrop) {
                setImageToCrop(imageToCrop);
                setIsCropping(true);
              }
            }}
          >
            <Crop />
          </Button>

          {/* Opacity Control - only show when not in crop mode */}
          <Tooltip>
            <TooltipTrigger disabled={isCropping} asChild>
              <Popover>
                <PopoverTrigger disabled={isCropping} asChild>
                  <Button
                    size={"icon"}
                    className="cursor-pointer bg-transparent hover:bg-gray-200 text-black shadow-none"
                  >
                    <Blend className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex items-center justify-center">
                    <Slider
                      value={[opacityValue]}
                      onValueChange={(value) => {
                        setOpacityValue(value[0]);
                        selectedImage.setAttr("opacity", value[0] / 100);
                      }}
                      max={100}
                      step={1}
                    />
                    <span>{opacityValue}%</span>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>Image Opacity</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ImageToolbar;
