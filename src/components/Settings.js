import React from 'react';

const Settings = ({ settings, updateSettings }) => {
  const handleThemeChange = (e) => {
    updateSettings({ ...settings, theme: e.target.value });
  };

  const handleOfflineModeChange = (e) => {
    updateSettings({ ...settings, offlineMode: e.target.checked });
  };

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <label>
          Theme:
          <select value={settings.theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Offline Mode:
          <input
            type="checkbox"
            checked={settings.offlineMode}
            onChange={handleOfflineModeChange}
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;
