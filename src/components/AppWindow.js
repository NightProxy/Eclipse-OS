import React, { useState } from 'react';

const AppWindow = ({ id, title, onClose, onMinimize, onExpand, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({ x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.target.style.left = `${e.clientX - position.x}px`;
      e.target.style.top = `${e.clientY - position.y}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="app"
      id={id}
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="app-titlebar" onMouseDown={handleMouseDown}>
        {title}
        <div className="app-controls">
          <button onClick={onMinimize}>_</button>
          <button onClick={onExpand}>[ ]</button>
          <button onClick={onClose}>X</button>
        </div>
      </div>
      <div className="app-content">{children}</div>
    </div>
  );
};

export default AppWindow;
