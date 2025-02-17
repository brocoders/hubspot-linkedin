document.getElementById('showToken').addEventListener('click', () => {
    chrome.storage.sync.get(['apiToken'], (result) => {
      if (result.apiToken) {
        document.getElementById('tokenDisplay').textContent = `Token: ${result.apiToken}`;
      } else {
        document.getElementById('tokenDisplay').textContent = 'No token set.';
      }
    });
  });
  