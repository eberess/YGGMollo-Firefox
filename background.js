// @ts-nocheck

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function precheckAndDownload(torrentId, showNotification) {
  try {
    const { passkey, baseUrl } = await browserAPI.storage.sync.get({ passkey: null, baseUrl: 'https://yggapi.eu' });
    if (!passkey || typeof passkey !== 'string' || passkey.length !== 32) {
      return { success: false, code: 'NO_PASSKEY', message: 'Aucune passkey valide configuree' };
    }
    const apiBase = (baseUrl && typeof baseUrl === 'string') ? baseUrl.replace(/\/$/, '') : 'https://yggapi.eu';
    const downloadUrl = `${apiBase}/torrent/${encodeURIComponent(torrentId)}/download?passkey=${encodeURIComponent(passkey)}`;

    // Pre-check via HEAD
    let headResp;
    try {
      headResp = await fetch(downloadUrl, { method: 'HEAD', redirect: 'follow' });
    } catch (e) {
      return { success: false, code: 'NETWORK', message: 'Impossible de joindre API (reseau/serveur)' };
    }

    if (!headResp.ok) {
      const status = headResp.status;
      if (status === 401 || status === 403) return { success: false, code: status, message: 'Passkey invalide ou refusee par API' };
      if (status === 404) return { success: false, code: status, message: 'Torrent introuvable' };
      if (status === 429) return { success: false, code: status, message: 'Trop de requetes (rate limit), reessayez plus tard' };
      if (status >= 500) return { success: false, code: status, message: 'API indisponible (erreur serveur)' };
      return { success: false, code: status, message: `Erreur API (${status})` };
    }

    // Telechargement
    const filename = `torrent-${torrentId}.torrent`;
    const downloadId = await browserAPI.downloads.download({ url: downloadUrl, filename, saveAs: false });

    // Notification optionnelle (desactivee par defaut en mode furtif)
    if (showNotification) {
      try {
        if (browserAPI.notifications && browserAPI.notifications.create) {
          browserAPI.notifications.create('', {
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'YGGMollo',
            message: `Telechargement demarre (#${torrentId})`
          });
        }
      } catch (_) {}
    }

    return { success: true, downloadId };
  } catch (err) {
    return { success: false, code: 'INTERNAL', message: String(err && err.message ? err.message : err) };
  }
}

browserAPI.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openOptions') {
    browserAPI.runtime.openOptionsPage();
  } else if (request.action === 'download') {
    const showNotification = request.showNotification || false;
    precheckAndDownload(request.torrentId, showNotification)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, code: 'INTERNAL', message: String(err) }));
    return true; // keep port open
  }
});
