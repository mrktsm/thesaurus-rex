import { useState, useEffect } from "react";
import Switch from "./components/Switch";

function App() {
  const [definitionEnabled, setDefinitionEnabled] = useState(true);
  const [summarizeEnabled, setSummarizeEnabled] = useState(false);

  const handleToggle = (key: string, value: boolean) => {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log(`${key} has been set to ${value}`);
    });
  };

  // Fetch the saved state from chrome.storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get(
      ["definitionEnabled", "summarizeEnabled"],
      (result) => {
        setDefinitionEnabled(
          result.definitionEnabled !== undefined
            ? result.definitionEnabled
            : true
        );
        setSummarizeEnabled(result.summarizeEnabled || false);
      }
    );
  }, []);

  return (
    <div className="bg-blue-50">
      <div className="p-3 w-64">
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
      <div className="p-3 w-64">
        <h2 className="text-sm font-bold text-left mb-4 text-gray-900">
          Quick settings
        </h2>
        {/* Wrapper for Get Definition setting */}
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-900">Get Definition</span>
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
        </div>
        {/* Wrapper for Summarize setting */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-900">Summarize</span>
            <div className="ml-auto">
              <Switch
                isOn={summarizeEnabled}
                handleToggle={() => {
                  setSummarizeEnabled(!summarizeEnabled);
                  handleToggle("summarizeEnabled", !summarizeEnabled);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
