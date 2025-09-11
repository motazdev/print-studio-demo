"use client";
import React, { useContext, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Layer, Stage, Text } from "react-konva";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

const TextEffects = () => {
  const { selectedElement } = useContext(SidebarEditorContext);
  const [selectedEffect, setSelectedEffect] = React.useState("");
  const [shadowColor, setShadowColor] = React.useState("#000000");
  const [shadowOffsetX, setShadowOffsetX] = React.useState(
    selectedElement?.getAttr("shadowOffsetX") ?? 0
  );
  const [shadowOffsetY, setShadowOffsetY] = React.useState(
    selectedElement?.getAttr("shadowOffsetY") ?? 0
  );
  const [shadowBlur, setShadowBlur] = React.useState(
    selectedElement?.getAttr("shadowBlur") ?? 1
  );
  const [strokeEnabled, setStrokeEnabled] = React.useState(
    selectedElement?.getAttr("strokeEnabled") ?? false
  );
  //Outline
  const [stroke, setStroke] = React.useState(
    selectedElement?.getAttr("stroke") ?? "#000000"
  );
  const [strokeWidth, setStrokeWidth] = React.useState(
    selectedElement?.getAttr("strokeWidth") ?? 1
  );
  const [shadowOpacity, setShadowOpacity] = React.useState(
    selectedElement?.getAttr("shadowOpacity") ?? 1
  );
  useEffect(() => {
    if (selectedEffect === "shadow") {
      selectedElement?.setAttr("shadowEnabled", true);
      selectedElement?.setAttr("shadowBlur", 1);
      selectedElement?.setAttr("stroke", undefined);
      selectedElement?.setAttr("shadowColor", "#000000");
    } else if (selectedEffect === "outline") {
      selectedElement?.setAttr("shadowEnabled", false);
      selectedElement?.setAttr("shadowBlur", 0);
      selectedElement?.setAttr("shadowColor", undefined);
      selectedElement?.setAttr("stroke", "#000000");
    }
  }, [selectedEffect, selectedElement]);
  return (
    <RadioGroup
      value={selectedEffect}
      onValueChange={setSelectedEffect}
      className="grid grid-cols-2 gap-2"
    >
      <div
        className={`box-effect border rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
          selectedEffect === "outline"
            ? "border-blue-500 ring-2 ring-blue-400"
            : "border"
        }`}
        onClick={() => setSelectedEffect("outline")}
      >
        <RadioGroupItem
          value="outline"
          id="effect-outline"
          className="hidden"
        />
        <Label htmlFor="effect-outline">Outline</Label>
        {typeof window !== "undefined" && (
          <Stage height={100} width={100}>
            <Layer>
              <Text
                text="Aa"
                id="Outline_text"
                fill="black"
                fontSize={56}
                stroke={"red"}
                strokeWidth={1}
                x={0}
                y={0}
                width={100}
                height={100}
                align="center"
                verticalAlign="middle"
              />
            </Layer>
          </Stage>
        )}
      </div>
      <div
        className={`box-effect border rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
          selectedEffect === "shadow"
            ? "border-blue-500 ring-2 ring-blue-400"
            : "border"
        }`}
        onClick={() => setSelectedEffect("shadow")}
      >
        <RadioGroupItem value="shadow" id="effect-shadow" className="hidden" />
        <Label htmlFor="effect-shadow">Shadow</Label>
        {typeof window !== "undefined" && (
          <Stage height={100} width={100}>
            <Layer>
              <Text
                text="Aa"
                id="Outline_text"
                fill="black"
                fontSize={56}
                shadowColor="red"
                shadowBlur={10}
                x={0}
                y={0}
                width={100}
                height={100}
                align="center"
                verticalAlign="middle"
              />
            </Layer>
          </Stage>
        )}
      </div>
      {selectedEffect === "shadow" && (
        <div className="flex flex-col col-span-2 gap-2 mt-4">
          <div className="w-[70%]">
            <Label>Shadow Color</Label>
            <input
              type="color"
              className="w-full h-10 p-0 border-0"
              value={shadowColor}
              onChange={(e) => {
                setShadowColor(e.target.value);
                selectedElement?.setAttr("shadowEnabled", true);
                selectedElement?.setAttr("shadowColor", e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full ">
            <div className="flex flex-col gap-2">
              <Label>Shadow Offset X</Label>
              <input
                type="number"
                className="w-full h-10 p-0 border border-gray-300 rounded"
                value={shadowOffsetX}
                onChange={(e) => {
                  setShadowOffsetX(Number(e.target.value));
                  selectedElement?.setAttr(
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
                  selectedElement?.setAttr(
                    "shadowOffsetY",
                    Number(e.target.value)
                  );
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 my-2">
            <Label>Shadow Blur</Label>
            <input
              type="number"
              className="w-full h-10 p-0 border border-gray-300 rounded"
              value={shadowBlur}
              onChange={(e) => {
                setShadowBlur(Number(e.target.value));
                selectedElement?.setAttr("shadowBlur", Number(e.target.value));
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
                  selectedElement?.setAttr(
                    "shadowOpacity",
                    Number(e.target.value)
                  );
                }}
              />
              <span>{shadowOpacity}</span>
            </div>
          </div>
        </div>
      )}
      {selectedEffect === "outline" && (
        <div className="flex flex-col col-span-2 gap-2 mt-4">
          <div className="w-[70%]">
            <Label>Outline Color</Label>
            <input
              type="color"
              className="w-full h-10 p-0 border-0"
              value={stroke}
              onChange={(e) => {
                setStroke(e.target.value);
                selectedElement?.setAttr("stroke", e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full ">
            <div className="flex flex-col gap-2">
              <Label>Stroke Width</Label>
              <input
                type="number"
                className="w-full h-10 p-0 border border-gray-300 rounded"
                value={strokeWidth}
                onChange={(e) => {
                  setStrokeWidth(Number(e.target.value));
                  selectedElement?.setAttr(
                    "strokeWidth",
                    Number(e.target.value)
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </RadioGroup>
  );
};

export default TextEffects;
