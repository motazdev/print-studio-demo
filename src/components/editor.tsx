"use client";
import dynamic from "next/dynamic";

const FabricEditor = dynamic(
  () => import("@/components/template-editor-konva"),
  {
    ssr: false,
  }
);

import { useContext } from "react";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

import ImageToolbar from "./image-toolbar";
import TextToolbar from "./text-toolbar";
import ShapeToolbar from "./shapes-toolbar";
const fontFamilies = [
  "arial",
  "verdana",
  "georgia",
  "courier",
  "roboto",
  "times new roman",
];
const Editor = () => {
  const { selectedElement, selectedImage, selectedShape } =
    useContext(SidebarEditorContext);
  return (
    <div className="flex  flex-col w-fit m-auto justify-center items-center">
      {selectedElement && <TextToolbar />}
      {selectedImage && <ImageToolbar />}
      {selectedShape && <ShapeToolbar />}
      <FabricEditor />
    </div>
  );
};

export default Editor;
