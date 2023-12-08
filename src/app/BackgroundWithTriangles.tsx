"use client";

import React, { useRef, useEffect } from "react";
import styled from "styled-components";

// @ts-ignore
import Matrix from "./matrix.ts";

// SETTINGS:
// Canvas contains many squares, each square contains 2 triangles.
// l=logical, w=width, h=height.
const canvas_lw = 1500; // set higher for higher resolution
const canvas_lh = 1500; // set higher for higher resolution
const square_lw = 30; // size of the square
const square_lh = 30; // size of the square
const squareShift_lx = 4; // horizontal tilting
const squareShift_ly = 4; // vertical tilting
const tilt = 0.5; // 0=left, 0.5=equal, 1=right
const drawSquaresOnly = false;


// THESE THREE MUST ADD UP TO 256, FOR RGB:
const grayMinimum = 180; // higher for lighter.
const colourShift = 3; // 0 for full grayscale.
const grayShift = 256 - grayMinimum - colourShift; // 0+

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
// Output range: 0 .. maxIncl.
const getRandomInt = (maxIncl: number) =>
  Math.floor(Math.random() * (maxIncl + 1));

// Output range: -x/2 .. x/2
const getShiftPositiveOrNegative = (x: number) => getRandomInt(x) - x / 2;

// ------------------------------------
const getRandomGrayishRgb = () => {
  const randomGrayBase = grayMinimum + getRandomInt(grayShift);
  const r = randomGrayBase + getRandomInt(colourShift);
  const g = randomGrayBase + getRandomInt(colourShift);
  const b = randomGrayBase + getRandomInt(colourShift);
  //return `rgb(${r},${g},${b})`;
  return 'rgb(0, 0, 0)';
};

// ------------------------------------
// "12:34" --> [12, 34]
const stringToArray = (value: string): number[] =>
  value.split(":").map((s: string) => Number(s));

// [12, 34] --> "12:34"
const arrayToString = (valueX: number, valueY: number): string =>
  `${valueX}:${valueY}`;

// ------------------------------------
const drawTriangle = (
  ctx: any,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  fillStyle: string
) => {
  ctx.beginPath();
  ctx.lineWidth = 0.1;
  ctx.fillStyle = fillStyle;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);

  ctx.strokeStyle = '#ffffff';

  ctx.fill();
  ctx.stroke()

};

// ------------------------------------
const drawSquare = (
  ctx: any,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
  fillStyle: string
) => {
  ctx.beginPath();
  ctx.lineWidth = 0;
  ctx.fillStyle = fillStyle;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
};

// ------------------------------------
// Two triangles forming a square.
const drawSquareOrTriangles = (
  ctx: any,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number
) => {
  if (drawSquaresOnly) {
    drawSquare(ctx, x1, y1, x2, y2, x3, y3, x4, y4, getRandomGrayishRgb());
    return;
  }

  // Draw two triangles
  if (Math.random() <= tilt) {
    // Tilt right, like: /
    drawTriangle(ctx, x1, y1, x2, y2, x3, y3, getRandomGrayishRgb());
    drawTriangle(ctx, x2, y2, x3, y3, x4, y4, getRandomGrayishRgb());
  } else {
    // Tilt left, like: \
    drawTriangle(ctx, x1, y1, x2, y2, x4, y4, getRandomGrayishRgb());
    drawTriangle(ctx, x1, y1, x3, y3, x4, y4, getRandomGrayishRgb());
  }
};

// ------------------------------------
// x, y: top left corner of the cell, which contain 1 square or 2 triangles.
const drawCell = (matrix: any, ctx: any, x: number, y: number) => {
  // 4 corners of the square
  const x1 = x;
  const y1 = y;
  const x2 = x;
  const y2 = y + square_lh;
  const x3 = x + square_lw;
  const y3 = y;
  const x4 = x + square_lw;
  const y4 = y + square_lh;

  drawSquareOrTriangles(
    ctx,
    // @ts-ignore
    ...stringToArray(matrix.getValue(x1, y1)),
    ...stringToArray(matrix.getValue(x2, y2)),
    ...stringToArray(matrix.getValue(x3, y3)),
    ...stringToArray(matrix.getValue(x4, y4))
  );
};

// ------------------------------------
const createMatrix = (ctx: any, start_x: number, start_y: number,
                                end_x: number, end_y: number) => {
  const matrix = new Matrix();

  // Create a matrix of dots for the squares, with shifts
  for (let x = start_x; x <= end_x; x += square_lw)
    for (let y = start_y; y <= end_y; y += square_lh) {
      const xWithShift = x + getShiftPositiveOrNegative(squareShift_lx);
      const yWithShift = y + getShiftPositiveOrNegative(squareShift_ly);
      matrix.setValue(x, y, arrayToString(xWithShift, yWithShift));
    }

  // Draw the squares (we need 4 dots for each square)
  for (let x = start_x; x <= end_x - square_lw; x += square_lw)
    for (let y = start_y; y <= end_y - square_lh; y += square_lh) {
      drawCell(matrix, ctx, x, y);
    }
};

// ------------------------------------
// COMPONENT:
// Draws a window background of squares.
// Each square draws 2 triangles.
// Each triangle has random shifts in: corner positions, and colour.
const BackgroundWithTriangles = ( props: any ) => {
  const ref = useRef(null);

  // ------------------------------------
  useEffect(() => {
    if (ref && ref.current) {
      const canvas: any = ref.current;
      const ctx = canvas.getContext("2d");
      createMatrix(ctx, props.start_x, props.start_y, props.end_x, props.end_y);
    }
  }, [ref?.current]);

  // ------------------------------------
  // Width and height: logical (int), not physical (px).
  return <Canvas ref={ref} width={canvas_lw} height={canvas_lh} />;
};

export default BackgroundWithTriangles;