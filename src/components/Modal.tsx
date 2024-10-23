import { useEffect, useState } from "react";

const Modal = () => {
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);

    // Extract the 'text' parameter and decode it
    const text = params.get("text");
    if (text) {
      setSelectedText(decodeURIComponent(text));
    }
  }, []);

  return (
    <div>
      <h1>Selected Text</h1>
      <p>{selectedText}</p>
    </div>
  );
};

export default Modal;
