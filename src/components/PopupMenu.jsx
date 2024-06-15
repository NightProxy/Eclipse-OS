import React, { useState } from 'react';

const PopupMenu = ({ children, taskbarPosition }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getMenuStyle = () => {
    switch (taskbarPosition) {
      case 'bottom':
        return { bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' };
      case 'top':
        return { top: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: 'calc(100% + 5px)', transform: 'translateY(-50%)' };
      case 'right':
        return { top: '50%', right: 'calc(100% + 5px)', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };

  return (
    <div className="popup-menu-container">
      <button onClick={toggleMenu} className="popup-menu-button">Apps</button>
      {isOpen && (
        <div className="popup-menu" style={getMenuStyle()}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
