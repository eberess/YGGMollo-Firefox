// Options page script

// Load saved settings
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['passkey'], function(result) {
    if (result.passkey) {
      document.getElementById('passkey').value = result.passkey;
    }
  });
});

// Save settings
document.getElementById('save').addEventListener('click', function() {
  const passkey = document.getElementById('passkey').value.trim();

  if (!passkey) {
    showStatus('Veuillez entrer une passkey', false);
    return;
  }

  chrome.storage.sync.set({
    passkey: passkey
  }, function() {
    showStatus('Paramètres enregistrés avec succès !', true);
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
