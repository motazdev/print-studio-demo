"use client";
import { useContext } from "react";
import { SidebarEditorContext } from "./SidebarEditorProvider";
const TextEditor = () => {
  const { elements, setElements } = useContext(SidebarEditorContext);

  const handleTextChange = (index: number, newText: string) => {
    setElements((prev: typeof elements) =>
      prev.map((el, i) => (i === index ? { ...el, text: newText } : el))
    );
  };
  return (
    <div className="flex flex-col gap-2">
      <button
        className="border rounded p-2 bg-blue-500 text-white mb-2"
        onClick={() => {
          setElements((prev: typeof elements) => [
            ...prev,
            {
              id: `text-${Date.now()}`,
              type: "text",
              text: "New Text",
              x: 50,
              y: 50,
              fontSize: 24,
              fontFamily: "Arial",
              fill: "#000",
              editable: true,
              textAlign: "left",
              fontStyle: "normal",
              textDecoration: "none",
              opacity: 1,
              stroke: undefined,
              strokeWidth: undefined,
            },
          ]);
        }}
      >
        Add Text Box
      </button>
      {elements.map(
        (el, i) =>
          el.editable && (
            <input
              key={i}
              type="text"
              value={el.text}
              onChange={(e) => handleTextChange(i, e.target.value)}
              className="border p-2 rounded"
            />
          )
      )}
    </div>
  );
};

export default TextEditor;
