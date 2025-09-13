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
  setIsCropping: React.Dispatch<React.SetStateAction<boolean>>;
  images: Konva.ImageConfig[];
  stageRef: React.RefObject<Konva.Stage | null>;
  isCropping: boolean;
  shapes: Konva.ShapeConfig[];
  selectedElement: Node<NodeConfig> | null;
  selectedShape: Node<NodeConfig> | null;
  setSelectedShape: React.Dispatch<
    React.SetStateAction<Node<NodeConfig> | null>
  >;
  handleCropCancel: () => void;
  selectedImage: Node<NodeConfig> | null;
  openedTab: "text" | "other" | null;
  setOpenedTab: React.Dispatch<React.SetStateAction<"text" | "other" | null>>;

  layerRef?: React.RefObject<Konva.Layer | null>;
  updateElement?: (id: string, updates: Partial<Konva.TextConfig>) => void;
  updateImage: (id: string, updates: Partial<Konva.ImageConfig>) => void;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedId: string | null;
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedImageId: string | null;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedShapeId: string | null;
  handleDeselect: () => void;
  handleCropSave: (newImageUrl: string) => void;
  handleExport: () => void;
  imageToCrop: Konva.ImageConfig | null;
  setImageToCrop: React.Dispatch<
    React.SetStateAction<Konva.ImageConfig | null>
  >;
  handleSelect: (
    node: Node<NodeConfig>,
    id: string,
    type: "text" | "image"
  ) => void;
  undo: () => void;
  redo: () => void;
}>({
  imageToCrop: null,
  images: template.images,
  shapes: template.shapes,
  setImageToCrop: () => {},
  elements: template.elements,
  setElements: () => {},
  setImages: () => {},
  setShapes: () => {},
  isCropping: false,

  setSelectedElement: () => {},
  setSelectedShape: () => {},
  selectedShape: null,
  setSelectedImage: () => {},
  handleCropSave: () => {},
  stageRef: React.createRef<Konva.Stage>(),
  selectedElement: null,
  selectedImage: null,
  openedTab: null,
  handleCropCancel: () => {},
  setOpenedTab: () => {},
  updateElement: () => {},
  updateImage: () => {},
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
  setIsCropping: () => {},
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

  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<null | Konva.ImageConfig>(
    null
  );
  const handleCropSave = (newImageUrl: string) => {
    console.log({ newImageUrl });

    const newImg = new window.Image();
    newImg.crossOrigin = "anonymous"; // safe if you export later
    newImg.src = newImageUrl;
    newImg.onload = () => {
      // update Konva node directly
      selectedImage?.setAttr("image", newImg);
      selectedImage?.getLayer()?.batchDraw();

      // also update your React state if needed
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === selectedImage?.getAttr("id")
            ? { ...img, image: newImg, src: newImageUrl }
            : img
        )
      );
      setSelectedImageId(newImg.id);
      setIsCropping(false);
      setImageToCrop(null);
    };
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop(null);
  };
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

  // Utility function to update image elements
  const updateImage = useCallback(
    (id: string, updates: Partial<Konva.ImageConfig>) => {
      setImages((prevImages) =>
        prevImages.map((img) => (img.id === id ? { ...img, ...updates } : img))
      );
    },
    []
  );

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
        setImageToCrop,
        handleCropCancel,
        handleCropSave,
        selectedImage,
        layerRef,
        setElements,
        handleExport,
        stageRef,
        imageToCrop,
        setImages,
        setShapes,
        setSelectedElement,
        selectedElement,
        openedTab,
        images,
        setOpenedTab,
        selectedId,
        selectedImageId,
        setSelectedId,
        setSelectedImageId,
        isCropping,
        setIsCropping,
        updateImage,
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
