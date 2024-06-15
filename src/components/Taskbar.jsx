import React from 'react';

const Taskbar = ({ position, apps, onRightClick, onAppClick, children}) => {
  return (
    <div className={`taskbar ${position}`} onContextMenu={onRightClick}>
      {children}
      {apps.map(app => (
        <div key={app.id} className="taskbar-app" onClick={() => onAppClick(app.id)}>
          {app.title}
        </div>
      ))}
    </div>
  );
};

export default Taskbar;

