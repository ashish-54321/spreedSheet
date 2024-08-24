const express = require("express");
const { google } = require("googleapis");
const cors = require("cors")
const app = express();
app.use(express.json())
app.use(cors());


app.post("/spreedsheet/contact", async (req, res) => {
  const { date, time, user, ip, system, browser, device, model, latitude, longitude, country, region, city, timezone, userAgent } = req.body;


  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines with actual newlines
      client_email: "ashishsheet@digital-vim-411607.iam.gserviceaccount.com",
    },
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1p9qI0q65DcAjpRDyCYltjeOTv7AZpEWRQ33wtPzj_9Q";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "LocationTrack!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[date, time, user, ip, system, browser, device, model, latitude, longitude, country, region, city, timezone, userAgent]],
    },
  });

  res.send("Details Save In Google Sheet Successfully");
});




app.listen(1337, (req, res) => console.log("running on 1337"));
