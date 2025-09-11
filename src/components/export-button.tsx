import React, { useContext } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { SidebarEditorContext } from "./sidebar/SidebarEditorProvider";

const ExportButton = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ElementType;
}) => {
  const { handleExport } = useContext(SidebarEditorContext);
  return (
    <SidebarMenuItem
      key={title}
      onClick={() => {
        handleExport();
      }}
      className="w-full text-blue-500 cursor-pointer opacity-100"
    >
      <SidebarMenuButton
        asChild
        onClick={() => handleExport()}
        className="size-full hover:text-blue-400 transition-all duration-500 "
      >
        <div className="flex flex-col w-full">
          {React.createElement(icon, { className: "size-20" })}
          <span>{title}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ExportButton;
