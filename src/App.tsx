import Switch from "./components/Switch";

function App() {
  return (
    <>
      <div className="bg-blue-500">
        <div className="p-3 w-64 bg-blue-500">
          {" "}
          {/* Increased padding from p-2 to p-3 */}
          <header className="flex items-center">
            {/* Logo Image */}
            <img
              src="assets/trexpng.png"
              alt="Thesaurus Rex Logo"
              className="w-6 h-6 mr-3"
            />
            <h1 className="text-base text-left text-white">Thesaurus Rex</h1>{" "}
            {/* Increased font size */}
          </header>
        </div>
        <hr className="w-full border-blue-600 mx-0" />
        <div className="p-4 w-64 bg-blue-500">
          {" "}
          {/* Increased padding from p-3 to p-4 */}
          <h2 className="text-base font-bold text-left mb-5 text-white">
            {" "}
            {/* Increased font size and margin-bottom */}
            Quick settings
          </h2>
          {/* Wrapper for Get Definition setting */}
          <div className="mb-4">
            {" "}
            {/* Increased margin-bottom */}
            <div className="flex justify-between items-center">
              <span className="text-base text-white">Get Definition</span>{" "}
              {/* Increased font size */}
              <div className="ml-auto">
                <Switch />
              </div>
            </div>
          </div>
          {/* Wrapper for Summarize setting */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-base text-white">Summarize</span>{" "}
              {/* Increased font size */}
              <div className="ml-auto">
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
