document.getElementById('save').addEventListener('click', () => {
    const token = document.getElementById('api-token').value.trim();
  
    if (token) {
        // Validate token with HubSpot API
        fetch('https://api.hubapi.com/account-info/v3/details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            return response.json();
        })
        .then(data => {
            // Save both token and portal ID (hub ID)
            chrome.storage.sync.set({ 
                apiToken: token,
                portalId: data.portalId 
            }, () => {
                document.getElementById('status').textContent = 'Token saved successfully!';
                setTimeout(() => { document.getElementById('status').textContent = ''; }, 2000);
            });
        })
        .catch(error => {
            alert('Invalid API token. Please check and try again.');
        });
    } else {
      alert('Please enter a valid API token.');
    }
  });
  
  // Automatically load and display the saved token
  chrome.storage.sync.get(['apiToken'], (result) => {
    if (result.apiToken) {
      document.getElementById('api-token').value = result.apiToken;
    }
  });
