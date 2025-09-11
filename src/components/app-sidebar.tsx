"use client";
import { Download, Images, Shapes, Type } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarEditorProvider } from "./sidebar/SidebarEditorProvider";
import ExportButton from "./export-button";

// Menu items.
const items = [
  {
    title: "Text",
    url: "#",
    icon: Type,
    type: "text",
  },
  {
    title: "Images",
    url: "#",
    icon: Images,
    type: "images",
  },
  {
    title: "Shapes",
    url: "#",
    icon: Shapes,
    type: "shapes",
  },
  {
    title: "Export",
    url: "#",
    icon: Download,
    type: "export",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="flex justify-center flex-col mt-24 items-center">
              <TabsList className="flex flex-col gap-2 w-full">
                {items.map((item) => {
                  if (item.type === "export") {
                    return (
                      <ExportButton
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                      />
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.title} className="w-full">
                        <TabsTrigger value={item.type} asChild>
                          <SidebarMenuButton asChild className="size-full">
                            <div className="flex flex-col w-full">
                              <item.icon className={"size-20"} />
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </TabsTrigger>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </TabsList>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
