"use client";
import { Blend, Crop, Check, X } from "lucide-react";
import React, { useContext } from "react";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ImageToolbar = () => {
  const { selectedImage, setCropMode, cropMode, applyCrop, cancelCrop } =
    useContext(SidebarEditorContext);

  const [opacityValue, setOpacityValue] = React.useState(
    selectedImage?.opacity
      ? Number(selectedImage?.getAttr("opacity")) * 100
      : 100
  );

  const handleCropClick = () => {
    if (selectedImage) {
      setCropMode(selectedImage.getAttr("id"));
    }
  };

  const handleApplyCrop = () => {
    applyCrop();
  };

  const handleCancelCrop = () => {
    cancelCrop();
  };

  return (
    <div className="flex bg-white fixed top-0 mt-4 border rounded-2xl shadow-sm">
      {selectedImage && (
        <div className="flex flex-row items-center gap-2 p-2">
          {/* Crop Controls */}
          {cropMode === selectedImage.getAttr("id") ? (
            // Show Apply/Cancel buttons when in crop mode
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleApplyCrop}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Apply
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelCrop}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          ) : (
            // Show Crop button when not in crop mode
            <Button
              size={"icon"}
              className="bg-transparent hover:bg-gray-200 text-black shadow-none"
              onClick={handleCropClick}
            >
              <Crop />
            </Button>
          )}

          {/* Opacity Control - only show when not in crop mode */}
          {cropMode !== selectedImage.getAttr("id") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
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
          )}
        </div>
      )}
    </div>
  );
};

export default ImageToolbar;
