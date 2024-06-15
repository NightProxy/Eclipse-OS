// src/components/Settings.js
import React, { useState, useEffect } from 'react';

const Settings = ({ settings, updateSettings }) => {
  const [theme, setTheme] = useState(settings.theme);
  const [offlineMode, setOfflineMode] = useState(settings.offlineMode);

  useEffect(() => {
    setTheme(settings.theme);
    setOfflineMode(settings.offlineMode);
    // Save settings to IndexedDB on mount and settings change
    saveSettingsToIndexedDB({ theme: settings.theme, offlineMode: settings.offlineMode });
  }, [settings]);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    updateSettings({ ...settings, theme: newTheme });
    saveSettingsToIndexedDB({ theme: newTheme, offlineMode });
  };

  const handleOfflineModeChange = (e) => {
    const newOfflineMode = e.target.checked;
    setOfflineMode(newOfflineMode);
    updateSettings({ ...settings, offlineMode: newOfflineMode });
    saveSettingsToIndexedDB({ theme, offlineMode: newOfflineMode });
  };

  const saveSettingsToIndexedDB = (newSettings) => {
    const openRequest = indexedDB.open('settings', 1);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      store.put({ key: 'offlineMode', value: newSettings.offlineMode });
      store.put({ key: 'theme', value: newSettings.theme });
    };
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        Theme:
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label>
        Offline Mode:
        <input
          type="checkbox"
          checked={offlineMode}
          onChange={handleOfflineModeChange}
        />
      </label>
    </div>
  );
};

export default Settings;
