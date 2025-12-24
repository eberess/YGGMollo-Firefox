
(function() {
  'use strict';

  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const downloadBtn = document.getElementById('download-timer-btn');

    if (!downloadBtn) {
      console.log('[YGGMollo] Download button not found on page');
      return;
    }

    const torrentId = downloadBtn.getAttribute('data-torrent-id');

    if (!torrentId) {
      console.log('[YGGMollo] Torrent ID not found');
      return;
    }

    console.log('[YGGMollo] Found torrent ID:', torrentId);

    browserAPI.storage.sync.get(['passkey'])
      .then(function(result) {
        if (!result.passkey) {
          console.log('[YGGMollo] No passkey configured. Please set it in the extension options.');
          addConfigButton(downloadBtn);
          return;
        }

        addDownloadButton(downloadBtn, torrentId, result.passkey);
      })
      .catch(function(error) {
        console.error('[YGGMollo] Error loading passkey:', error);
        addConfigButton(downloadBtn);
      });
  }

  function addConfigButton(downloadBtn) {
    const configBtn = document.createElement('a');
    configBtn.href = '#';
    configBtn.className = 'butt yggsearch-api-btn';
    configBtn.innerHTML = '<span class="ico_settings"></span> Configurer YGGMollo';
    configBtn.title = 'Configurez votre passkey';

    configBtn.addEventListener('click', function(e) {
      e.preventDefault();
      browserAPI.runtime.sendMessage({ action: 'openOptions' });
    });

    downloadBtn.parentNode.insertBefore(configBtn, downloadBtn.nextSibling);
    downloadBtn.parentNode.insertBefore(document.createTextNode(' '), downloadBtn.nextSibling);
  }

  function addDownloadButton(downloadBtn, torrentId, passkey) {
    const apiBtn = document.createElement('a');
    apiBtn.href = '#';
    apiBtn.className = 'butt yggsearch-api-btn';
    apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
    apiBtn.title = 'Télécharger via YGG API';

    apiBtn.addEventListener('click', function(e) {
      e.preventDefault();

      apiBtn.classList.add('loading');
      apiBtn.innerHTML = '<span class="ico_download"></span> Téléchargement...';
      apiBtn.style.pointerEvents = 'none';

      const downloadUrl = `https://yggapi.eu/torrent/${torrentId}/download?passkey=${passkey}`;
      console.log('[YGGMollo] Téléchargement du torrent ID:', torrentId);

      const timeoutId = setTimeout(function() {
        apiBtn.classList.remove('loading');
        apiBtn.classList.add('error');
        apiBtn.innerHTML = '<span class="ico_download"></span> Timeout - Réessayer';

        setTimeout(function() {
          apiBtn.classList.remove('error');
          apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
          apiBtn.style.pointerEvents = '';
        }, 3000);
      }, 60000);

      browserAPI.runtime.sendMessage({
        action: 'download',
        url: downloadUrl,
        filename: `torrent-${torrentId}.torrent`
      })
      .then(function(response) {
        clearTimeout(timeoutId);

        if (response && response.success) {
          setTimeout(function() {
            apiBtn.classList.remove('loading');
            apiBtn.innerHTML = '<span class="ico_download"></span> Téléchargé !';

            setTimeout(function() {
              apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
              apiBtn.style.pointerEvents = '';
            }, 2000);
          }, 500);
        } else {
          apiBtn.classList.remove('loading');
          apiBtn.classList.add('error');
          apiBtn.innerHTML = '<span class="ico_download"></span> Erreur - Réessayer';

          setTimeout(function() {
            apiBtn.classList.remove('error');
            apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
            apiBtn.style.pointerEvents = '';
          }, 3000);
        }
      })
      .catch(function(error) {
        clearTimeout(timeoutId);
        console.error('[YGGMollo] Error sending message:', error);
        
        apiBtn.classList.remove('loading');
        apiBtn.classList.add('error');
        apiBtn.innerHTML = '<span class="ico_download"></span> Erreur - Réessayer';

        setTimeout(function() {
          apiBtn.classList.remove('error');
          apiBtn.innerHTML = '<span class="ico_download"></span> Télécharger (Ygg-API)';
          apiBtn.style.pointerEvents = '';
        }, 3000);
      });
    });

    downloadBtn.parentNode.insertBefore(apiBtn, downloadBtn.nextSibling);
    downloadBtn.parentNode.insertBefore(document.createTextNode(' '), downloadBtn.nextSibling);

    console.log('[YGGMollo] Button added successfully');
  }
})();
