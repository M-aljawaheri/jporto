"use client";

import React, { useRef, useEffect } from "react";
import styled from "styled-components";

// SETTINGS:
// Canvas contains many squares, each square contains 2 triangles.
// l=logical, w=width, h=height.
const canvas_lw = 1000; // set higher for higher resolution
const canvas_lh = 1000; // set higher for higher resolution

// ------------------------------------
const Canvas = styled.canvas`
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: calc(100vw + 50px); // 50px: compensate for the shifting at the end
  height: calc(100vh + 50px); // 50px: compensate for the shifting at the end
`;



// ------------------------------------
const createWordflow = (ctx: any, canvas: any) => {
    // Set font style
    ctx.font = "20px Arial";

    // Optional: align text
    ctx.textAlign = "right"; // Center text horizontally
    ctx.textBaseline = "right"; // Center text vertically

    // Arabic text
    var arabicText = "مرحبا بالعالم"; // "Hello World" in Arabic

    // Draw text
    ctx.fillText(arabicText, canvas.width / 2, canvas.height / 2);
};

// ------------------------------------
// COMPONENT:
// Draws a window background of squares.
// Each square draws 2 triangles.
// Each triangle has random shifts in: corner positions, and colour.
const WordflowBackground = () => {
  const ref = useRef(null);

  // --------------------- --------------
  useEffect(() => {
    if (ref && ref.current) {
      const canvas: any = ref.current;
      const ctx = canvas.getContext("2d");
      createWordflow(ctx, canvas);
    }
  });

  // ------------------------------------
  // Width and height: logical (int), not physical (px).
  return <Canvas ref={ref} width={canvas_lw} height={canvas_lh} />;
};

export default WordflowBackground;