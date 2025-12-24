// Background script for YGGMollo

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
  } else if (request.action === 'download') {
    // Download the torrent file
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: false
    }, function(downloadId) {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error('[YGGMollo] Download error:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('[YGGMollo] Download started:', downloadId);
        sendResponse({ success: true, downloadId: downloadId });
      }
    });
    // Keep the message channel open for sendResponse
    return true;
  }
});
