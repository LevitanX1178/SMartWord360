const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let latestLocation = {
    lat: null,
    lng: null,
    time: null
};

app.post("/location", (req, res) => {
    const { lat, lng } = req.body;

    latestLocation = {
        lat,
        lng,
        time: new Date().toLocaleTimeString()
    };

    console.log("Received location:", latestLocation);

    res.json({
        success: true,
        location: latestLocation
    });
});

app.get("/location", (req, res) => {
    res.json(latestLocation);
});

app.get("/", (req, res) => {
    res.send("SmartWard360 GPS Backend Running");
});

app.listen(5001, () => {
    console.log("Backend running on http://localhost:5001");
});