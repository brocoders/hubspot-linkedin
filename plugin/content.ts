import { APIData, Message } from './types';
import { displayProfileData } from './components/hsProfile';
// Listen for response from the background script
chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message.type) {
    case "DISPLAY_PROFILE_DATA":
      if (message.data) {
        displayProfileData(message.data.hsData);
      }
      break;
  }
});
