import React, { useContext } from "react";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { handleDeselect } = useContext(SidebarEditorContext);
  return (
    <div
      className="flex items-center size-full"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleDeselect();
        }
      }}
    >
      {children}
    </div>
  );
};

export default AppContent;
