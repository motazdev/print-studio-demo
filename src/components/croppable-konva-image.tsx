"use client";
import Konva from "konva";
import React, { useContext, useEffect, useRef } from "react";
import { Image as KonvaImage, Rect, Transformer } from "react-konva";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

const CroppableKonvaImage: React.FC<Konva.ImageConfig> = ({
  id,
  x,
  y,
  width,
  height,
  image,
  draggable,
  onDragStart,
  onClick,
}) => {
  const { cropMode, setCropArea, cropArea } = useContext(SidebarEditorContext);
  const imageRef = useRef<any>(null);
  const cropRectRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const isCropping = cropMode === id;

  // Initialize crop area when entering crop mode
  useEffect(() => {
    if (isCropping && !cropArea && width && height && x && y) {
      const defaultCropArea = {
        x: x + width * 0.1,
        y: y + height * 0.1,
        width: width * 0.8,
        height: height * 0.8,
      };
      setCropArea(defaultCropArea);
    }
  }, [isCropping, cropArea, x, y, width, height, setCropArea]);

  // Attach transformer to crop rectangle
  useEffect(() => {
    if (isCropping && cropRectRef.current && transformerRef.current) {
      transformerRef.current.nodes([cropRectRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isCropping, cropArea]);

  const handleCropTransform = () => {
    if (cropRectRef.current) {
      const node = cropRectRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale and update dimensions
      node.scaleX(1);
      node.scaleY(1);

      const newCropArea = {
        x: node.x(),
        y: node.y(),
        width: Math.max(node.width() * scaleX, 10),
        height: Math.max(node.height() * scaleY, 10),
      };

      setCropArea(newCropArea);
    }
  };

  return (
    <>
      {/* Main Image */}
      <KonvaImage
        ref={imageRef}
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        image={image}
        draggable={draggable && !isCropping}
        onDragStart={onDragStart}
        onClick={onClick}
        opacity={isCropping ? 0.5 : 1}
      />

      {/* Crop Overlay */}
      {isCropping && cropArea && (
        <>
          {/* Crop Rectangle */}
          <Rect
            ref={cropRectRef}
            x={cropArea.x}
            y={cropArea.y}
            width={cropArea.width}
            height={cropArea.height}
            stroke="#007bff"
            strokeWidth={2}
            fill="transparent"
            draggable
            onTransform={handleCropTransform}
            onDragEnd={(e) => {
              setCropArea({
                ...cropArea,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />

          {/* Transformer for resizing */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Constrain crop area to image bounds
              if (x && y && width && height) {
                const minX = x;
                const minY = y;
                const maxX = x + width;
                const maxY = y + height;

                return {
                  ...newBox,
                  x: Math.max(minX, Math.min(newBox.x, maxX - newBox.width)),
                  y: Math.max(minY, Math.min(newBox.y, maxY - newBox.height)),
                  width: Math.max(10, Math.min(newBox.width, maxX - newBox.x)),
                  height: Math.max(
                    10,
                    Math.min(newBox.height, maxY - newBox.y)
                  ),
                };
              }

              return {
                ...newBox,
              };
            }}
          />
        </>
      )}
    </>
  );
};

export default CroppableKonvaImage;
