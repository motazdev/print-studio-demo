"use client";

import { template } from "@/constants";
import { cn } from "@/lib/utils";
import Konva from "konva";
import { NodeConfig } from "konva/lib/Node";
import "quill/dist/quill.snow.css";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Circle,
  Ellipse,
  Image as KonvaImage,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import { Html } from "react-konva-utils";
import ImageCropperModal from "./image-cropper-modal";
import ImageDisplay from "./imagedisplay";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";
import { Textarea } from "./ui/textarea";
export function useImageUrl(url: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);

  return image;
}

export default function TemplateEditor() {
  const {
    elements,
    setSelectedElement,
    openedTab,
    selectedShape,
    shapes,
    layerRef,
    setElements,
    selectedId,
    setSelectedId,
    selectedImageId,
    setImageToCrop,
    setSelectedImageId,
    images,
    handleCropCancel,
    handleCropSave,
    setSelectedShape,
    selectedShapeId,
    selectedImage,
    setSelectedShapeId,
    isCropping,
    imageToCrop,
    setIsCropping,
    handleDeselect,
    selectedElement,
    setImages,
    setSelectedImage,
    stageRef,
  } = useContext(SidebarEditorContext);
  const tt = useImageUrl(template.background?.src || "");
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const handleTextSelect = (element: NodeConfig) => {
    setIsEditingText(true);
    handleDeselect();

    const node = layerRef?.current?.findOne(`#${element.id}`);
    setSelectedId(element.id || null);
    setSelectedElement(node || null);
  };
  const handleImageSelect = (element: NodeConfig) => {
    handleDeselect();

    const node = layerRef?.current?.findOne(`#${element.id}`);
    setSelectedImageId(element.id || null);
    setSelectedImage(node || null);
  };
  const handleShapeSelect = (element: NodeConfig) => {
    handleDeselect();
    const node = layerRef?.current?.findOne(`#${element.id}`);
    setSelectedShapeId(element.id || null);
    setSelectedShape(node || null);
  };

  const sceneWidth = 600;
  const sceneHeight = 400;

  // Get current text for selected element

  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const updateSize = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    const scale = containerWidth / sceneWidth;

    setStageSize({
      width: sceneWidth * scale,
      height: sceneHeight * scale,
      scale: scale,
    });
  };
  const [text, setText] = useState<null | string>(null);
  useEffect(() => {
    if (selectedElement && selectedElement.getAttr("text")) {
      setText(selectedElement.getAttr("text"));
    }
  }, [selectedElement]);
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Function to update text in the elements array
  // Handle real-time text updates
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedElement && selectedId) {
      const newText = e.target.value;
      // Update the Konva node immediately
      selectedElement.setAttr("text", newText);
      // Force redraw
      layerRef?.current?.batchDraw();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        if (layerRef) {
          if (layerRef && (selectedElement || selectedShape || selectedImage)) {
            handleDeselect();
            layerRef?.current
              ?.findOne(`#${selectedElement?.getAttr("id")}`)
              ?.destroy();
            layerRef?.current
              ?.findOne(`#${selectedShape?.getAttr("id")}`)
              ?.destroy();
            layerRef?.current
              ?.findOne(`#${selectedImage?.getAttr("id")}`)
              ?.destroy();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedId,
    selectedElement,
    selectedShape,
    handleDeselect,
    selectedImage,
    layerRef,
  ]);
  return (
    <>
      <div
        ref={containerRef}
        className={cn("flex gap-4  relative", !!openedTab ? "" : "")}
      >
        {typeof window !== "undefined" && (
          <Stage
            className="bg-white"
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={stageSize.scale}
            scaleY={stageSize.scale}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                handleDeselect();
              }
            }}
          >
            <Layer ref={layerRef}>
              {selectedElement && isEditingText && (
                <Html>
                  <div
                    style={{
                      position: "absolute",
                      top: selectedElement.y() ? selectedElement.y() - 60 : 0,
                      left: selectedElement.x()
                        ? selectedElement.x() + (selectedElement.width() - 180)
                        : 0,
                      resize: "none",
                    }}
                    className="rounded-2xl bg-white w-40  p-2"
                  >
                    <Textarea
                      ref={textareaRef}
                      onChange={handleTextareaChange}
                      defaultValue={selectedElement.getAttr("text") || ""}
                      key={selectedId} // Force remount when different text is selected
                      className="  !min-h-8 resize-none max-h-10 px-2 shadow-sm border-0 rounded-lg bg-white"
                    />
                  </div>
                </Html>
              )}
              {tt && (
                <KonvaImage
                  image={tt}
                  width={600}
                  id={"bg-image"}
                  height={400}
                  listening={true}
                  draggable
                  onClick={() => {
                    handleDeselect();
                    setSelectedImageId("bg-image");
                    setSelectedImage(
                      layerRef?.current?.findOne(`#bg-image`) || null
                    );
                  }}
                />
              )}
              {elements.map((el, i) =>
                el.type === "text" ? (
                  <Text
                    id={el.id}
                    key={i}
                    text={el.text}
                    x={el.x}
                    y={el.y}
                    align={el.textAlign}
                    fontSize={el.fontSize}
                    fontFamily={el.fontFamily}
                    fill={el.fill}
                    fontStyle={el.fontStyle}
                    shadowColor={el.shadowColor}
                    shadowOpacity={el.shadowOpacity}
                    shadowBlur={el.shadowBlur}
                    shadowOffsetX={el.shadowOffsetX}
                    shadowOffsetY={el.shadowOffsetY}
                    shadowEnabled={el.shadowEnabled}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    draggable
                    opacity={el.opacity}
                    onDragStart={() => {
                      handleTextSelect(el);
                      setIsEditingText(false);
                    }}
                    onClick={() => handleTextSelect(el)}
                    onTap={() => handleTextSelect(el)}
                    width={200}
                    onTransform={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();

                      node.width(node.width() * scaleX);

                      node.scaleX(1);
                    }}
                  />
                ) : null
              )}
              {isCropping && imageToCrop && (
                <Html>
                  <ImageCropperModal
                    imageUrl={imageToCrop.src}
                    onSave={handleCropSave}
                    onClose={handleCropCancel}
                  />
                </Html>
              )}
              {images.map((el, i) =>
                el.type === "image" ? (
                  // <CroppableKonvaImage
                  //   id={el.id}
                  //   key={i}
                  //   x={el.x}
                  //   y={el.y}
                  //   width={el.width}
                  //   height={el.height}
                  //   image={el.image}
                  //   draggable
                  //   onDragStart={() => handleImageSelect(el)}
                  //   onClick={() => handleImageSelect(el)}
                  // />
                  <ImageDisplay
                    key={el.id}
                    el={el}
                    handleImageSelect={handleImageSelect}
                  />
                ) : null
              )}
              {shapes.map((el, i) => {
                if (el.type === "circle") {
                  return (
                    <Circle
                      id={el.id}
                      key={i}
                      shadowBlur={el.shadowBlur}
                      shadowColor={el.shadowColor}
                      shadowEnabled={el.shadowEnabled}
                      shadowOffsetX={el.shadowOffsetX}
                      shadowOffsetY={el.shadowOffsetY}
                      x={el.x}
                      y={el.y}
                      radius={el.radius || el.width || 20 / 2}
                      width={el.width}
                      height={el.height}
                      draggable
                      stroke={el.stroke || "#ffffff"}
                      strokeEnabled={el.strokeEnabled}
                      // fillAfterStrokeEnabled={false}
                      strokeWidth={el.strokeWidth || 1}
                      fill={el.fill}
                      onDragStart={() => handleShapeSelect(el)}
                      onClick={() => handleShapeSelect(el)}
                    />
                  );
                } else if (el.type === "rect" || el.type === "rectangle") {
                  return (
                    <Rect
                      id={el.id}
                      key={i}
                      x={el.x}
                      y={el.y}
                      fill={el.fill}
                      width={el.width}
                      height={el.height}
                      stroke={el.stroke || "#ffffff"}
                      strokeEnabled={el.strokeEnabled}
                      // fillAfterStrokeEnabled={false}
                      strokeWidth={el.strokeWidth || 1}
                      draggable
                      onDragStart={() => handleShapeSelect(el)}
                      onClick={() => handleShapeSelect(el)}
                    />
                  );
                } else if (el.type === "ellipse") {
                  return (
                    <Ellipse
                      id={el.id}
                      key={i}
                      x={el.x}
                      stroke={el.stroke || "#ffffff"}
                      strokeEnabled={el.strokeEnabled}
                      // fillAfterStrokeEnabled={false}
                      strokeWidth={el.strokeWidth || 1}
                      y={el.y}
                      fill={el.fill}
                      radiusX={el.radiusX || 40}
                      radiusY={el.radiusY || 100}
                      draggable
                      onDragStart={() => handleShapeSelect(el)}
                      onClick={() => handleShapeSelect(el)}
                    />
                  );
                }
                return null;
              })}
              <Transformer
                ref={transformerRef}
                nodes={
                  selectedId
                    ? [
                        transformerRef.current
                          ?.getStage()
                          ?.findOne(`#${selectedId}`),
                      ]
                    : []
                }
                anchorCornerRadius={4}
                rotateLineVisible={false}
                enabledAnchors={["middle-left", "middle-right"]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50) return oldBox;
                  return newBox;
                }}
              />
              <Transformer
                nodes={
                  selectedId
                    ? [
                        transformerRef.current
                          ?.getStage()
                          ?.findOne(`#${selectedId}`),
                      ]
                    : []
                }
                ref={transformerRef}
                rotateEnabled={true}
                ignoreStroke={true}
                rotateLineVisible={false}
                rotateAnchorOffset={0}
                onTransformStart={() => setIsEditingText(false)}
                rotationSnaps={[]} // Disable automatic snapping
                // Prevent the automatic flip
                flipEnabled={false}
                anchorStyleFunc={(anchor) => {
                  if (anchor.hasName("rotater") && selectedElement) {
                    anchor.fill("orange");
                    anchor.stroke("black");
                    anchor.cornerRadius(100);
                    anchor.strokeWidth(2);
                    anchor.fill("white");
                    anchor.on("mouseenter", () => {
                      document.body.style.cursor = "url('/image.png'), auto";
                    });
                    anchor.on("mouseleave", () => {
                      document.body.style.cursor = "default";
                    });
                  }
                }}
                rotateAnchorCursor={"url('/image.png'), auto"}
                enabledAnchors={[]}
                // Handle transform events to prevent unwanted flipping
                onTransform={() => {
                  const node = transformerRef.current
                    ?.getStage()
                    ?.findOne(`#${selectedId}`);
                  if (node) {
                    // Keep rotation within -180 to 180 range without auto-flipping
                    let rotation = node.rotation();
                    if (rotation > 180) rotation -= 360;
                    if (rotation < -180) rotation += 360;
                    node.rotation(rotation);
                  }
                }}
              />
              <Transformer
                ref={transformerRef}
                nodes={
                  selectedImageId
                    ? [
                        transformerRef.current
                          ?.getStage()
                          ?.findOne(`#${selectedImageId}`),
                      ]
                    : []
                }
                anchorCornerRadius={4}
                enabledAnchors={[
                  "middle-left",
                  "middle-right",
                  "top-left",
                  "top-right",
                  "bottom-right",
                  "bottom-left",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50) return oldBox;
                  return newBox;
                }}
              />
              <Transformer
                ref={transformerRef}
                nodes={
                  selectedShapeId
                    ? [
                        transformerRef.current
                          ?.getStage()
                          ?.findOne(`#${selectedShapeId}`),
                      ]
                    : []
                }
                resizeEnabled={true}
                anchorStyleFunc={(anchor) => {
                  if (
                    anchor.hasName("top-left") ||
                    anchor.hasName("top-right") ||
                    anchor.hasName("bottom-left") ||
                    anchor.hasName("bottom-right")
                  ) {
                    anchor.size({ width: 8, height: 8 });
                  }
                  if (anchor.hasName("middle-left")) {
                    const node = transformerRef.current?.nodes()[0];
                    if (node) {
                      const nodeHeight = node.height() * node.scaleY();
                      const nodeWidth = node.width() * node.scaleX();
                      anchor.height(nodeHeight);
                      anchor.width(4);
                      anchor.x(0); // Position at the left edge (opposite of right edge positioning)
                      anchor.y(0);
                      anchor.offsetX(0);
                      anchor.offsetY(-2.8);
                      anchor.fill("transparent");
                      anchor.stroke("transparent");
                    }
                  }
                  if (anchor.hasName("middle-right")) {
                    const node = transformerRef.current?.nodes()[0];
                    if (node) {
                      // Check if it's a circle
                      const nodeHeight = node.height() * node.scaleY();
                      const nodeWidth = node.width() * node.scaleX();
                      if (node.className === "Circle") {
                        anchor.height(nodeHeight);
                        anchor.width(4);
                        anchor.x(node.width() * node.scaleX() - 1);
                        anchor.y(0);
                        anchor.offsetX(0);
                        anchor.offsetY(0);
                        anchor.fill("transparent");
                        anchor.stroke("transparent");
                      } else {
                        const nodeHeight = node.height() * node.scaleY();
                        const nodeWidth = node.width() * node.scaleX();
                        anchor.height(nodeHeight);
                        anchor.width(4);
                        anchor.x(nodeWidth);
                        anchor.y(0);
                        anchor.offsetX(0);
                        anchor.offsetY(-2.8);
                        anchor.fill("transparent");
                        anchor.stroke("transparent");
                      }
                    }
                  }
                  if (anchor.hasName("top-center")) {
                    const node = transformerRef.current?.nodes()[0];
                    if (node) {
                      const nodeHeight = node.height() * node.scaleY();
                      const nodeWidth = node.width() * node.scaleX();
                      anchor.width(nodeWidth);
                      anchor.height(5);
                      anchor.x(0);
                      anchor.y(0);
                      anchor.offsetX(-2.8);
                      anchor.offsetY(0);
                      anchor.fill("transparent");
                      anchor.stroke("transparent");
                    }
                  }
                  if (anchor.hasName("bottom-center")) {
                    const node = transformerRef.current?.nodes()[0];
                    if (node) {
                      const nodeHeight = node.height() * node.scaleY();
                      const nodeWidth = node.width() * node.scaleX();
                      anchor.width(nodeWidth);
                      anchor.height(5);
                      anchor.x(0);
                      anchor.y(nodeHeight + 1);
                      anchor.offsetX(-2.5);
                      anchor.offsetY(0.5);
                      anchor.fill("transparent");
                      anchor.stroke("transparent");
                    }
                  }
                }}
                anchorCornerRadius={4}
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                  "top-center",
                  "bottom-center",
                  "middle-left",
                  "middle-right",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
              <Transformer
                ref={transformerRef}
                nodes={
                  selectedShapeId
                    ? [transformerRef.current?.getStage()?.findOne(`#bg-image`)]
                    : []
                }
                resizeEnabled={true}
                anchorCornerRadius={4}
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                  "top-center",
                  "bottom-center",
                  "middle-left",
                  "middle-right",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        )}
      </div>
    </>
  );
}
