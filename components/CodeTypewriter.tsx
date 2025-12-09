import React, { useState, useEffect } from 'react';

interface Token {
  text: string;
  className: string;
  newLine?: boolean;
  indent?: number;
}

const CodeTypewriter: React.FC = () => {
  const tokens: Token[] = [
    { text: 'import', className: 'text-peculiar-500' },
    { text: ' Success', className: 'text-slate-900 dark:text-white' },
    { text: ' from', className: 'text-peculiar-500' },
    { text: " './Future'", className: 'text-green-500' },
    { text: ' ;', className: 'text-slate-500', newLine: true },
    { text: '', className: '', newLine: true },
    { text: 'const', className: 'text-accent-500' },
    { text: ' Project', className: 'text-slate-900 dark:text-white' },
    { text: ' = {', className: 'text-slate-500', newLine: true },
    
    { text: 'type:', className: 'text-slate-600 dark:text-slate-400', indent: 1 },
    { text: " 'World Class'", className: 'text-yellow-500' },
    { text: ',', className: 'text-slate-500', newLine: true },

    { text: 'performance:', className: 'text-slate-600 dark:text-slate-400', indent: 1 },
    { text: ' 100%', className: 'text-purple-500' },
    { text: ',', className: 'text-slate-500', newLine: true },

    { text: 'security:', className: 'text-slate-600 dark:text-slate-400', indent: 1 },
    { text: ' true', className: 'text-blue-500' },
    { text: ',', className: 'text-slate-500', newLine: true },

    { text: 'scalable:', className: 'text-slate-600 dark:text-slate-400', indent: 1 },
    { text: ' true', className: 'text-blue-500' },
    { text: '', className: '', newLine: true },
    
    { text: '}', className: 'text-accent-500' },
  ];

  const [displayCharIndex, setDisplayCharIndex] = useState(0);
  const typingSpeed = 50; // ms per char
  
  // Calculate total length
  const totalLength = tokens.reduce((acc, token) => acc + token.text.length, 0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (displayCharIndex < totalLength) {
      timeout = setTimeout(() => {
        setDisplayCharIndex(prev => prev + 1);
      }, typingSpeed);
    } else {
      // Wait a bit then restart
      timeout = setTimeout(() => {
        setDisplayCharIndex(0);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [displayCharIndex, totalLength]);

  // Render logic
  let currentCharCount = 0;

  return (
    <div className="font-mono text-base leading-relaxed">
      {tokens.map((token, i) => {
        // If we haven't reached this token's start yet, don't render it
        if (currentCharCount >= displayCharIndex) {
            // Need to handle new lines even if not typed yet to preserve vertical layout? 
            // Better to just stop rendering to look like real typing.
            return null; 
        }

        const start = currentCharCount;
        const end = start + token.text.length;
        currentCharCount = end;

        // How much of this token to show
        const visibleLength = Math.min(token.text.length, displayCharIndex - start);
        const visibleText = token.text.substring(0, visibleLength);

        if (visibleLength <= 0 && !token.newLine) return null;

        return (
          <React.Fragment key={i}>
            {token.newLine && <br />}
            {token.indent ? <span className="inline-block w-8"></span> : null}
            <span className={token.className}>{visibleText}</span>
            {/* Blinking cursor at the very end */}
            {displayCharIndex > start && displayCharIndex <= end && displayCharIndex < totalLength && (
                <span className="inline-block w-2 h-5 bg-peculiar-500 align-middle ml-0.5 animate-pulse"></span>
            )}
          </React.Fragment>
        );
      })}
       {/* Blinking cursor when finished waiting to reset */}
       {displayCharIndex >= totalLength && (
         <span className="inline-block w-2 h-5 bg-peculiar-500 align-middle ml-0.5 animate-pulse"></span>
       )}
    </div>
  );
};

export default CodeTypewriter;