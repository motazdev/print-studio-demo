import React, { RefObject, useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

interface ImageDisplayProps {
  el: Konva.ImageConfig;
  handleImageSelect: (element: Konva.ImageConfig) => void;
}

const ImageDisplay = ({ el, handleImageSelect }: ImageDisplayProps) => {
  console.log(el);
  // const imageRef = useRef<Konva.Image | null>(null);

  // useEffect(() => {
  //   if (imageRef.current && el.image) {
  //     imageRef.current.cache();
  //     imageRef.current.filters([Konva.Filters.Blur]);
  //     imageRef.current.blurRadius(4);
  //   }
  // }, [el.image]);

  if (!el.image) return null;

  return (
    <KonvaImage
      // ref={imageRef}
      id={el.id}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      image={el.image}
      draggable
      onClick={() => handleImageSelect(el)}
    />
  );
};

export default ImageDisplay;
