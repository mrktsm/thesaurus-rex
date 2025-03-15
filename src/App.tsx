import { useState, useEffect } from "react";
import Switch from "./components/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBookBookmark, faX } from "@fortawesome/free-solid-svg-icons";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface Bookmark {
  word: string;
  partOfSpeech: string;
  phonetic: string;
}

function App() {
  const [definitionEnabled, setDefinitionEnabled] = useState(true);
  const [playSoundEnabled, setPlaySoundEnabled] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("settings");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const removeBookmark = (wordToRemove: string) => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.word !== wordToRemove
    );
    setBookmarks(updatedBookmarks);

    chrome.storage.local.set(
      {
        bookmarkedWords: updatedBookmarks,
      },
      () => {
        console.log(`Removed bookmark for ${wordToRemove}`);
      }
    );
  };

  const handleToggle = (key: string, value: boolean) => {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log(`${key} has been set to ${value}`);
    });
  };

  const fetchBookmarks = () => {
    chrome.storage.local.get(["bookmarkedWords"], (result) => {
      setBookmarks(result.bookmarkedWords || []);
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
    <div className="bg-gray-900 w-80 shadow-lg text-gray-100">
      <div className="p-4 border-b border-gray-800">
        <header className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="assets/white-border.png"
              alt="Thesaurus Rex Logo"
              className="w-6 h-6 mr-3 filter brightness-150"
            />
            <h1 className="text-sm font-medium text-blue-300">Thesaurus Rex</h1>
          </div>
          <div className="flex space-x-4">
            <FontAwesomeIcon
              icon={faGear}
              className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
                currentScreen === "settings"
                  ? "text-blue-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              onClick={() => setCurrentScreen("settings")}
            />
            <FontAwesomeIcon
              icon={faBookBookmark}
              className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
                currentScreen === "bookmarks"
                  ? "text-blue-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              onClick={() => setCurrentScreen("bookmarks")}
            />
          </div>
        </header>
      </div>

      <div className="p-4">
        {currentScreen === "settings" ? (
          <div>
            <h2 className="text-sm font-medium text-blue-400 mb-6">
              QUICK SETTINGS
            </h2>

            <div className="mb-6 pb-6 border-b border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-100">Display Button</span>
                <Switch
                  isOn={definitionEnabled}
                  handleToggle={() => {
                    setDefinitionEnabled(!definitionEnabled);
                    handleToggle("definitionEnabled", !definitionEnabled);
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Show a button on highlighted text for quick access to
                definitions
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-100">Play Sound</span>
                <Switch
                  isOn={playSoundEnabled}
                  handleToggle={() => {
                    setPlaySoundEnabled(!playSoundEnabled);
                    handleToggle("playSoundEnabled", !playSoundEnabled);
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Play audio when showing definitions
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-medium text-blue-400 mb-4">
              BOOKMARKS
            </h2>

            {bookmarks.length > 0 ? (
              <div className="overflow-y-auto max-h-72 space-y-3 pr-1">
                <TransitionGroup>
                  {bookmarks.map((bookmark) => (
                    <CSSTransition
                      key={bookmark.word}
                      timeout={300}
                      classNames="bookmark-item"
                    >
                      <div className="bg-gray-800 rounded p-3 relative group">
                        <div className="pr-6">
                          <div className="text-gray-100 font-medium mb-1">
                            {bookmark.word}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-blue-400 mr-2">
                              {bookmark.partOfSpeech}
                            </span>
                            <span className="text-xs text-gray-400">
                              {bookmark.phonetic}
                            </span>
                          </div>
                        </div>
                        <FontAwesomeIcon
                          icon={faX}
                          className="w-5 h-5 absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 transition-opacity duration-200 cursor-pointer"
                          onClick={() => removeBookmark(bookmark.word)}
                        />
                      </div>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FontAwesomeIcon
                  icon={faBookBookmark}
                  className="w-8 h-8 mb-2"
                />
                <p className="text-sm">No bookmarked words yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
