import { auth } from "./auth.js";
const queryStringPut = document.location.search;
const putParams = new URLSearchParams(queryStringPut);
const listingId = putParams.get("id");
const listingUrl = `https://api.noroff.dev/api/v1/auction/listings/${listingId}`;

const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editMedia = document.getElementById("editMedia");
const editError = document.getElementById("editError");

const editAddFields = document.getElementById("editAddFields");
const editRemoveFields = document.getElementById("editRemoveFields");
const galleryInputs = document.getElementById("galleryInputs");
let inputs = 0;

function addGalleryInputs() {
  inputs += 1;
  const fieldLabel = document.createElement("label");
  fieldLabel.className = "form-label";
  fieldLabel.htmlFor = `gallery${inputs}`;
  fieldLabel.id = `galleryLabel${inputs}`;
  fieldLabel.innerHTML = `Picture ${inputs}`;
  const field = document.createElement("input");
  field.type = "text";
  field.className = "form-control rounded-0 pictures";
  field.id = `gallery${inputs}`;

  galleryInputs.appendChild(fieldLabel);
  galleryInputs.appendChild(field);
}

function removeGalleryInputs() {
  let removeField = document.getElementById(`gallery${inputs}`);
  let removeFieldLabel = document.getElementById(`galleryLabel${inputs}`);
  removeField.remove();
  removeFieldLabel.remove();
  inputs -= 1;
}

editAddFields.addEventListener("click", addGalleryInputs);
editRemoveFields.addEventListener("click", removeGalleryInputs);

// get data for listing
async function getListing() {
  try {
    const getListingOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        id: listingId,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(listingUrl, getListingOptions);
    const result = await response.json();
    editHTML(result);
  } catch (error) {
    editError.innerHTML = `Something went wrong, ${error}`;
  }
}

getListing();

function editHTML(data) {
  editTitle.value = data.title;
  editDescription.value = data.description;
  if (data.media) {
    editMedia.value = data.media[0];
    for (let i = 1; i < data.media.length; i++) {
      const element = data.media[i];
      addGalleryInputs();
      const editFields = document.getElementById(`gallery${inputs}`);
      editFields.value = element;
    }
  }
}

// Edit listing

const editForm = document.getElementById("editForm");
const title = document.getElementById("title");
const description = document.getElementById("description");

const editTitleMessage = document.getElementById("editTitleMessage");
const editMediaMessage = document.getElementById("editMediaMessage");

/**
 * Edit a listing with API PUT request
 *
 * Input from edit form.
 *
 * Function runs when submiting form.
 *
 *  @example
 * * ```js
 * // From submit form
 * title
 * description
 * media
 * date ends
 * // method put with autorization header
 * ```
 */
async function editListings(event) {
  event.preventDefault();
  const pictures = document.querySelectorAll(".pictures");
  editMediaMessage.innerHTML = "";
  let pictureArray = [];
  for (let picture of pictures) {
    if (picture.value) {
      pictureArray.push(picture.value);
    }
  }
  const listingsData = {
    title: editTitle.value,
    description: editDescription.value,
    media: pictureArray,
  };
  const putOptions = {
    method: "PUT",
    body: JSON.stringify(listingsData),
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(listingUrl, putOptions);
    const json = await response.json();
    if (response.ok === true) {
      console.log(response);
      window.location.href = `/detail.html?id=${json.id}`;
    } else {
      editError.innerHTML = `${json.errors[0].message}`;
      setTimeout(function () {
        editError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    editError.innerHTML = `Something went wrong, ${error}`;
  }
}

editForm.addEventListener("submit", editListings);
