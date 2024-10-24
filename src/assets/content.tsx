let button: HTMLButtonElement | null = null;

document.addEventListener("selectionchange", () => {
  const selectedText: string = window.getSelection()?.toString().trim() || "";

  // Remove existing button if it exists
  if (button) {
    if (document.body.contains(button)) {
      document.body.removeChild(button);
    }
    button = null;
  }

  if (selectedText.length > 0) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (!rect) return;

    // Determine the number of selected words
    const wordCount = selectedText.split(/\s+/).length;

    // Create the button
    button = document.createElement("button");
    button.textContent = wordCount === 1 ? "Meaning" : "Summarize";

    // Position the button below the selected text
    button.style.position = "absolute";
    button.style.top = `${rect.bottom + window.scrollY + 10}px`;
    button.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    button.style.transform = "translateX(-50%)";
    button.style.zIndex = "9999";
    button.style.backgroundColor = "#EFF6FF";
    button.style.color = "#0F172A";
    button.style.border = "2px solid 1E3A8A";
    button.style.cursor = "pointer";
    button.style.borderRadius = "5px";
    button.style.padding = "4px 8px";
    button.style.fontSize = "0.85em";

    button.style.width = "80px"; // Set a fixed width
    button.style.height = "28px"; // Set a fixed height
    button.style.minWidth = "80px"; // Ensure minimum width
    button.style.display = "flex"; // Use flexbox for centering
    button.style.justifyContent = "center"; // Center text horizontally
    button.style.alignItems = "center"; // Center text vertically
    button.style.lineHeight = "1"; // Prevent line height from affecting size

    document.body.appendChild(button);

    // Show the modal when the button is clicked
    button.addEventListener("click", () => {
      createIframeWithModal(selectedText, rect);
    });
  }
});

function createIframeWithModal(selectedText: string, selectionRect: DOMRect) {
  if (button && document.body.contains(button)) {
    document.body.removeChild(button);
    button = null;
  }

  let dialog: HTMLDialogElement | null = null;

  // Remove existing dialog if it exists
  if (dialog && document.body.contains(dialog)) {
    document.body.removeChild(dialog);
    dialog = null;
  }

  // Create the dialog
  dialog = document.createElement("dialog");

  // Add backdrop styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    dialog::backdrop {
      background: none;
    }
  `;
  document.head.appendChild(styleSheet);

  dialog.style.width = "fit-content";
  dialog.style.height = "fit-content";
  dialog.style.border = "none";
  dialog.style.borderRadius = "4px";
  dialog.style.padding = "0";
  dialog.style.backgroundColor = "transparent";
  dialog.style.overflow = "hidden";
  dialog.style.boxShadow = "none";
  dialog.style.position = "absolute"; // Ensure fixed positioning
  dialog.style.margin = "0"; // Remove default margins

  // Create and append iframe inside dialog
  const iframe = document.createElement("iframe");
  const encodedText = encodeURIComponent(selectedText);
  iframe.src = `${chrome.runtime.getURL("modal.html")}?text=${encodedText}`;
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  dialog.appendChild(iframe);
  document.body.appendChild(dialog);
  dialog.showModal();

  // Position the dialog after it's shown
  const positionDialog = () => {
    if (dialog && iframe.offsetHeight > 0) {
      const padding = 10; // Space between selection and dialog

      // Calculate initial position (centered above selection)
      let top =
        selectionRect.top + window.scrollY - iframe.offsetHeight - padding;
      let left =
        selectionRect.left +
        window.scrollX +
        selectionRect.width / 2 -
        iframe.offsetWidth / 2;

      // Adjust if dialog would go off-screen
      if (top < window.scrollY) {
        // If not enough space above, put it below the selection
        top = selectionRect.bottom + window.scrollY + padding;
      }

      // Adjust horizontal position if needed
      if (left < 0) {
        left = padding;
      } else if (left + iframe.offsetWidth > window.innerWidth) {
        left = window.innerWidth - iframe.offsetWidth - padding;
      }

      dialog.style.top = `${top}px`;
      dialog.style.left = `${left}px`;
    }
  };

  // Listen for messages from the iframe
  const messageHandler = function (event: MessageEvent) {
    if (event.data.type === "resize") {
      iframe.style.width = `${event.data.width}px`;
      iframe.style.height = `${event.data.height}px`;
      // Reposition dialog after resize
      positionDialog();
    }
  };

  window.addEventListener("message", messageHandler);

  // Add click outside handler
  const clickHandler = (event: MouseEvent) => {
    const rect = dialog?.getBoundingClientRect();
    if (
      rect &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    ) {
      dialog?.close();
      // Clean up event listeners and styles
      window.removeEventListener("message", messageHandler);
      dialog?.removeEventListener("click", clickHandler);
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
      if (document.body.contains(dialog)) {
        document.body.removeChild(dialog);
      }
    }
  };

  dialog.addEventListener("click", clickHandler);
}
