let button: HTMLButtonElement | null = null;

document.addEventListener("selectionchange", () => {
  const selectedText: string = window.getSelection()?.toString().trim() || "";

  // Remove existing button if it exists
  if (button) {
    if (document.body.contains(button)) {
      document.body.removeChild(button);
    }
    button = null; // Reset the button variable
  }

  if (selectedText.length > 0) {
    const selection = window.getSelection();
    if (!selection) return; // Ensure selection is not null

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Ensure the rect is defined
    if (!rect) return;

    // Determine the number of selected words
    const wordCount = selectedText.split(/\s+/).length;

    // Create the button
    button = document.createElement("button");
    button.textContent = wordCount === 1 ? "Meaning" : "Summarize";

    // Position the button below the selected text
    button.style.position = "absolute";
    button.style.top = `${rect.bottom + window.scrollY + 10}px`; // Position below the text
    button.style.left = `${rect.left + window.scrollX + rect.width / 2}px`; // Center horizontally
    button.style.transform = "translateX(-50%)";
    button.style.zIndex = "9999";
    button.style.backgroundColor = "#3890fa"; // Button color
    button.style.color = "#FFFFFF"; // Text color
    button.style.border = "3px solid #4299e1"; // Border color
    button.style.cursor = "pointer";
    button.style.borderRadius = "15px";
    button.style.padding = "4px 8px";
    button.style.fontSize = "0.85em";

    document.body.appendChild(button);

    // Show the modal when the button is clicked
    button.addEventListener("click", () => {
      createIframeWithModal(selectedText);
    });
  }
});

function createIframeWithModal(selectedText: string) {
  let dialog: HTMLDialogElement | null = null;

  // Remove existing dialog if it exists
  if (dialog && document.body.contains(dialog)) {
    document.body.removeChild(dialog);
    dialog = null;
  }

  // Create the dialog
  dialog = document.createElement("dialog");
  dialog.style.width = "80%";
  dialog.style.height = "80%";
  dialog.style.border = "none";
  dialog.style.borderRadius = "10px";
  dialog.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  document.body.appendChild(dialog);

  // Create and append iframe inside dialog
  const iframe = document.createElement("iframe");

  // Pass selectedText as a query parameter
  const encodedText = encodeURIComponent(selectedText);
  iframe.src = `${chrome.runtime.getURL("modal.html")}?text=${encodedText}`; // Load modal.html with selected text
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  dialog.appendChild(iframe);

  // Show the dialog
  dialog.showModal();
}
