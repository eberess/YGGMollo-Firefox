// YGGSearch - Add Télécharger button to YGGTorrent pages

(function() {
  'use strict';

  // Wait for the page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Find the download button
    const downloadBtn = document.getElementById('download-timer-btn');

    if (!downloadBtn) {
      console.log('[YGGMollo] Download button not found on page');
      return;
    }

    // Extract torrent ID from the button
    const torrentId = downloadBtn.getAttribute('data-torrent-id');

    if (!torrentId) {
      console.log('[YGGMollo] Torrent ID not found');
      return;
    }

    console.log('[YGGMollo] Found torrent ID:', torrentId);

    // Get the passkey from storage and add the button
    chrome.storage.sync.get(['passkey'], function(result) {
      if (!result.passkey) {
        console.log('[YGGMollo] No passkey configured. Please set it in the extension options.');
        addConfigButton(downloadBtn);
        return;
      }

      addDownloadButton(downloadBtn, torrentId, result.passkey);
    });
  }

  function addConfigButton(downloadBtn) {
    // Add a button to open settings if no passkey is configured
    const configBtn = document.createElement('a');
    configBtn.href = '#';
    configBtn.className = 'butt yggsearch-api-btn';
    configBtn.innerHTML = '<span class="ico_settings"></span> Configurer YGGMollo';
    configBtn.title = 'Configurez votre passkey';

    configBtn.addEventListener('click', function(e) {
      e.preventDefault();
      chrome.runtime.sendMessage({ action: 'openOptions' });
    });

    // Insert after the download button
    downloadBtn.parentNode.insertBefore(configBtn, downloadBtn.nextSibling);
    downloadBtn.parentNode.insertBefore(document.createTextNode(' '), downloadBtn.nextSibling);
  }

  function addDownloadButton(downloadBtn, torrentId, passkey) {
    // Create the new download button
    const apiBtn = document.createElement('a');
    apiBtn.href = '#';
    apiBtn.className = 'butt yggsearch-api-btn';
    apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
    apiBtn.title = 'Télécharger via YGG API';

    // Handle click to download directly
    apiBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // Add loading state
      apiBtn.classList.add('loading');
      apiBtn.innerHTML = '<span class="ico_download"></span> Téléchargement...';
      apiBtn.style.pointerEvents = 'none';

      const downloadUrl = `https://yggapi.eu/torrent/${torrentId}/download?passkey=${passkey}`;
      console.log('[YGGMollo] Téléchargement du torrent ID:', torrentId);

      // Timeout après 60 secondes
      const timeoutId = setTimeout(function() {
        apiBtn.classList.remove('loading');
        apiBtn.classList.add('error');
        apiBtn.innerHTML = '<span class="ico_download"></span> Timeout - Réessayer';

        // Reset après 3 secondes
        setTimeout(function() {
          apiBtn.classList.remove('error');
          apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
          apiBtn.style.pointerEvents = '';
        }, 3000);
      }, 60000);

      // Send message to background script to initiate download
      chrome.runtime.sendMessage({
        action: 'download',
        url: downloadUrl,
        filename: `torrent-${torrentId}.torrent`
      }, function(response) {
        // Annuler le timeout si le téléchargement démarre
        clearTimeout(timeoutId);

        if (response && response.success) {
          // Reset button after download starts
          setTimeout(function() {
            apiBtn.classList.remove('loading');
            apiBtn.innerHTML = '<span class="ico_download"></span> Téléchargé !';

            // Reset to original state after 2 seconds
            setTimeout(function() {
              apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
              apiBtn.style.pointerEvents = '';
            }, 2000);
          }, 500);
        } else {
          // Erreur lors du téléchargement
          apiBtn.classList.remove('loading');
          apiBtn.classList.add('error');
          apiBtn.innerHTML = '<span class="ico_download"></span> Erreur - Réessayer';

          setTimeout(function() {
            apiBtn.classList.remove('error');
            apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
            apiBtn.style.pointerEvents = '';
          }, 3000);
        }
      });
    });

    // Insert after the download button
    downloadBtn.parentNode.insertBefore(apiBtn, downloadBtn.nextSibling);
    downloadBtn.parentNode.insertBefore(document.createTextNode(' '), downloadBtn.nextSibling);

    console.log('[YGGMollo] Button added successfully');
  }
})();
