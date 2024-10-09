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

    // Determine the number of selected words
    const wordCount = selectedText.split(/\s+/).length;

    // Create the button
    button = document.createElement("button");

    // Set button text based on the number of words selected
    button.textContent = wordCount === 1 ? "Meaning" : "Summarize";

    // Position the button right below the selected text
    button.style.position = "absolute";
    button.style.top = `${rect.bottom + window.scrollY + 5}px`; // Adjust position below the selected text
    button.style.left = `${rect.left + window.scrollX + rect.width / 2}px`; // Center horizontally
    button.style.transform = "translateX(-50%)"; // Center the button by moving it to the left by half its width
    button.style.zIndex = "9999"; // Ensure it appears above other elements

    // Set styles for the button
    button.style.backgroundColor = "#3890fa"; // Button color
    button.style.color = "#FFFFFF"; // Text color
    button.style.border = "3px solid #2C73C8"; // Border color
    button.style.cursor = "pointer";
    button.style.borderRadius = "15px";

    // Adjust padding and font size to make the button 20% bigger
    button.style.padding = "4.2px 6.6px"; // Increase padding by 20%
    button.style.fontSize = "0.84em"; // Increase font size by 20%
    button.style.fontWeight = "bold"; // Make the text bold

    // Append the button to the document body
    document.body.appendChild(button);

    // Add a click event to show an alert
    button.addEventListener("click", () => {
      alert(`You selected: ${selectedText}`);
    });
  }
});
