const {
  onCall,
  HttpsError,
  onRequest,
} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true }); // Enable CORS for all origins
const admin = require("firebase-admin");
const express = require("express");

const app = express();
app.use(cors);
admin.initializeApp();

// EXAMPLE OF ONCALL FUNCTION
exports.getLocation = onCall(async (data, context) => {
  const eircode = data.eircode;
  const mapsKey = functions.config().maps.api_key;
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${eircode}&key=${mapsKey}`,
    );
    const location = response.data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    throw new functions.https.HttpsError(
      "failed to fetch coordinates",
      error.message,
    );
  }
});
