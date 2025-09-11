import Konva from "konva";
import { Text } from "react-konva";

const template: {
  id: string;
  background: {
    type: string;
    src: string;
  };
  elements: Konva.TextConfig[];
  images: Konva.ImageConfig[];
  shapes: Konva.ShapeConfig[];
} = {
  id: "birthday_card_01",
  background: {
    type: "image",
    src: "/templates/bg.jpg",
  },
  elements: [
    {
      id: "text_01",
      type: "text",
      text: "Happy Birthday!",
      x: 200,
      y: 100,
      fontSize: 48,
      fontFamily: "Arial",
      fill: "#ff4081",
      editable: true,
      textAlign: "center",
      fontStyle: "normal",
      textDecoration: "none",
      opacity: 1,
      stroke: undefined,
      strokeWidth: undefined,
      shadowEnabled: false,
      shadowBlur: undefined,
      shadowColor: undefined,
      shadowOffsetX: undefined,
      shadowOffsetY: undefined,
      shadowOpacity: undefined,
    },
    {
      id: "text_02",
      type: "text",
      text: "From John",
      x: 220,
      y: 200,
      fontSize: 28,
      fontFamily: "Roboto",
      fill: "#333",
      editable: true,
      textAlign: "center",
      fontStyle: "normal",
      textDecoration: "none",
      opacity: 1,
      stroke: undefined,
      strokeWidth: undefined,
      shadowEnabled: false,
      shadowBlur: undefined,
      shadowColor: undefined,
      shadowOffsetX: undefined,
      shadowOffsetY: undefined,
      shadowOpacity: undefined,
    },
  ],
  images: [],
  shapes: [],
};

export { template };
