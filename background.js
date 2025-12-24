
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function precheckAndDownload(torrentId) {
  try {
    const { passkey, baseUrl } = await browserAPI.storage.sync.get({ passkey: null, baseUrl: 'https://yggapi.eu' });
    if (!passkey || typeof passkey !== 'string' || passkey.length !== 32) {
      return { success: false, code: 'NO_PASSKEY', message: 'Aucune passkey valide configurée' };
    }
    const apiBase = (baseUrl && typeof baseUrl === 'string') ? baseUrl.replace(/\/$/, '') : 'https://yggapi.eu';
    const downloadUrl = `${apiBase}/torrent/${encodeURIComponent(torrentId)}/download?passkey=${encodeURIComponent(passkey)}`;

    // Pré-check via HEAD
    let headResp;
    try {
      headResp = await fetch(downloadUrl, { method: 'HEAD', redirect: 'follow' });
    } catch (e) {
      return { success: false, code: 'NETWORK', message: 'Impossible de joindre l’API (réseau/serveur)' };
    }

    if (!headResp.ok) {
      const status = headResp.status;
      if (status === 401 || status === 403) return { success: false, code: status, message: 'Passkey invalide ou refusée par l’API' };
      if (status === 404) return { success: false, code: status, message: 'Torrent introuvable' };
      if (status === 429) return { success: false, code: status, message: 'Trop de requêtes (rate limit), réessayez plus tard' };
      if (status >= 500) return { success: false, code: status, message: 'API indisponible (erreur serveur)' };
      return { success: false, code: status, message: `Erreur API (${status})` };
    }

    // Téléchargement
    const filename = `torrent-${torrentId}.torrent`;
    const downloadId = await browserAPI.downloads.download({ url: downloadUrl, filename, saveAs: false });

    try {
      if (browserAPI.notifications && browserAPI.notifications.create) {
        browserAPI.notifications.create('', {
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'YGGMollo',
          message: `Téléchargement démarré (#${torrentId})`
        });
      }
    } catch (_) {}

    return { success: true, downloadId };
  } catch (err) {
    return { success: false, code: 'INTERNAL', message: String(err && err.message ? err.message : err) };
  }
}

browserAPI.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openOptions') {
    browserAPI.runtime.openOptionsPage();
  } else if (request.action === 'download') {
    precheckAndDownload(request.torrentId)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, code: 'INTERNAL', message: String(err) }));
    return true; // keep port open
  }
});
