import { auth } from "./auth.js";
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const listingId = params.get("id");
const deleteUrl = `https://api.noroff.dev/api/v1/auction/listings/${listingId}`;
const deleteButton = document.getElementById("deleteButton");
const deleteError = document.getElementById("deleteError");
/**
 * Delete a listing with a API Delete request.
 *
 * Headers need autorization and listing ID.
 *
 */
async function deleteListing(event) {
  event.preventDefault();
  try {
    const deleteOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth}`,
        ID: listingId,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(deleteUrl, deleteOptions);
    console.log(response);
    if (response.status === 204) {
      window.location.href = "profile.html";
    } else {
      deleteError.innerHTML = `${response.errors[0].message}`;
      setTimeout(function () {
        deleteError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    deleteError.innerHTML = `Something went wrong, ${error}`;
  }
}

deleteButton.addEventListener("submit", deleteListing);
