import { auth, username } from "./auth.js";
const getUrl = `https://api.noroff.dev/api/v1/auction/profiles/${username}?_listings=true`;

const profilePage = document.getElementById("profilePage");
const userListings = document.getElementById("userListings");

/**
 * Get auction profile from API.
 *
 *
 *
 * @throws {error} if fails
 *
 */

let listingsData = [];
async function getProfile() {
  try {
    const getProfileOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(getUrl, getProfileOptions);
    const result = await response.json();
    console.log(result);
    const { name, email, avatar, credits, listings } = result;
    listingsData = listings;
    console.log(listingsData);
    const profileAvatar = avatar || "";
    profilePage.innerHTML += `
    <div class="row row-cols-2 row-gap-5">
      <div class="d-flex justify-content-end">
      <img
        src="${profileAvatar}"
        class="rounded-0 col avatar"
        alt="profile picture"
      />
      </div>
      <div class="col">
        <h2>${name}</h2>
        <p>Email: ${email}</p>
        <p>
        Credits: ${credits}
        </p> 
      </div>   
    </div>
`;
    writeLoggedInUserListings(listingsData);
  } catch (error) {
    profilePage.innerHTML += `Something went wrong, ${error}`;
  }
}

getProfile();

function writeLoggedInUserListings(listings) {
  length = listings.length;
  userListings.innerHTML = "";
  for (let i = 0; i < length; i++) {
    if (listings[i] === undefined) {
      return;
    }
    const { id, title, description, media } = listings[i];
    const itemMedia = media || "";
    const itemDescription = description || "";
    userListings.innerHTML += `
    <div class="col py-2">
    <a href="detail.html?id=${id}" class="text-decoration-none text-reset">
        <div class="card p-3 rounded-0">
          <img
            src="${itemMedia[0]}"
            class="card-img-top card-img rounded-0 media"
            alt=""
          />
          <h3 class="card-title">${title}</h3>
          <p class="card-text">
          ${itemDescription}
          </p>
        </div>
      </a>
    </div>
      `;
  }
}
