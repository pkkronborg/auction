import { auth } from "./auth.js";
const postUrl = `https://api.noroff.dev/api/v1/auction/listings/${id}/bids`;

const bidForm = document.getElementById("bidForm");
const bid = document.getElementById("bid");
const bidError = document.getElementById("bidError");

async function postBid(event) {
  event.preventDefault();
  const postBody = { amount: bid };
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
      console.log(response);
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
