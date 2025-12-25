
// @ts-nocheck

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
      return;
    }

    const torrentId = downloadBtn.getAttribute('data-torrent-id');

    if (!torrentId) {
      return;
    }

    browserAPI.storage.sync.get(['passkey', 'stealthMode', 'showNotifications'])
      .then(function(result) {
        if (!result.passkey) {
          return;
        }

        const stealthMode = result.stealthMode !== false; // Activé par défaut
        const showNotifications = result.showNotifications === true; // Désactivé par défaut

        if (stealthMode) {
          interceptNativeButton(downloadBtn, torrentId, showNotifications);
        }
      })
      .catch(function(error) {
        // Silence - no logs
      });
  }

  function interceptNativeButton(downloadBtn, torrentId, showNotifications) {
    // Intercepter le clic sur le bouton natif
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Délai aléatoire entre 2 et 8 secondes (comportement humain)
      const randomDelay = Math.floor(Math.random() * 6000) + 2000;

      setTimeout(function() {
        browserAPI.runtime.sendMessage({
          action: 'download',
          torrentId: torrentId,
          showNotification: showNotifications
        });
      }, randomDelay);
    }, true); // useCapture = true pour intercepter avant les autres handlers
  }
})();
