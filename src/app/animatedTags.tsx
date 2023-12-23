"use client";

import React, { useState, useEffect } from 'react';

const SpookyText = () => {
  let text: string = " Hello stranger";

  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => (count+1) % text.length);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (<h1 className="text-xl font-burtons">{ text.substring(count, text.length) + text.substring(0, count) }</h1>);
}

export default SpookyText;