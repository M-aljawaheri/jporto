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


// Define a particle class
class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number, y: number };

  constructor(x: number, y: number, radius: number, color: string) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = { x: 0, y: 1 };
  }

  draw(ctx: any): void {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
  }

  update(canvas: any, ctx: any): void {
      this.y += this.velocity.y;
      this.velocity.y += 0.05; // gravity effect

      // Bounce off the bottom of the canvas
      if (this.y + this.radius + this.velocity.y > canvas.height) {
          this.velocity.y = -this.velocity.y * 0.9; // a little energy lost on bounce
      }

      this.draw(ctx);
  }
}

// Create an array of particles
const particles: Particle[] = [];

// Initialize some particles
for (let i = 0; i < 20; i++) {
    const radius = 5 ;
    particles.push(new Particle(Math.random()*500, Math.random()*500, radius, 'blue'));
}


// ------------------------------------
const createWordflow = (ctx: any, canvas: any) => {
    // Set font style
    ctx.font = "20px naskh";

    // Optional: align text
    ctx.textAlign = "left"; // Center text horizontally
    ctx.textBaseline = "left"; // Center text vertically

    // Arabic text
    var arabicText = "مرحبا بالعالم"; // "Hello World" in Arabic

    // Draw text
    ctx.fillText(arabicText, 100, canvas.height / 2);
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
      particles.forEach(particle => {
        particle.update(canvas, ctx);
    });
      //createWordflow(ctx, canvas);
    }
  }, [ref?.current]);

  // ------------------------------------
  // Width and height: logical (int), not physical (px).
  return <Canvas ref={ref} width={canvas_lw} height={canvas_lh} />;
};

export default WordflowBackground;