"use client";

import { useEffect, useRef } from 'react'

import styled from "styled-components";
import React, { useState } from 'react';


import Matter, { Engine, Render, Bodies, World, Body } from 'matter-js'


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
  width: calc(100vw); // 50px: compensate for the shifting at the end
  height: calc(100vh); // 50px: compensate for the shifting at the end
`;



function createSentenceTrain(engine) {
  const group = Matter.Common.nextId;
  const numberOfLinks = 18;
  const outwardForceMagnitude = 100;
  let chain = [];

  let verseWidth = 50;
  let verseHeight = 10;
  for (let i = numberOfLinks; i >= 1; i--) {
    const versePart = Bodies.rectangle(
      1920 - (i*verseWidth*1.5),
      200,
      verseWidth,    // width
      verseHeight,     // height
      {
        mass: 10,
        restitution: 0,
        friction: 0,//0.005,
        stiffness: 0,
        frictionAir: 0.05,
        //collisionFilter: group,
        render: {
          sprite: {
            texture: "./verse-sep/verse" + i + ".png",
            xScale: 1,
            yScale: 1,
          },
        }
      }
    );

    if (i == 1 || i == numberOfLinks) {
      // Apply a force to the first link (leftward)
      Matter.Body.setVelocity(versePart, {
        x: (i == 1) ? -outwardForceMagnitude : outwardForceMagnitude,
        y: 0
      });
    }

    chain.push(versePart);
  }

  for (let i = 1; i < numberOfLinks; i++) {
    const constraint = Matter.Constraint.create({
        bodyA: chain[i - 1],
        bodyB: chain[i],
        pointA: { x: 25, y: 0 },
        pointB: { x: -25, y: 0 },
        stiffness: 0.1, // Lower stiffness for more flexibility
        length: 20,
        render: {
            lineWidth: 1,
            strokeStyle: '#FFF'
        }
    });
    World.add(engine.current.world, constraint);
  }
  World.add(engine.current.world, chain);

  //Matter.Body.setVelocity(verse, { x: -10, y: 10 });
  //chain.add(verse);
  //World.add(engine.current.world, [verse]);

  //return verse;
}

function createSpiral(engine, render) {
  // a=80, b=0.25, theta = 6 + is good

  const a = 20; // Scale factor
  const b = 0.32; // Spiral tightness
  const numberOfPoints = 200; // Number of points in the spiral
  const pointRadius = 60; // Radius of each point
  const points = []; // Store the point bodies

  for (let i = 0; i < numberOfPoints; i++) {
    let theta = 6 + i * 0.1; // Increment angle
    let r = a * Math.exp(b * theta); // Calculate radius

    // Convert polar to Cartesian coordinates
    // 1920 - x to flip x coordinates
    let x = (r * Math.cos(theta) + render.options.width / 2) - 200;
    let y = 1080/2 - (r * Math.sin(theta) + render.options.height / 2);

    let point = Bodies.circle(x, y, pointRadius, { isStatic: true });
    points.push(point);
    World.add(engine.current.world, point);

    if (i > 0) {
      let constraint = Matter.Constraint.create({
        bodyA: points[i - 1],
        bodyB: point,
        length: 0,
        stiffness: 0.1,
        friction: 0.0005,
      });
      World.add(engine.current.world, constraint);
    }
  }
}



/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Comp (props) {
  const scene = useRef();
  const engine = useRef(Engine.create())

  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    })

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    ])

    //createShelves(engine);


    createSpiral(engine, render);
    createSentenceTrain(engine);

    //Engine.run(engine.current)
    Matter.Runner.run(engine.current)
    Render.run(render)

    return () => {
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  const generateLetter = (x, y) => {
    //console.log("( " + x + ", " + y + " )");
    const letter = Bodies.circle(
      x,
      y-10,
      10,
      {
        mass: 20,
        restitution: 0.95,
        friction: 0.005,//0.005,
        render: {
          sprite: {
            texture: "arabic-letters/tile0" + String(getRandomInt(0, 29)).padStart(2, '0') + ".png",
            xScale: y/30,
            yScale: y/30,
          },
        }
      })

    // we don't want to clutter the screen, give lifetime to objects
    setTimeout(() => World.remove(engine.current.world, [letter]), 2000);
    return letter;
  }

  const handleAddLetter = e => {
    const x = getRandomInt(0, 1920);
    const y = getRandomInt(0, 20);
    const letter = generateLetter(x, y);
    World.add(engine.current.world, [letter])
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      //handleAddLetter();
    }, getRandomInt(1, 10));

    return () => clearInterval(interval);
  }, []);

  //return (
  //  <div>
  //    <Canvas ref={scene} width={canvas_lw} height={canvas_lh} />
  //  </div>
  //);
  return (
    <div ref={scene} style={{ width: '100%', height: '100%',
                              position: "fixed",
                              zIndex: -1,
  }} />
    //<Canvas ref={scene} width={canvas_lw} height={canvas_lh} />
   );
   // style={{ width: '100%', height: '100%' }} />

}

export default Comp
