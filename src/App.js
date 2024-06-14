import React, { useEffect, useState } from 'react';
import Taskbar from './components/Taskbar';
import AppWindow from './components/AppWindow';
import FileEditor from './components/FileEditor';
import Settings from './components/Settings';
import AppStore from './components/AppStore';

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

  const handleAppClick = id => {
    console.log(`App ${id} clicked`);
  };

  const addApp = (app) => {
    setOpenApps([...openApps, { id: appCounter, title: app.name }]);
    setAppCounter(appCounter + 1);
  };

  const updateSettings = newSettings => {
    setSettings(newSettings);
  };

  return (
    <div className={`desktop ${settings.theme}`} onContextMenu={handleDesktopRightClick}>
      <Taskbar
        position={taskbarPosition}
        apps={openApps}
        onRightClick={handleTaskbarRightClick}
        onAppClick={handleAppClick}
      />
      {openApps.map(app => (
        <AppWindow
          key={app.id}
          id={app.id}
          title={app.title}
          onClose={() => handleAppClose(app.id)}
          onMinimize={() => handleAppMinimize(app.id)}
          onExpand={() => handleAppExpand(app.id)}
        >
          {React.createElement(require(`../os-utils/apps/${app.title.replace(/\s+/g, '-').toLowerCase()}/app.js`).default)}
        </AppWindow>
      ))}
      {apps.map(app => (
        <button key={app.id} onClick={() => addApp(app)}>{app.name}</button>
      ))}
      <Settings settings={settings} updateSettings={updateSettings} />
      <AppStore />
    </div>
  );
};

export default App;
