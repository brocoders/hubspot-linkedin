import { APIData } from './types';
import { cleanLinkedInUrl } from './utils';
const API_URL = 'https://api.hubapi.com/crm/v3';

async function searchContact(url: string) {
  try {
    const API_KEY = (await chrome.storage.sync.get(['apiToken']))?.apiToken;
    const response = await fetch(
      `${API_URL}/objects/contacts/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'linkedin',
              operator: 'CONTAINS_TOKEN',
              value: `${url}*`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // const contactId = data.results[0].id;

    // const companyResponse = await fetch(
    //   `${API_URL}/objects/contacts/${contactId}?associations=companies`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${API_KEY}`,
    //       'Content-Type': 'application/json',
    //     }
    //   }
    // );

    // if (companyResponse.ok) {
    //   const companyData = await companyResponse.json();
    //   // Combine contact data with company associations
    //   data.results[0].companies = companyData.associations?.companies?.results || [];
    // }

    return data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
}

// Listen for tab updates to refresh the profile data
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.match(/.*linkedin\.com\/in\/[^/]+\/?(\?.*)?$/)) {
    searchContact(cleanLinkedInUrl(tab.url)).then((hsData: APIData) => {
      chrome.tabs.sendMessage(tabId, {
        type: 'DISPLAY_PROFILE_DATA',
        data: {hsData}
      });
    });
  }
}); 

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['apiToken'], (result) => {
    if (!result.apiToken) {
      chrome.runtime.openOptionsPage();
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createContact') {
    chrome.storage.sync.get(['apiToken']).then((result) => {
      fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts/batch/create",
        {
        method: "POST",
        headers: {
          authorization: `Bearer ${result.apiToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          inputs: [
            {
              properties: {
                firstname: request.contactData.firstName,
                lastname: request.contactData.lastName,
                linkedin: request.contactData.linkedinUrl,
                jobtitle: request.contactData.jobTitle,
                company: request.contactData.companyName,
              },
            },
          ],
        }),
      }).then(response => {
        return response.json().then(data => {
          if (!response.ok) {
            throw new Error("Failed to create contact");
          }
          sendResponse({success: true, data}); 
        });
      });
    });
    return true;
  }
});
