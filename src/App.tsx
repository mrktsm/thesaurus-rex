import { useState, useEffect } from "react";
import Switch from "./components/Switch";

function App() {
  const [definitionEnabled, setDefinitionEnabled] = useState(true);
  const [playSoundEnabled, setPlaySoundEnabled] = useState(false); // New state for play sound setting

  const handleToggle = (key: string, value: boolean) => {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log(`${key} has been set to ${value}`);
    });
  };

  // Fetch the saved state from chrome.storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get(
      ["definitionEnabled", "summarizeEnabled", "playSoundEnabled"],
      (result) => {
        setDefinitionEnabled(
          result.definitionEnabled !== undefined
            ? result.definitionEnabled
            : true
        );
        setPlaySoundEnabled(result.playSoundEnabled || false);
      }
    );
  }, []);

  return (
    <div className="bg-blue-50">
      <div className="p-3 w-80">
        <header className="flex items-center">
          {/* Logo Image */}
          <img
            src="assets/trexpng.png"
            alt="Thesaurus Rex Logo"
            className="w-5 h-5 mr-2" // Adjust the width/height as necessary
          />
          <h1 className="text-sm text-left text-gray-900">Thesaurus Rex</h1>
        </header>
      </div>
      <hr className="w-full border-blue-200 mx-0" />
      <div className="p-3 w-80">
        <h2 className="text-sm font-bold text-left mb-4 text-gray-900">
          Quick settings
        </h2>
        {/* Wrapper for Get Definition setting */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-900">Display Button</span>
            <div className="ml-auto">
              <Switch
                isOn={definitionEnabled}
                handleToggle={() => {
                  setDefinitionEnabled(!definitionEnabled);
                  handleToggle("definitionEnabled", !definitionEnabled);
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Enable this setting to show a button on highlighted text for quick
            access to its definition.
          </p>
          <hr className="my-3 border-blue-200" />
        </div>
        {/* Wrapper for Summarize setting */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-900">
              Play Sound On Definition
            </span>
            <div className="ml-auto">
              <Switch
                isOn={playSoundEnabled}
                handleToggle={() => {
                  setPlaySoundEnabled(!playSoundEnabled);
                  handleToggle("playSoundEnabled", !playSoundEnabled);
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Enable a sound to play each time a word's definition is shown.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
