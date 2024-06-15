import React, { useEffect, useState } from 'react';
import Taskbar from './components/Taskbar';
import AppWindow from './components/AppWindow';
import ErrorBoundary from './components/ErrorBoundary';
import PopupMenu from './components/PopupMenu';

const App = () => {
  const [taskbarPosition, setTaskbarPosition] = useState('bottom');
  const [openApps, setOpenApps] = useState([]);
  const [appCounter, setAppCounter] = useState(1);
  const [apps, setApps] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'light',
    offlineMode: false
  });

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(data => setApps(data));
  }, []);

  const handleAppClose = id => {
    setOpenApps(openApps.filter(app => app.id !== id));
  };

  const handleAppMinimize = id => {
    console.log(`Minimize app ${id}`);
  };

  const handleAppExpand = id => {
    console.log(`Expand app ${id}`);
  };

  const handleTaskbarRightClick = e => {
    e.preventDefault();
    const newPosition = prompt('Enter taskbar position (bottom, top, left, right):', taskbarPosition);
    if (['bottom', 'top', 'left', 'right'].includes(newPosition)) {
      setTaskbarPosition(newPosition);
    }
  };

  const handleDesktopRightClick = e => {
    e.preventDefault();
    alert('Right-click menu: Add shortcut, Change wallpaper');
  };

  const handleAppClick = app => {
    setOpenApps([...openApps, { id: appCounter, title: app.title, type: app.type }]);
    setAppCounter(appCounter + 1);
  };

  return (
    <div className={`desktop ${settings.theme}`} onContextMenu={handleDesktopRightClick}>
      <Taskbar
        position={taskbarPosition}
        apps={openApps}
        onRightClick={handleTaskbarRightClick}
      >
        <PopupMenu taskbarPosition={taskbarPosition}>
          {apps.length === 0 ? (
            <p>No apps installed</p>
          ) : (
            apps.map(app => (
              <button key={app.id} onClick={() => handleAppClick(app)}>{app.title}</button>
            ))
          )}
        </PopupMenu>
      </Taskbar>
      {openApps.map(app => (
        <AppWindow
          key={app.id}
          id={app.id}
          title={app.title}
          onClose={() => handleAppClose(app.id)}
          onMinimize={() => handleAppMinimize(app.id)}
          onExpand={() => handleAppExpand(app.id)}
        >
          <ErrorBoundary>
            {app.type === 'react' ? (
              React.createElement(require(`../os-utils/apps/${app.title.replace(/\s+/g, '-').toLowerCase()}/app.js`).default)
            ) : (
              <iframe src={`/apps/${app.title.replace(/\s+/g, '-').toLowerCase()}/index.html`} style={{ width: '100%', height: '100%' }} />
            )}
          </ErrorBoundary>
        </AppWindow>
      ))}
    </div>
  );
};

export default App;
