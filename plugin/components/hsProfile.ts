import { APIData } from '../types';
import { createDialog } from './createDialog';

function createHubspotDataContainer(): HTMLElement {
    const container = document.createElement("section");
    container.className = "profile-data-container artdeco-card pv-profile-card break-words mt2";
    container.innerHTML = 
      `<div id="hs-profile-data" class="pv-profile-card__anchor"></div>
      <div class="GrBsyQUSPQqfBQUcHbGUeCIlzgVLqFLqcTk">
        <div class="pvs-header__top-container--no-stack">
          <div class="pvs-header__left-container--stack">
            <div class="xwbaEphzIZNlLyNiWGWoWXGommLBDlWW display-flex align-items-center" style="flex-direction: row;">
              <svg height="35px" style="margin-right: 8px;" viewBox="0 0 512 512" width="35px">
                  <g id="_x31_68-hubspot">
                      <g>
                          <path d="M266.197,216.109c-22.551,21.293-36.655,51.48-36.655,84.991c0,26.326,8.714,50.582,23.359,70.08    l-44.473,44.74c-3.953-1.438-8.176-2.245-12.579-2.245c-9.702,0-18.776,3.774-25.605,10.602    c-6.828,6.827-10.602,15.989-10.602,25.696c0,9.701,3.773,18.775,10.602,25.605c6.829,6.826,15.993,10.42,25.605,10.42    c9.703,0,18.777-3.505,25.695-10.42c6.829-6.83,10.602-15.994,10.602-25.605c0-3.774-0.538-7.369-1.707-10.873l44.923-45.102    c19.765,15.183,44.381,24.169,71.244,24.169c64.599,0,116.797-52.38,116.797-116.977c0-58.578-42.854-107.093-99.007-115.628    v-55.343c15.723-6.65,25.335-21.384,25.335-38.545c0-23.449-18.777-43.034-42.227-43.034c-23.448,0-41.956,19.585-41.956,43.034    c0,17.161,9.613,31.895,25.335,38.545v54.983c-13.655,1.887-26.593,6.019-38.362,12.219    c-24.796-18.778-105.565-76.997-151.746-112.126c1.078-3.953,1.798-8.085,1.798-12.397c0-25.875-21.113-46.898-47.078-46.898    c-25.875,0-46.898,21.023-46.898,46.898c0,25.965,21.023,46.988,46.898,46.988c8.805,0,16.98-2.606,24.078-6.828L266.197,216.109z     M346.606,363.095c-34.229,0-61.991-27.763-61.991-61.994c0-34.229,27.762-61.99,61.991-61.99c34.23,0,61.992,27.761,61.992,61.99    C408.599,335.332,380.837,363.095,346.606,363.095z" style="fill:#FF7A59;"/>
                      </g>
                  </g>
              </svg>
              <div>
                <h2 class="pvs-header__title text-heading-large">
                    <span aria-hidden="true">HubSpot Data</span>
                </h2>
                <p class="hs-subtitle ftrZGQLzBJPmHlvAUMHqPigSxeAsTkXM pvs-header__optional-link text-body-small"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="display-flex ph5 pv3">
        <div class="display-flex full-width">
          <div class="KEvCNODQAtjzXXLnpbIHBDqiHVlZLTs full-width t-14 t-normal t-black display-flex align-items-center">
            <div class="hs-content TGWOVglqgEIrPMTmbNgvdREIUWuUNfBZasv full-width"></div>
          </div>
        </div>
      </div>`;
    return container;
  }
  
  // Function to inject API data into the LinkedIn page
  export async function displayProfileData(apiData: APIData): Promise<void> {
    const linkedInProfileSection = document.querySelector('.artdeco-card:first-child');
    const portalId = (await chrome.storage.sync.get(['portalId']))?.portalId;
  
    if (!linkedInProfileSection) {
      console.log("No linkedIn profile section found");
      return;
    }
  
    const existingContainer = document.querySelector('.profile-data-container');
  
    if (!existingContainer) {
      linkedInProfileSection.after(createHubspotDataContainer());
    }
  
    const contentContainer = document.querySelector('.profile-data-container .hs-content');
    const subtitleContainer = document.querySelector('.profile-data-container .hs-subtitle');
  
    if (!contentContainer || !subtitleContainer) {
      console.log("No content container found");
      return;
    }
    
    const profile = apiData.results[0];
    
    if (profile) {
      subtitleContainer.innerHTML = `Last Modified in Hubspot: ${new Date(profile.properties.lastmodifieddate).toLocaleDateString()}`;
  
      contentContainer.innerHTML = `
        <div class="t-16 t-bold">${profile.properties.firstname} ${profile.properties.lastname}</div>
        <div><a href="https://app.hubspot.com/contacts/${portalId}/contact/${profile.id}" target="_blank">View in Hubspot</a></div>
        <span>${profile.properties.email || 'Not available'}</span><br>
        <span>${profile.properties.phone || 'Phone is not available'}</span><br>
        <span>Company: ${profile.properties.company || 'Not available'}</span><br>
        <hr>
        <details>
          <summary>Debug Data</summary>
          <pre>${JSON.stringify(profile, null, 2)}</pre>
        </details>
      `;
    } else {
      subtitleContainer.innerHTML = '';
      contentContainer.innerHTML = `
        <div>Not Found</div>
        <button class="artdeco-button artdeco-button--2 artdeco-button--primary ember-view CbYYxhNRQWveRDEqoBfQEkjNjBIdhzaCQ" id="create-in-hubspot">Create in Hubspot</button>
      `;
  
      // Add event listener for the create button
      const createButton = contentContainer.querySelector('#create-in-hubspot');
      createButton?.addEventListener('click', createDialog);
    }
  }
