import { useState, useEffect } from "react";
import Switch from "./components/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBookBookmark, faX } from "@fortawesome/free-solid-svg-icons";

interface Bookmark {
  word: string;
  partOfSpeech: string;
  phonetic: string;
}

function App() {
  const [definitionEnabled, setDefinitionEnabled] = useState(true);
  const [playSoundEnabled, setPlaySoundEnabled] = useState(false); // New state for play sound setting
  const [currentScreen, setCurrentScreen] = useState("settings");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]); // State for bookmarks

  const handleToggle = (key: string, value: boolean) => {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log(`${key} has been set to ${value}`);
    });
  };
  const fetchBookmarks = () => {
    chrome.storage.local.get(["bookmarkedWords"], (result) => {
      setBookmarks(result.bookmarkedWords || []); // Load bookmarks or set empty
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

  useEffect(() => {
    if (currentScreen === "bookmarks") {
      fetchBookmarks();
    }
  }, [currentScreen]);

  return (
    <div className="bg-blue-50 min-h-screen h-auto">
      <div className="p-3 w-80">
        <header className="flex justify-between items-center">
          {/* Logo Image and Text */}
          <div className="flex items-center">
            <img
              src="assets/trexpng.png"
              alt="Thesaurus Rex Logo"
              className="w-5 h-5 mr-2"
            />
            <h1 className="text-sm text-left text-gray-900">Thesaurus Rex</h1>
          </div>
          <div className="flex justify-between items-center">
            <button
              className="text-blue-900 bg-blue-50 size-5 flex items-center justify-center space-x-2 border-none focus:outline-none"
              onClick={() => setCurrentScreen("settings")}
            >
              <FontAwesomeIcon icon={faGear} className="text-lg" />
            </button>
            <button
              className="text-blue-900 bg-blue-50 size-5 flex items-center justify-center space-x-2 border-none focus:outline-none"
              onClick={() => setCurrentScreen("bookmarks")} // Toggle between screens when clicked
            >
              <FontAwesomeIcon icon={faBookBookmark} className="text-lg" />
            </button>
          </div>
        </header>
      </div>
      <hr className="w-full border-blue-200 mx-0" />
      <div className="w-80 flex-1">
        {/* Conditional Rendering for Screen */}
        {currentScreen === "settings" ? (
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
                Enable this setting to show a button on highlighted text for
                quick access to its definition.
              </p>
              <hr className="my-3 border-blue-200" />
            </div>
            {/* Wrapper for Play Sound setting */}
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
        ) : (
          <div className="p-3 w-80">
            <h2 className="text-sm font-bold text-left mb-4 text-gray-900">
              Bookmarks
            </h2>
            {bookmarks.length > 0 ? (
              <div className="space-y-3">
                {bookmarks.map((bookmark, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-900">
                          {bookmark.word}
                        </span>
                        <p className="text-xs text-gray-600 mt-2">
                          {bookmark.partOfSpeech} {bookmark.phonetic}
                        </p>
                      </div>
                      <button
                        className="bg-transparent p-2 text-xs justify-center items-center mt-2 w-8 h-8 rounded-full border-2 border-transparent hover:bg-blue-100 hover:border-blue-500 flex"
                        onClick={() => {}}
                      >
                        {/* <FontAwesomeIcon icon={faX} className="w-4 h-4" /> */}
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-blue-700 w-3 h-3"
                        />
                      </button>
                    </div>
                    {index < bookmarks.length - 1 && (
                      <hr className="my-3 border-blue-200" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No bookmarks yet. Your bookmarked words will appear here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
