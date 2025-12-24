const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', function() {
  browserAPI.storage.sync.get(['passkey'])
    .then(function(result) {
      if (result.passkey) {
        document.getElementById('passkey').value = result.passkey;
      }
    })
    .catch(function(error) {
      console.error('[YGGMollo] Error loading settings:', error);
    });
});

document.getElementById('save').addEventListener('click', function() {
  const passkey = document.getElementById('passkey').value.trim();

  if (!passkey) {
    showStatus('Veuillez entrer une passkey', false);
    return;
  }

  browserAPI.storage.sync.set({
    passkey: passkey
  })
  .then(function() {
    showStatus('Paramètres enregistrés avec succès !', true);
  })
  .catch(function(error) {
    console.error('[YGGMollo] Error saving settings:', error);
    showStatus('Erreur lors de la sauvegarde', false);
  });
});

function showStatus(message, isSuccess) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status' + (isSuccess ? ' success' : '');
  status.style.display = 'block';

  setTimeout(function() {
    status.style.display = 'none';
  }, 3000);
}
