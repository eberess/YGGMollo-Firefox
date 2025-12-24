const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', function() {
  browserAPI.storage.sync.get({ passkey: null, baseUrl: 'https://yggapi.eu' })
    .then(function(result) {
      if (result.passkey) {
        document.getElementById('passkey').value = result.passkey;
      }
      if (result.baseUrl) {
        document.getElementById('baseUrl').value = result.baseUrl;
      }
    })
    .catch(function(error) {
      console.error('[YGGMollo] Error loading settings:', error);
    });
});

document.getElementById('save').addEventListener('click', function() {
  const passkey = document.getElementById('passkey').value.trim();
  const baseUrl = document.getElementById('baseUrl').value.trim() || 'https://yggapi.eu';

  if (!passkey) {
    showStatus('Veuillez entrer une passkey', false);
    return;
  }
  if (passkey.length !== 32) {
    showStatus('Passkey invalide (32 caractères requis)', false);
    return;
  }

  browserAPI.storage.sync.set({
    passkey: passkey,
    baseUrl: baseUrl.replace(/\/$/, '')
  })
  .then(function() {
    showStatus('Paramètres enregistrés avec succès !', true);
  })
  .catch(function(error) {
    console.error('[YGGMollo] Error saving settings:', error);
    showStatus('Erreur lors de la sauvegarde', false);
  });
});

// Toggle show/hide passkey
const toggle = document.getElementById('toggle-passkey');
if (toggle) {
  toggle.addEventListener('change', function() {
    const input = document.getElementById('passkey');
    input.type = this.checked ? 'text' : 'password';
  });
}

function showStatus(message, isSuccess) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status' + (isSuccess ? ' success' : '');
  status.style.display = 'block';

  setTimeout(function() {
    status.style.display = 'none';
  }, 3000);
}
