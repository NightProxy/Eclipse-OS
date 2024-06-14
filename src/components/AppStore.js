import React, { useState, useEffect } from 'react';

const AppStore = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/user/repo/contents')
      .then(res => res.json())
      .then(data => {
        const appList = data.map(item => ({
          name: item.name,
          description: item.description
        }));
        setApps(appList);
      });
  }, []);

  const handleInstall = (app) => {
    console.log(`Installing ${app.name}`);
  };

  return (
    <div>
      <h1>App Store</h1>
      <ul>
        {apps.map(app => (
          <li key={app.name}>
            <div>
              {app.name}
              <button onClick={() => handleInstall(app)}>Install</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppStore;
