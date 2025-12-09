import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  loop = true,
  typeSpeed = 150,
  deleteSpeed = 100,
  delaySpeed = 2000,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink(!blink);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index === words.length && !loop) return;

    if (subIndex === words[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), delaySpeed);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words, typeSpeed, deleteSpeed, delaySpeed, loop]);

  return (
    <span className={`${className} inline-flex items-center`}>
      {words[index].substring(0, subIndex)}
      <span className={`ml-1 w-[2px] h-[1em] bg-current ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
    </span>
  );
};

export default Typewriter;