"use client";

import { useEffect, useRef } from 'react'

import React, { useState } from 'react';


import Matter, { Engine, Render, Bodies, World } from 'matter-js'

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
  const scene = useRef()
  const isPressed = useRef(false)
  isPressed.current = true;
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

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const generateLetter = (x, y) => {
    x = getRandomInt(0, 1920);
    y = getRandomInt(0, 20);


    const letter = Bodies.circle(
      x,
      y,
      10,
      {
        mass: 20,
        restitution: 0.95,
        friction: 0.05,//0.005,
        render: {
          sprite: {
            texture: "arabic-letters/tile0" + String(getRandomInt(0, 29)).padStart(2, '0') + ".png",
          },
          xScale: 1,
          yScale: 1,
        }
      })

    // we don't want to clutter the screen, give lifetime to objects
    setTimeout(() => World.remove(engine.current.world, [letter]), 2000);
    return letter;
  }

  const handleAddLetter = e => {
    if (isPressed.current) {
      const letter = generateLetter();
      World.add(engine.current.world, [letter])
    }
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      handleAddLetter();
    }, getRandomInt(1, 50));

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      //onMouseDown={handleDown}
      //onMouseUp={handleUp}
      //onMouseMove={handleAddLetter}
    >
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default Comp
