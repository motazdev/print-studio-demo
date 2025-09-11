import React, { useContext, useEffect } from "react";
import { Circle, Ellipse, Layer, Rect, Stage } from "react-konva";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";
import Konva from "konva";

const ShapesList = () => {
  const { layerRef, setShapes } = useContext(SidebarEditorContext);

  const addShape = (shape: string) => {
    setShapes((prev) => [
      ...prev,
      {
        type:
          shape === "rect" || shape === "rectangle"
            ? "rect"
            : shape === "circle"
            ? "circle"
            : "ellipse",
        id: `${shape}-${Date.now()}`,
        x: 20,
        y: 20,
        width: 100,
        height: 100,
        strokeEnabled: false,
        fill: "black",
      },
    ]);
    // if (layerRef?.current) {
    //   if (shape === "circle") {
    //   } else if (shape === "rectangle") {
    //     const rect = new Konva.Rect({
    //       id: `rect-${Date.now()}`,
    //       x: 20,
    //       y: 20,
    //       width: 100,
    //       height: 50,
    //       fill: "red",
    //     });
    //     layerRef?.current.add(rect);
    //     layerRef?.current.draw();
    //   } else if (shape === "ellipse") {
    //     const ellipse = new Konva.Ellipse({
    //       id: `ellipse-${Date.now()}`,
    //       x: 50,
    //       y: 50,
    //       radiusX: 20,
    //       radiusY: 40,
    //       fill: "blue",
    //     });
    //     layerRef?.current.add(ellipse);
    //     layerRef?.current.draw();
    //   }
    // }
  };
  return (
    <div className="grid grid-cols-3 gap-1">
      <Stage
        onClick={() => addShape("circle")}
        width={100}
        height={100}
        className="rounded-2xl border flex justify-center items-center w-full py-4"
      >
        <Layer>
          <Circle x={50} y={50} radius={100} width={60} stroke={"black"} />
        </Layer>
      </Stage>
      <Stage
        onClick={() => addShape("rectangle")}
        width={100}
        height={100}
        className="rounded-2xl border flex justify-center items-center w-full py-4"
      >
        <Layer>
          <Rect x={20} y={20} height={60} width={60} stroke={"black"} />
        </Layer>
      </Stage>
      <Stage
        width={100}
        onClick={() => addShape("ellipse")}
        height={100}
        className="rounded-2xl border flex justify-center items-center w-full py-4"
      >
        <Layer>
          <Ellipse
            radiusX={20}
            radiusY={40}
            x={50}
            y={50}
            radius={100}
            width={50}
            stroke={"black"}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default ShapesList;
