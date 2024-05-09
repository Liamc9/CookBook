const cors = require("cors")({origin: true}); // Enable CORS for all origins
const admin = require("firebase-admin");
const express = require("express");

const app = express();
app.use(cors);
admin.initializeApp();

