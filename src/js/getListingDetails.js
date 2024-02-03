import { auth, username } from "./auth.js";
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const getUrl = `https://api.noroff.dev/api/v1/auction/listings/${id}?_seller=true&_bids=true`;

const detailListing = document.getElementById("detailListing");
const options = document.getElementById("options");
const myOptions = document.getElementById("myOptions");
const registerButton = document.getElementById("register");
const logInButton = document.getElementById("logIn");
const logOutButton = document.getElementById("logOut");
const navSell = document.getElementById("navSell");
const navProfile = document.getElementById("navProfile");
const notLogedIn = document.getElementById("notLogedIn");

function isLogedIn(detailData) {
  if (auth && username) {
    registerButton.style.display = "none";
    logInButton.style.display = "none";
    notLogedIn.style.display = "none";
    notLogedIn.classList.remove("d-flex");
    if (username === detailData.seller.name) {
      options.style.display = "none";
    } else {
      myOptions.style.display = "none";
      options.classList.add("d-flex");
    }
  } else {
    logOutButton.style.display = "none";
    options.style.display = "none";
    myOptions.style.display = "none";
    navSell.style.display = "none";
    navProfile.style.display = "none";
  }
}

/**
 * Get listing details with use of listing id.
 *
 *
 */

let detailData = [];

async function getListing() {
  try {
    const getListingOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        id: id,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(getUrl, getListingOptions);
    const result = await response.json();
    detailData = result;
    createDetailHtml(detailData);
    createBidList(detailData);
    isLogedIn(detailData);
  } catch (error) {
    detailListing.innerHTML = `Something went wrong, ${error}`;
  }
}

getListing();

/**
 * Creates HTML for detail page with data from get
 *
 *
 */
function createDetailHtml(data) {
  console.log(data);

  const { title, description, seller, media, endsAt, bids } = data;
  findCurrentBid(bids);
  const date = new Date(endsAt);
  const localDate = date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  let carouselIndicator = "";
  let carouselItem = "";
  if (media.length > 0) {
    for (let i = 0; i < media.length; i++) {
      const element = media[i];
      const n = i + 1;
      if (i === 0) {
        carouselIndicator += ` <button type="button" data-bs-target="#carouselDetail" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Image ${n}"></button>`;
        carouselItem += `<div class="carousel-item active">
      <img src="${element}" class="d-block detailsMedia" alt="Image ${n}"> 
    </div>`;
      } else {
        carouselIndicator += ` <button type="button" data-bs-target="#carouselDetail" data-bs-slide-to="${i}" aria-current="true" aria-label="Image ${n}"></button>`;
        carouselItem += `<div class="carousel-item">
      <img src="${element}" class="d-block detailsMedia" alt="Image ${n}"> 
    </div>`;
      }
    }
  } else {
    carouselItem = `<img src="src/img/placeholder.png" class="detailsMedia" alt="No image added placeholder">`;
  }
  detailListing.innerHTML = `
  <h1 class= "d-flex justify-content-center my-4">${title}</h1>
  <div class="row row-cols-lg-2 row-cols-md-1 row-cols-1 row-gap-5">
    <div id="carouselDetail" class="col carousel slide">
      <div class="carousel-indicators">
        ${carouselIndicator}
      </div>
      <div class="carousel-inner">
          ${carouselItem}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselDetail" data-bs-slide="prev">
        <span class="carousel-control-prev-icon p-2 bg-secondary" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselDetail" data-bs-slide="next">
        <span class="carousel-control-next-icon p-2 bg-secondary" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
    </div>
      <div class="col d-flex flex-column justify-content-between">
        <div>
          <h2>Information</h2>
          <p>
            ${description}
          </p>
        </div>
          <div>
            <p class="fw-bold">Seller: ${seller.name}</p>
            <p class="fw-bold">Ends at: ${localDate}</p>
            <p class="fw-bold">Current bid: <span class="text-danger">${currentBid}</span> </p>
          </div>
      </div>
  </div>
  `;
}

const bidList = document.getElementById("bidList");

function createBidList(data) {
  const { bids } = data;
  if (bids.length === 0) {
    bidList.innerHTML = "No bids";
  }
  bids.sort((a, b) => b.amount - a.amount);

  for (let i = 0; i < bids.length; i++) {
    const element = bids[i];
    const createdDate = new Date(element.created);
    const localDate = createdDate.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    bidList.innerHTML += `
    <tr>
      <td>${element.amount}</td>
      <td>${element.bidderName}</td>
      <td>${localDate}</td>
    </tr>
      `;
  }
}

const bidForm = document.getElementById("bidForm");
let bid = document.getElementById("bid");
const bidError = document.getElementById("bidError");

let currentBid = "";
let minBid = 0;
function findCurrentBid(bids) {
  if (bids.length !== 0) {
    const amounts = bids.map((a) => a.amount);
    currentBid = Math.max(...amounts);
    minBid = currentBid + 1;
    bid.value = minBid;
    bid.setAttribute("min", minBid);
  } else {
    currentBid = "No bids";
    bid.value = 1;
    minBid = 1;
    bid.setAttribute("min", minBid);
  }
}

const postUrl = `https://api.noroff.dev/api/v1/auction/listings/${id}/bids`;

async function postBid(event) {
  event.preventDefault();
  const bidAmount = parseInt(bid.value);
  const postBody = { amount: bidAmount };
  const postOptions = {
    method: "POST",
    body: JSON.stringify(postBody),
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(postUrl, postOptions);
    const json = await response.json();
    if (response.ok === true) {
      window.location.reload();
    } else {
      bidError.innerHTML = `${json.errors[0].message}`;
      setTimeout(function () {
        bidError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    bidError.innerHTML = `Something went wrong, ${error}`;
  }
}

bidForm.addEventListener("submit", postBid);

const editButton = document.getElementById("editButton");
console.log("Edit button", editButton);
editButton.addEventListener("click", () => {
  console.log(id);
  window.location = `update.html?id=${id}`;
});
