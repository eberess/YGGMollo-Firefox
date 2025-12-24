const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openOptions') {
    browserAPI.runtime.openOptionsPage();
  } else if (request.action === 'download') {
    browserAPI.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: false
    })
    .then(function(downloadId) {
      console.log('[YGGMollo] Download started:', downloadId);
      sendResponse({ success: true, downloadId: downloadId });
    })
    .catch(function(error) {
      console.error('[YGGMollo] Download error:', error);
      sendResponse({ success: false, error: error.message || String(error) });
    });
    
    return true;
  }
});
