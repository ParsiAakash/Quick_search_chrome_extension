document.getElementById('google-search').addEventListener('click', function () {
    console.log("Google button clicked");
    searchText('https://www.google.com/search?q=');
});
  
document.getElementById('wikipedia-search').addEventListener('click', function () {
    console.log("Wikipedia button clicked");
    searchText('https://en.wikipedia.org/wiki/Special:Search?search=');
});
  
document.getElementById('youtube-search').addEventListener('click', function () {
    console.log("YouTube button clicked");
    searchText('https://www.youtube.com/results?search_query=');
});
  
function searchText(baseUrl) {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (chrome.runtime.lastError) {
                console.error("Error querying tabs:", chrome.runtime.lastError.message);
                alert("Error querying tabs. Ensure the extension has the correct permissions.");
                return;
            }

            const activeTabId = tabs[0]?.id;
                if (!activeTabId) {
                    console.error("No active tab found.");
                    alert("No active tab found. Please try again.");
                    return;
                }

            chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                func: () => window.getSelection().toString(),
            },(results) => {
                if (chrome.runtime.lastError) {
                    console.error("Error executing script:", chrome.runtime.lastError.message);
                    alert("Error executing script. Check your permissions.");
                    return;
                }
                const selectedText = results[0]?.result || '';
                if (selectedText.trim() === '') {
                    alert("Please select some text to search.");
                } else {
                    const searchUrl = baseUrl + encodeURIComponent(selectedText);
                    chrome.tabs.create({ url: searchUrl });
                }
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        alert("An unexpected error occurred. Check the console for details.");
    }
}
  