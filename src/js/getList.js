import { auth, username } from "./auth.js";

const registerButton = document.getElementById("register");
const logInButton = document.getElementById("logIn");
const logOutButton = document.getElementById("logOut");
const navSell = document.getElementById("navSell");
const navProfile = document.getElementById("navProfile");

function isLogedIn() {
  if (auth && username) {
    registerButton.style.display = "none";
    logInButton.style.display = "none";
  } else {
    logOutButton.style.display = "none";
    navSell.style.display = "none";
    navProfile.style.display = "none";
  }
}

isLogedIn();
const listingsCards = document.getElementById("listings");
const searchButton = document.getElementById("searchButton");
const activeListings = document.getElementById("activeListings");
const baseUrl =
  "https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true";
let url = baseUrl;

// event listeners for active filter and search
activeListings.addEventListener("change", activeChange);
searchButton.addEventListener("click", search);

function activeChange() {
  if (activeListings.checked === true) {
    url = baseUrl + "&_active=true";
    getListings(url);
  } else {
    url = baseUrl;
    getListings(url);
  }
}

let data = [];

/**
 * Get auction listings from API.
 *
 * Stores data for use for filter and search.
 *
 * Sending data to writePosts for creating html for list.
 *
 * @throws {error} if fails
 */
async function getListings(url) {
  try {
    const getListingsOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, getListingsOptions);
    const result = await response.json();
    data = result;
    writeListings(data);
  } catch (error) {
    listingsCards.innerHTML += `Something went wrong, ${error}`;
  }
}

getListings(baseUrl + "&_active=true");

/**
 *
 * Creating HTML for listings
 *
 * @params {array} listings - array of listings that are going to be rendered in the list.
 *
 * creates html for list items from an array
 */
function writeListings(listings) {
  length = listings.length;
  listingsCards.innerHTML = "";
  for (let i = 0; i < length; i++) {
    if (listings[i] === undefined) {
      return;
    }
    const {
      id,
      title,
      description,
      seller,
      media,
      created,
      endsAt,
      updated,
      bids,
      _count,
    } = listings[i];
    let itemMedia = [];
    if (media.length === 0) {
      itemMedia.push("src/img/placeholder.jpg");
    } else {
      itemMedia = media;
    }
    let amount = " ";
    if (bids.length === 0) {
      amount = 0;
    } else {
      findCurrentBid(bids);
      amount = currentBid;
    }
    const date = new Date(endsAt);
    const localDate = date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    listingsCards.innerHTML += `
    <div class="col py-3">
    <a href="detail.html?id=${id}" class="text-decoration-none text-reset">
        <div class="card rounded-0 border-dark">
          <img
            src="${itemMedia[0]}"
            class="card-img-top rounded-0 media"
            alt="picture of the listing"
          />
          <h3 class="card-title px-1 pt-3 text-truncate">${title}</h3>
          <p class="card-text ps-1">Current bid: ${amount}</p>
          <p class="card-text ps-1 mb-2">Ends at: ${localDate}</p>
        </div>
      </a>
    </div>
      `;
  }
}

/**
 * Text search throug listings.
 *
 * Search text from input field.
 *
 * Searching throug description and title in data from api.
 *
 * searchData is sent to function writeListings
 *
 */
function search() {
  const searchText = document.getElementById("searchText");
  const search = searchText.value.toLowerCase();

  const searchData = data.filter((listing) => {
    const { title, description } = listing;
    const listingsDescription = description || "";
    return (
      title.toLowerCase().includes(search) ||
      listingsDescription.toLowerCase().includes(search)
    );
  });
  writeListings(searchData);
}

let currentBid = "";
function findCurrentBid(bids) {
  if (bids.length !== 0) {
    const amounts = bids.map((a) => a.amount);
    currentBid = Math.max(...amounts);
  } else {
    currentBid = "No bids";
  }
}
