import { ProfileData } from "../types";
import { cleanLinkedInUrl } from "../utils";
import { displayProfileData } from "./hsProfile";

function extractProfileData(): ProfileData | null {
  const nameElement = document.querySelector("h1");
  

  if (nameElement) {
    const fullName = nameElement.innerText.trim();
    const [firstName, ...lastName] = fullName.split(" ");
    const experienceElement = document.querySelector("#experience")?.parentElement;

    const profileData: ProfileData = {
      firstName,
      lastName: lastName.join(" "),
      linkedinUrl: `https://www.${cleanLinkedInUrl(document.URL)}/`,
    };
    
    if (experienceElement) {
      let experienceArr = (experienceElement.querySelector('.artdeco-list__item:first-child') as HTMLElement)?.innerText?.split("\n") || [];
      
      experienceArr = experienceArr.filter((item, pos, self) => {
        return self.indexOf(item) === pos;
      });
      
      profileData.jobTitle = experienceArr[0];
      profileData.companyName = experienceArr[1].replace(/ · .*/, "");
    }

    return profileData;
  }

  return null;
}

export function createDialog(): HTMLElement {
  const dialog = document.createElement("div");
  dialog.id = "artdeco-modal-outlet";

  const profileData = extractProfileData();

  const fields = [
    {
      label: "Name",
      id: "hs-linkedin-name",
      placeholder: "Ex: Joe",
      value: profileData?.firstName,
    },
    {
      label: "Surname",
      id: "hs-linkedin-surname",
      placeholder: "Ex: Doe",
      value: profileData?.lastName,
    },
    {
      label: "Linkedin URL",
      id: "hs-linkedin-linkedin",
      placeholder: "Ex: https://www.linkedin.com/in/joe-doe/",
      value: profileData?.linkedinUrl,
    },
    {
      label: "Job Title",
      id: "hs-linkedin-job-title",
      placeholder: "Ex: Software Engineer",
      value: profileData?.jobTitle,
    },
    {
      label: "Company Name",
      id: "hs-linkedin-company-name",
      placeholder: "Ex: Google",
      value: profileData?.companyName,
    }
  ];

  const formElements = fields
    .map((field) => {
      return `<div class="fb-dash-form-element-group" data-test-form-element-group="">
        <div class="fb-dash-form-element-group-elements fb-dash-form-element-group-elements--horizontal" data-test-form-element-group-elements="">
            <div class="fb-dash-form-element" style="width:100%" tabindex="-1" data-test-form-element="" data-view-name="profile-form-component">
                <div class="relative " data-test-single-typeahead-entity-form-component="">
                    <label for="${field.id}" class="fb-dash-form-element__label fb-dash-form-element__label-title--is-required" data-test-single-typeahead-entity-form-title="true">
                        ${field.label}
                    </label>
                    <div id="${field.id}-container" class="search-basic-typeahead search-vertical-typeahead">
                        <input id="${field.id}" class="basic-input " placeholder="${field.placeholder}" required="" dir="auto" role="combobox" aria-autocomplete="list" aria-activedescendant="" aria-expanded="false" type="text" value="${field.value}">
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    })
    .join("");

  dialog.innerHTML = `
    <div data-test-modal-container="" aria-hidden="false" id="ember820" class="artdeco-modal-overlay artdeco-modal-overlay--layer-default artdeco-modal-overlay--is-top-layer ember-view">
        <div data-test-modal="" role="dialog" tabindex="-1" class="artdeco-modal artdeco-modal--layer-default pe-edit-form-page__modal pe-edit-form-page__modal--large" size="large" aria-labelledby="profile-edit-form-page-header">
            <button aria-label="Dismiss" id="ember821" class="artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view artdeco-modal__dismiss" data-test-modal-close-btn=""> 
                <svg role="none" aria-hidden="true" class="artdeco-button__icon " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" data-supported-dps="24x24" data-test-icon="close-medium">
                    <use href="#close-medium" width="24" height="24"></use>
                </svg>
            </button>

            <div id="ember822" class="artdeco-modal__header ember-view">
                <h2 id="profile-edit-form-page-header">
                    Add education
                </h2>
            </div>

            <div id="profile-edit-form-page-content-wrapper" class="pe-edit-form-page__content-wrapper">
                <div id="profile-edit-form-page-content" class="artdeco-modal__content pe-edit-form-page__content  ember-view">
                    <div class="pv4 ph5">
                        <p class="t-12 t-black--light">
                            * Indicates required
                        </p>
                        <div data-test-form-section="" class="pt5">
                            ${formElements}
                        </div>
                    </div>
                </div>
            </div>

            <div id="ember839" class="artdeco-modal__actionbar display-flex justify-space-between flex-row-reverse pv4 ember-view">
                <button id="ember840" class="artdeco-button artdeco-button--2 artdeco-button--primary ember-view" data-view-name="profile-form-save" type="button">
                    <span class="artdeco-button__text">
                        Save
                    </span>
                </button>
            </div>

            <span class="a11y-text">Dialog content end.</span>
        </div>
    </div>
  `;

  // Add event listeners
  const dismissButton = dialog.querySelector(".artdeco-modal__dismiss");
  dismissButton?.addEventListener("click", () => {
    dialog.remove();
  });

  const saveButton = dialog.querySelector('[data-view-name="profile-form-save"]');
  saveButton?.addEventListener("click", async () => {
    const contactData = {
      firstName: (document.getElementById('hs-linkedin-name') as HTMLInputElement)?.value,
      lastName: (document.getElementById('hs-linkedin-surname') as HTMLInputElement)?.value,
      linkedinUrl: (document.getElementById('hs-linkedin-linkedin') as HTMLInputElement)?.value,
      jobTitle: (document.getElementById('hs-linkedin-job-title') as HTMLInputElement)?.value,
      companyName: (document.getElementById('hs-linkedin-company-name') as HTMLInputElement)?.value
    };

    chrome.runtime.sendMessage(
      { action: "createContact", contactData }
    ).then((response) => {
      if (response.success) {
        console.log("Contact created successfully:", response.data);
        // Success - close the dialog
        displayProfileData(response.data);
        dialog.remove();
      } else {
        console.error("Error creating contact:", response.error);
      }
    });
  });

  document.body.appendChild(dialog);
  return dialog;
}
