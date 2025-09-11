"use client";

import {
  ArrowUpFromLine,
  Blend,
  Bold,
  BoxSelectIcon,
  Circle,
  Italic,
  Layers,
  Layout,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";
import React, { useContext, useEffect } from "react";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { TabsList, TabsTrigger } from "./ui/tabs";
import { Toggle } from "./ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import dynamic from "next/dynamic";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
const TextEffects = dynamic(() => import("./text-effects"), { ssr: false });
const fontFamilies = [
  "arial",
  "verdana",
  "georgia",
  "courier",
  "roboto",
  "times new roman",
];

const ShapeToolbar = () => {
  const { selectedShape, setElements, setSelectedShape, layerRef } =
    useContext(SidebarEditorContext);

  const [elementFill, setElementFill] = React.useState(
    selectedShape?.getAttr("fill") ?? "#000000"
  );
  const [stroke, setStroke] = React.useState(
    selectedShape?.getAttr("stroke") || "#000000"
  );
  const [strokeWidth, setStrokeWidth] = React.useState(
    selectedShape?.getAttr("strokeWidth") ?? 1
  );

  const [opacityValue, setOpacityValue] = React.useState(
    selectedShape?.getAttr("opacity")
      ? Number(selectedShape?.getAttr("opacity")) * 100
      : 100
  );
  const [shadowOpacity, setShadowOpacity] = React.useState(
    selectedShape?.getAttr("shadowOpacity") ?? 1
  );
  const [shadowColor, setShadowColor] = React.useState("#000000");
  const [shadowOffsetX, setShadowOffsetX] = React.useState(
    selectedShape?.getAttr("shadowOffsetX") ?? 0
  );
  const [shadowOffsetY, setShadowOffsetY] = React.useState(
    selectedShape?.getAttr("shadowOffsetY") ?? 0
  );
  const [shadowBlur, setShadowBlur] = React.useState(
    selectedShape?.getAttr("shadowBlur") ?? 1
  );
  useEffect(() => {
    setElementFill(selectedShape?.getAttr("fill") ?? "#000000");
  }, [selectedShape]);

  return (
    <div className="flex bg-white fixed top-0 mt-4 border rounded-2xl shadow-sm">
      <div className="flex flex-row items-center gap-2 p-2">
        <input
          type="color"
          value={elementFill as string}
          onChange={(e) => {
            setElementFill(e.target.value);
            selectedShape?.setAttr("fill", e.target.value);
          }}
        />
        <Tooltip>
          <Popover>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button className="cursor-pointer bg-transparent hover:bg-gray-200 text-black shadow-none">
                  <Layers />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Arrange Layer</TooltipContent>
            <PopoverContent className="flex flex-col max-w-[200px] gap-2">
              <Button
                className="bg-white text-black shadow-lg hover:shadow-sm cursor-pointer hover:bg-gray-200/50"
                onClick={() => {
                  selectedShape?.moveToTop();
                }}
              >
                Bring to front
              </Button>
              <Button
                className="bg-white text-black shadow-lg hover:shadow-sm cursor-pointer hover:bg-gray-200/50"
                onClick={() => {
                  selectedShape?.moveUp();
                }}
              >
                Bring forward
              </Button>
              <Button
                className="bg-white text-black shadow-lg hover:shadow-sm cursor-pointer hover:bg-gray-200/50"
                onClick={() => {
                  selectedShape?.moveDown();
                }}
              >
                Send backward
              </Button>
              <Button
                className="bg-white text-black shadow-lg hover:shadow-sm cursor-pointer hover:bg-gray-200/50"
                onClick={() => {
                  selectedShape?.moveToBottom();
                }}
              >
                Send to back
              </Button>
            </PopoverContent>
          </Popover>
        </Tooltip>

        <Tooltip>
          <Popover>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    selectedShape?.setAttr("strokeEnabled", true);
                  }}
                  size={"icon"}
                  className="cursor-pointer bg-transparent hover:bg-gray-200 text-black shadow-none"
                >
                  <Circle className="size-6" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <PopoverContent>
              <div className="flex items-center gap-3 justify-center">
                <input
                  type="color"
                  id="stroke"
                  value={stroke as string}
                  onChange={(e) => {
                    setStroke(e.target.value);
                    selectedShape?.setAttr("stroke", e.target.value);
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Label>Stroke Width</Label>
                  <input
                    type="number"
                    className="w-full h-10 p-0 border border-gray-300 rounded"
                    value={strokeWidth}
                    onChange={(e) => {
                      setStrokeWidth(Number(e.target.value));
                      selectedShape?.setAttr(
                        "strokeWidth",
                        Number(e.target.value)
                      );
                    }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <TooltipContent>Shape Outline</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Popover>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    selectedShape?.setAttr("shadowEnabled", true);
                  }}
                  size={"icon"}
                  className="cursor-pointer bg-transparent hover:bg-gray-200 text-black shadow-none"
                >
                  <BoxSelectIcon className="size-6" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4 justify-center">
                <input
                  type="color"
                  value={shadowColor as string}
                  onChange={(e) => {
                    setShadowColor(e.target.value);
                    selectedShape?.setAttr("shadowColor", e.target.value);
                  }}
                />
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex flex-col gap-2">
                    <Label>Shadow Offset X</Label>
                    <input
                      type="number"
                      className="w-full h-10 p-0 border border-gray-300 rounded"
                      value={shadowOffsetX}
                      onChange={(e) => {
                        setShadowOffsetX(Number(e.target.value));
                        selectedShape?.setAttr(
                          "shadowOffsetX",
                          Number(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Shadow Offset Y</Label>
                    <input
                      type="number"
                      className="w-full h-10 p-0 border border-gray-300 rounded"
                      value={shadowOffsetY}
                      onChange={(e) => {
                        setShadowOffsetY(Number(e.target.value));
                        selectedShape?.setAttr(
                          "shadowOffsetY",
                          Number(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Shadow Blur</Label>
                  <input
                    type="number"
                    className="w-full h-10 p-0 border border-gray-300 rounded"
                    value={shadowBlur}
                    onChange={(e) => {
                      setShadowBlur(Number(e.target.value));
                      selectedShape?.setAttr(
                        "shadowBlur",
                        Number(e.target.value)
                      );
                    }}
                  />
                </div>
                <div className="flex mt-2 flex-col">
                  <Label>Shadow Opacity</Label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                      value={shadowOpacity}
                      onChange={(e) => {
                        setShadowOpacity(Number(e.target.value));
                        selectedShape?.setAttr(
                          "shadowOpacity",
                          Number(e.target.value)
                        );
                      }}
                    />
                    <span>{shadowOpacity}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <TooltipContent>Shape Shadow</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Popover>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  size={"icon"}
                  className="cursor-pointer bg-transparent hover:bg-gray-200 text-black shadow-none"
                >
                  <Blend className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <PopoverContent>
              <div className="flex items-center justify-center">
                <Slider
                  value={[opacityValue]}
                  onValueChange={(value) => {
                    setOpacityValue(value[0]);
                    selectedShape?.setAttr("opacity", value[0] / 100);
                  }}
                  max={100}
                  step={1}
                />
                <span>{opacityValue}%</span>
              </div>
            </PopoverContent>
          </Popover>
          <TooltipContent>Text Transparency</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ShapeToolbar;
