"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { template } from "@/constants/index";
import Konva from "konva";
import { Node, NodeConfig } from "konva/lib/Node";

export const SidebarEditorContext = React.createContext<{
  elements: Konva.TextConfig[];
  setElements: React.Dispatch<React.SetStateAction<Konva.TextConfig[]>>;
  setImages: React.Dispatch<React.SetStateAction<Konva.ImageConfig[]>>;
  setShapes: React.Dispatch<React.SetStateAction<Konva.ShapeConfig[]>>;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<Node<NodeConfig> | null>
  >;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<Node<NodeConfig> | null>
  >;
  images: Konva.ImageConfig[];
  stageRef: React.RefObject<Konva.Stage | null>;

  shapes: Konva.ShapeConfig[];
  selectedElement: Node<NodeConfig> | null;
  selectedShape: Node<NodeConfig> | null;
  setSelectedShape: React.Dispatch<
    React.SetStateAction<Node<NodeConfig> | null>
  >;
  selectedImage: Node<NodeConfig> | null;
  openedTab: "text" | "other" | null;
  setOpenedTab: React.Dispatch<React.SetStateAction<"text" | "other" | null>>;
  cropMode: string | null;
  setCropMode: React.Dispatch<React.SetStateAction<string | null>>;
  cropArea: { x: number; y: number; width: number; height: number } | null;
  setCropArea: (
    value:
      | ({
          x: number;
          y: number;
          width: number;
          height: number;
        } | null)
      | ((
          prevState: {
            x: number;
            y: number;
            width: number;
            height: number;
          } | null
        ) => { x: number; y: number; width: number; height: number } | null)
  ) => void;
  applyCrop: () => void;
  layerRef?: React.RefObject<Konva.Layer | null>;
  cancelCrop: () => void;
  updateElement?: (id: string, updates: Partial<Konva.TextConfig>) => void;
  updateImage: (id: string, updates: Partial<Konva.ImageConfig>) => void;
  cropPreviewCanvas: HTMLCanvasElement | null;
  setCropPreviewCanvas: React.Dispatch<
    React.SetStateAction<HTMLCanvasElement | null>
  >;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedId: string | null;
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedImageId: string | null;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedShapeId: string | null;
  downloadCropAsBlob: () => Promise<Blob | null>;
  handleDeselect: () => void;
  handleExport: () => void;

  handleSelect: (
    node: Node<NodeConfig>,
    id: string,
    type: "text" | "image"
  ) => void;
  undo: () => void;
  redo: () => void;
}>({
  images: template.images,
  shapes: template.shapes,
  elements: template.elements,
  setElements: () => {},
  setImages: () => {},
  setShapes: () => {},
  setSelectedElement: () => {},
  setSelectedShape: () => {},
  selectedShape: null,
  setSelectedImage: () => {},
  stageRef: React.createRef<Konva.Stage>(),
  selectedElement: null,
  selectedImage: null,
  openedTab: null,
  setOpenedTab: () => {},
  cropMode: null,
  setCropMode: () => {},
  cropArea: null,
  setCropArea: () => {},
  applyCrop: () => {},
  cancelCrop: () => {},
  updateElement: () => {},
  updateImage: () => {},
  cropPreviewCanvas: null,
  setCropPreviewCanvas: () => {},
  downloadCropAsBlob: async () => null,
  setSelectedId: () => {},
  selectedId: null,
  setSelectedImageId: () => {},
  selectedImageId: null,
  setSelectedShapeId: () => {},
  selectedShapeId: null,
  layerRef: undefined,
  handleDeselect: () => {},
  handleSelect: () => {},
  handleExport: () => {},
  undo: () => {},
  redo: () => {},
});

export function SidebarEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const stageRef = useRef<Konva.Stage>(null);
  const handleExport = () => {
    if (stageRef.current === null) return;
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2, // double resolution
    });

    const link = document.createElement("a");
    link.download = "motaz.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<Node<NodeConfig> | null>(
    null
  );
  const [cropMode, setCropMode] = useState<string | null>(null);
  const [cropArea, _setCropArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [cropPreviewCanvas, setCropPreviewCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const [elements, setElements] = useState<Konva.TextConfig[]>(
    template.elements
  );
  const [images, setImages] = useState<Konva.ImageConfig[]>(template.images);
  const [shapes, setShapes] = useState<Konva.ShapeConfig[]>(template.shapes);
  const [selectedElement, setSelectedElement] =
    useState<Node<NodeConfig> | null>(null);

  const [selectedImage, setSelectedImage] = useState<Node<NodeConfig> | null>(
    null
  );
  const [openedTab, setOpenedTab] = useState<"text" | "other" | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  const setCropArea = useCallback(
    (
      value:
        | {
            x: number;
            y: number;
            width: number;
            height: number;
          }
        | ((
            prevState: {
              x: number;
              y: number;
              width: number;
              height: number;
            } | null
          ) => {
            x: number;
            y: number;
            width: number;
            height: number;
          } | null)
        | null
    ) => {
      if (typeof value === "function") {
        _setCropArea((prevState) => {
          const area = value(prevState);
          if (!area || !selectedImage) {
            return area;
          }
          const imgX = selectedImage.getAttr("x") ?? 0;
          const imgY = selectedImage.getAttr("y") ?? 0;
          const imgW = selectedImage.getAttr("width") ?? 0;
          const imgH = selectedImage.getAttr("height") ?? 0;

          const x = Math.max(area.x, imgX);
          const y = Math.max(area.y, imgY);
          let width = Math.min(area.width, imgW - (x - imgX));
          let height = Math.min(area.height, imgH - (y - imgY));

          width = Math.max(1, width);
          height = Math.max(1, height);

          return { x, y, width, height };
        });
      } else {
        if (!value || !selectedImage) {
          _setCropArea(value);
          return;
        }
        const imgX = selectedImage.getAttr("x") ?? 0;
        const imgY = selectedImage.getAttr("y") ?? 0;
        const imgW = selectedImage.getAttr("width") ?? 0;
        const imgH = selectedImage.getAttr("height") ?? 0;

        const x = Math.max(value.x, imgX);
        const y = Math.max(value.y, imgY);
        let width = Math.min(value.width, imgW - (x - imgX));
        let height = Math.min(value.height, imgH - (y - imgY));

        width = Math.max(1, width);
        height = Math.max(1, height);

        _setCropArea({ x, y, width, height });
      }
    },
    [selectedImage]
  );

  // Utility function to update image elements
  const updateImage = useCallback(
    (id: string, updates: Partial<Konva.ImageConfig>) => {
      setImages((prevImages) =>
        prevImages.map((img) => (img.id === id ? { ...img, ...updates } : img))
      );
    },
    []
  );

  const applyCrop = useCallback(async () => {
    if (cropMode && cropArea && selectedImage && cropPreviewCanvas) {
      try {
        // Convert the preview canvas to a new image
        const croppedBlob = await new Promise<Blob>((resolve) => {
          cropPreviewCanvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, "image/png");
        });

        // Create new image element from cropped data
        const croppedImageUrl = URL.createObjectURL(croppedBlob);
        const newImage = new Image();

        await new Promise<void>((resolve) => {
          newImage.onload = () => {
            // Update the image in our state with the cropped version
            updateImage(cropMode, {
              image: newImage,
              x: cropArea.x,
              y: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            });

            // Update the Konva node directly
            if (selectedImage) {
              selectedImage.setAttr("image", newImage);
              selectedImage.x(cropArea.x);
              selectedImage.y(cropArea.y);
              selectedImage.width(cropArea.width);
              selectedImage.height(cropArea.height);
              selectedImage.getLayer()?.batchDraw();
            }

            // Clean up
            URL.revokeObjectURL(croppedImageUrl);
            resolve();
          };
          newImage.src = croppedImageUrl;
        });
      } catch (error) {
        console.error("Error applying crop:", error);
      }
    }

    setCropMode(null);
    setCropArea(null);
    setCropPreviewCanvas(null);
  }, [cropMode, cropArea, selectedImage, cropPreviewCanvas, updateImage]);

  const cancelCrop = useCallback(() => {
    setCropMode(null);
    setCropArea(null);
    setCropPreviewCanvas(null);
  }, []);

  const downloadCropAsBlob = useCallback(async (): Promise<Blob | null> => {
    if (!cropPreviewCanvas) return null;

    return new Promise((resolve) => {
      cropPreviewCanvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  }, [cropPreviewCanvas]);

  const handleDeselect = useCallback(() => {
    setSelectedId(null);
    setSelectedElement(null);
    setSelectedImageId(null);
    setSelectedImage(null);
    setSelectedShapeId(null);
    setSelectedShape(null);
    // Clear transformer nodes
  }, []);

  const handleSelect = useCallback(
    (node: Node<NodeConfig>, id: string, type: "text" | "image") => {
      // Clear previous selections first
      handleDeselect();

      // Set new selection based on type
      if (type === "text") {
        setSelectedElement(node);
        setSelectedId(id);
        setOpenedTab("text");
      } else if (type === "image") {
        setSelectedImage(node);
        setSelectedImageId(id);
        setOpenedTab("other");
      }
    },
    [handleDeselect]
  );

  // History (UNDO - Redo)
  const [history, setHistory] = useState([
    {
      elements: template.elements,
      images: template.images,
      shapes: template.shapes,
    },
  ]);
  const [historyStep, setHistoryStep] = useState(0);
  const isHistoryNavigation = useRef(false); // Effect to capture state changes and add them to the history stack

  useEffect(() => {
    // If the state change was caused by an undo/redo action, don't create a new history entry
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }

    // Create a snapshot of the current state
    const currentState = { elements, images, shapes };

    // Get the history up to the current point in time
    const newHistory = history.slice(0, historyStep + 1);

    // Add the new state snapshot to the history
    setHistory([...newHistory, currentState]);

    // Move the history pointer to the latest state
    setHistoryStep(newHistory.length);
  }, [elements, images, shapes]); // This effect runs whenever canvas elements change

  const undo = useCallback(() => {
    console.log({ historyStep });
    if (historyStep === 0) {
      return; // Nothing to undo
    }

    isHistoryNavigation.current = true; // Flag to prevent creating a new history entry
    const newStep = historyStep - 1;
    const previousState = history[newStep]; // Revert to the previous state

    setElements(previousState.elements);
    setImages(previousState.images);
    setShapes(previousState.shapes);
    setHistoryStep(newStep);
    console.log("test");
    handleDeselect(); // Clear any selection
  }, [history, historyStep, handleDeselect]);

  const redo = useCallback(() => {
    if (historyStep === history.length - 1) {
      return; // Nothing to redo
    }

    isHistoryNavigation.current = true; // Flag to prevent creating a new history entry
    const newStep = historyStep + 1;
    const nextState = history[newStep]; // Move forward to the next state

    setElements(nextState.elements);
    setImages(nextState.images);
    setShapes(nextState.shapes);
    setHistoryStep(newStep);

    handleDeselect(); // Clear any selection
  }, [history, historyStep, handleDeselect]);

  // --- END OF UNDO/REDO IMPLEMENTATION ---
  return (
    <SidebarEditorContext.Provider
      value={{
        elements,
        shapes,
        setSelectedImage,
        selectedImage,
        layerRef,
        setElements,
        handleExport,
        stageRef,
        setImages,
        setShapes,
        setSelectedElement,
        selectedElement,
        openedTab,
        images,
        setOpenedTab,
        cropMode,
        setCropMode,
        cropArea,
        setCropArea,
        applyCrop,
        cancelCrop,
        selectedId,
        selectedImageId,
        setSelectedId,
        setSelectedImageId,
        updateImage,
        cropPreviewCanvas,
        setCropPreviewCanvas,
        downloadCropAsBlob,
        selectedShape,
        selectedShapeId,
        setSelectedShape,
        setSelectedShapeId,
        handleDeselect,
        handleSelect,
        undo,
        redo,
      }}
    >
      {children}
    </SidebarEditorContext.Provider>
  );
}
