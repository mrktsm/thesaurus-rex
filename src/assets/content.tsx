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

  // Check if definitionEnabled is true before proceeding
  chrome.storage.local.get(["definitionEnabled"], (result) => {
    const isDefinitionEnabled = result.definitionEnabled || true;

    if (selectedText.length > 0) {
      const selection = window.getSelection();
      if (!selection) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (!rect) return;

      // Determine the number of selected words
      const wordCount = selectedText.split(/\s+/).length;
      // Temporary if statement to not create the summarize button update in version 2
      if (wordCount === 1 && isDefinitionEnabled) {
        // Create the button
        // Create an image element for the icon

        button = document.createElement("button");
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
          @keyframes popUp {
            0% {
              transform: translateX(-50%) scale(0);
              opacity: 0;
            }
            50% {
              transform: translateX(-50%) scale(1.1);
            }
            100% {
              transform: translateX(-50%) scale(1);
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(styleSheet);

        button.style.animation = "popUp 0.3s ease-out forwards";
        button.style.opacity = "0"; // Start with 0 opacity
        button.style.transform = "translateX(-50%) scale(0)"; // Start scaled down

        const icon = document.createElement("img");
        icon.src = chrome.runtime.getURL("/assets/trexpng.png"); // Path to your image
        icon.alt = "Icon"; // Alt text for the image
        icon.style.width = "16px"; // Adjust the size of the image as needed
        icon.style.height = "16px"; // Adjust the size of the image as needed
        icon.style.display = "block"; // Make sure the image is not hidden

        button.appendChild(icon);

        const textSpan = document.createElement("span");
        textSpan.textContent = "Define";
        textSpan.style.marginLeft = "4px"; // Add some space between icon and text
        button.appendChild(textSpan);
        // Position the button below the selected text
        button.style.position = "absolute";
        button.style.top = `${rect.bottom + window.scrollY}px`;
        button.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
        button.style.transform = "translateX(-50%)";
        button.style.zIndex = "9999";

        // Explicitly set the button style to avoid inheritance from parent page
        button.style.backgroundColor = "#EFF6FF";
        button.style.color = "#0F172A";
        button.style.border = "2px solid 1E3A8A";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        button.style.padding = "4px 8px";
        button.style.fontFamily = "Arial, sans-serif"; // Set preferred font explicitly
        button.style.fontSize = "14px"; // Set consistent font size
        button.style.fontWeight = "normal"; // Set consistent font weight
        button.style.lineHeight = "normal"; // Set consistent line height

        button.style.width = "68px"; // Set a fixed width
        button.style.height = "28px"; // Set a fixed height
        button.style.minWidth = "28px"; // Ensure minimum width
        button.style.display = "flex"; // Use flexbox for centering
        button.style.justifyContent = "center"; // Center text horizontally
        button.style.alignItems = "center"; // Center text vertically
        button.style.lineHeight = "1"; // Prevent line height from affecting size

        // Add smooth transition for background color and box-shadow
        button.style.transition = "background-color 0.3s, box-shadow 0.3s"; // Smooth transition for hover and click

        // Hover effects
        button.addEventListener("mouseover", () => {
          if (button) {
            button.style.backgroundColor = "#A5B4FC"; // Lighter blue on hover
            button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Subtle shadow effect
          }
        });

        button.addEventListener("mouseout", () => {
          if (button) {
            button.style.backgroundColor = "#EFF6FF"; // Reset background color
            button.style.boxShadow = "none"; // Remove shadow on mouse out
          }
        });

        // Add click feedback (button press effect)
        button.addEventListener("click", () => {
          if (button) {
            button.style.backgroundColor = "#E0E7FF"; // Change to clicked state
            button.style.transform = "scale(0.95)"; // Shrink the button slightly
            setTimeout(() => {
              if (button) {
                button.style.backgroundColor = "#EFF6FF"; // Reset color after 300ms
                button.style.transform = "scale(1)"; // Reset scale
                createIframeWithModal(selectedText, rect); // Proceed with original function
              }
            }, 300); // Delay for visual feedback duration
          }
        });

        // Append the button to the document

        document.body.appendChild(button);

        // Show the modal when the button is clicked
        button.addEventListener("click", () => {
          createIframeWithModal(selectedText, rect);
        });
      }
    }
  });
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

    @keyframes slideIn {
      0% {
        transform: translateY(30%);
        opacity: 0;
     }
      100% {
        transform: translateY(0);
        opacity: 1;
     }
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
  dialog.style.position = "absolute"; // Change to fixed positioning
  dialog.style.margin = "0";
  dialog.style.left = "50%"; // Center horizontally
  dialog.style.top = "50%"; // Center vertically
  dialog.style.transform = "translate(-50%, -50%)"; // Center the dialog
  dialog.style.opacity = "0"; // Start invisible
  dialog.style.animation = "slideIn 0.3s ease-out forwards"; // Add the animation

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
