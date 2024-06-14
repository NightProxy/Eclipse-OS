import React from 'react';

const Customization = ({ settings, updateSettings }) => {
  const handleThemeChange = e => {
    updateSettings({ ...settings, theme: e.target.value });
  };

  return (
    <div>
      <h1>Customization</h1>
      <label>
        Theme:
        <select value={settings.theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
};

export default Customization;
