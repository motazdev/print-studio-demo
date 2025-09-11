// "use client";

// import { useEffect, useRef } from "react";

// export default function FabricEditor({ template }: { template: any }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const fabricRef = useRef<fabric.Canvas | null>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Initialize Fabric canvas
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       selection: false,
//     });
//     fabricRef.current = canvas;

//     // Load template
//     loadTemplate(canvas, template);

//     return () => {
//       canvas.dispose();
//     };
//   }, [template]);

//   return (
//     <div className="p-4">
//       <canvas ref={canvasRef} width={600} height={400} />
//     </div>
//   );
// }

// // helper function
// function loadTemplate(canvas: fabric.Canvas, template: any) {
//   // Background image
//   if (template.background?.src) {
//     fabric.Image.fromURL(template.background.src, (img) => {
//       canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
//     });
//   }

//   // Elements
//   template.elements.forEach((el: any) => {
//     if (el.type === "text") {
//       const text = new fabric.Textbox(el.text, {
//         left: el.x,
//         top: el.y,
//         fontSize: el.fontSize,
//         fontFamily: el.fontFamily,
//         fill: el.fill,
//         editable: el.editable,
//       });
//       canvas.add(text);
//     }
//   });
// }
