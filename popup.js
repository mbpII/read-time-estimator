document.getElementById("calculate").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: estimateReadingTime,
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (results && results[0]) {
        document.getElementById("reading-time").textContent =
          //removed the .result from the end of the function for testing
          `Estimated reading time: ${results[0].result}`;
      }
    },
  );
});

function estimateReadingTime() {
  const text = document.body.innerText; // Get all text from the page
  const wpm = 238; // Average reading speed (words per minute): 260 is the average for an adult reading fiction
  const words = text.trim().split(/\s+/).length; // Count words
  const time = Math.ceil(words / wpm); // Calculate reading time in minutes
  return time + " minute(s)";
}
