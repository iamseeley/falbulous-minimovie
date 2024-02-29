'use client'

import React, { useState, useRef, ReactNode, useEffect } from 'react';

interface HoverCardProps {
  trigger: ReactNode;
  content: ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = ({ trigger, content }) => {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Position adjustment logic to keep the hover card within the viewport
  useEffect(() => {
    if (contentRef.current) {
      const { right } = contentRef.current.getBoundingClientRect();
      const overflowX = right - window.innerWidth;

      if (overflowX > 0) {
        contentRef.current.style.right = `${overflowX + 20}px`; // 20px for a little padding from the edge
      }
    }
  }, [isHovered]);

  return (
    <div className="relative flex items-center" onMouseLeave={() => setIsHovered(false)}>
      <div onMouseEnter={() => setIsHovered(true)}>
        {trigger}
      </div>
      {isHovered && (
        <div
          ref={contentRef}
          className=" absolute z-50 w-64 p-4 bg-white border rounded shadow-lg  left-0 mt-2 -ml-64"
          onMouseEnter={() => setIsHovered(true)}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default HoverCard;
