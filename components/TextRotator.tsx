import React, { useState, useEffect } from 'react';

interface TextRotatorProps {
  words: string[];
  period?: number;
  className?: string;
}

const TextRotator: React.FC<TextRotatorProps> = ({ 
  words, 
  period = 3000,
  className = "" 
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, period);

    return () => clearInterval(interval);
  }, [words.length, period]);

  return (
    <span className={`${className} inline-flex h-[1.2em] overflow-hidden align-bottom relative`}>
      <span 
        className="flex flex-col transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${index * 100}%)` }}
      >
        {words.map((word, i) => (
          <span key={i} className="h-[1.2em] flex items-center whitespace-nowrap">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
};

export default TextRotator;