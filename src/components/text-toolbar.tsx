"use client";

import {
  Blend,
  Bold,
  Italic,
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
const TextEffects = dynamic(() => import("./text-effects"), { ssr: false });
const fontFamilies = [
  "arial",
  "verdana",
  "georgia",
  "courier",
  "roboto",
  "times new roman",
];

const TextToolbar = () => {
  const { selectedElement, setElements, setSelectedElement, layerRef } =
    useContext(SidebarEditorContext);

  const [elementFill, setElementFill] = React.useState(
    selectedElement?.getAttr("fill") ?? "#000000"
  );
  const [fontFamily, setFontFamily] = React.useState(
    selectedElement?.getAttr("fontFamily") ?? "Arial"
  );
  const [fontSize, setFontSize] = React.useState(
    selectedElement?.getAttr("fontSize") ?? 24
  );
  const [textAlign, setTextAlign] = React.useState(
    selectedElement?.getAttr("textAlign") ?? "center"
  );
  const [isBold, setIsBold] = React.useState(
    selectedElement?.getAttr("fontStyle") === "bold"
  );
  const [isItalic, setIsItalic] = React.useState(
    selectedElement?.getAttr("fontStyle")?.includes("italic")
  );
  const [opacityValue, setOpacityValue] = React.useState(
    selectedElement?.getAttr("opacity")
      ? Number(selectedElement?.getAttr("opacity")) * 100
      : 100
  );
  const fontSizes = [12, 14, 16, 18, 20, 24, 32, 40, 48, 64];
  useEffect(() => {
    setFontSize(selectedElement?.getAttr("fontSize") ?? 24);
    setElementFill(selectedElement?.getAttr("fill") ?? "#000000");
    setFontFamily(selectedElement?.getAttr("fontFamily") ?? "Arial");
    setTextAlign(selectedElement?.getAttr("textAlign") ?? "center");
    setIsBold(selectedElement?.getAttr("fontStyle") === "bold");
  }, [selectedElement]);

  return (
    <div className="flex fixed top-0 mt-4 border rounded-2xl shadow-sm">
      <div className="flex flex-row items-center gap-2 p-2">
        <input
          type="color"
          value={elementFill as string}
          onChange={(e) => {
            setElementFill(e.target.value);
            selectedElement?.setAttr("fill", e.target.value);
          }}
        />
        <select
          value={fontSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setFontSize(newSize);
            selectedElement?.setAttr("fontSize", newSize);
          }}
          className="border rounded p-1"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
        <select
          value={fontFamily}
          onChange={(e) => {
            const newFamily = e.target.value;
            setFontFamily(newFamily);
            selectedElement?.setAttr("fontFamily", newFamily);
          }}
          className="border rounded p-1"
        >
          {fontFamilies.map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              className="cursor-pointer"
              pressed={false}
              onPressedChange={() => {
                let nextAlign: "left" | "center" | "right";

                if (selectedElement?.getAttr("align") === "left") {
                  nextAlign = "center";
                } else if (selectedElement?.getAttr("align") === "center") {
                  nextAlign = "right";
                } else {
                  nextAlign = "left";
                }

                selectedElement?.setAttr("align", nextAlign);
                setTextAlign(nextAlign); // keep React state in sync
              }}
            >
              {selectedElement?.getAttr("align") === "center" ? (
                <TextAlignCenter />
              ) : selectedElement?.getAttr("align") === "left" ? (
                <TextAlignStart />
              ) : (
                <TextAlignEnd />
              )}
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Text Alignment</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              className="cursor-pointer"
              pressed={isBold}
              onPressedChange={(e) => {
                setIsBold(e);
                if (selectedElement?.getAttr("fontStyle")?.includes("italic")) {
                  selectedElement.setAttr(
                    "fontStyle",
                    e ? "bold italic" : "italic"
                  );
                } else if (selectedElement) {
                  selectedElement.setAttr("fontStyle", e ? "bold" : "normal");
                }
              }}
            >
              <Bold />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold Text</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              className="cursor-pointer"
              pressed={isItalic}
              onPressedChange={(e) => {
                if (selectedElement?.getAttr("fontStyle").includes("bold")) {
                  selectedElement.setAttr(
                    "fontStyle",
                    e ? "bold italic" : "bold"
                  );
                  setIsItalic(e);
                } else if (selectedElement) {
                  setIsItalic(e);
                  selectedElement.setAttr("fontStyle", e ? "italic" : "normal");
                }
              }}
            >
              <Italic />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic Text</TooltipContent>
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
                    selectedElement?.setAttr("opacity", value[0] / 100);
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
        <Popover>
          <PopoverTrigger asChild>
            <TabsList>
              <TabsTrigger value="text-effects" asChild>
                <button>Effects</button>
              </TabsTrigger>
            </TabsList>
          </PopoverTrigger>
        </Popover>
      </div>
    </div>
  );
};

export default TextToolbar;
