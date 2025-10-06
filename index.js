import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

app._router.stack
  .filter(r => r.route)
  .map(r => r.route.path)

app.post("/backend/geosearch/querysearch", async (req, res) => {
    const { query } = req.body;
    try {
        const result = await axios.get("http://46.202.141.212:2322/api", {
            params: {
            q: query,
            limit: 5,
            bbox: "74.81,8.24,77.21,12.82"
            }
        })
        res.json(result.data)
    } catch(error) {
        console.error(error);
    }
})

app.post("/backend/geosearch/reverse-search", async (req, res) => {
    const { latitude, longitude } = req.body;
    let dataName;
    let dataCity;
    let dataCounty;
    let dataDistrict;
    let dataPostcode;
    try {
    const result = await axios.get("http://46.202.141.212:2322/reverse", {
        params: {
            lat: latitude,
            lon: longitude
        }
    })
    if(!result.data || !result.data.features || result.data.features.length === 0) return  res.json("No result found");
    if(result.data.features[0].properties.state !== "Kerala") return res.json("Selected a place outside Kerala");
    result.data.features[0].properties.name === undefined ? dataName = " " : dataName = result.data.features[0].properties.name + ", "; 
    result.data.features[0].properties.city === undefined ? dataCity = " " : dataCity = result.data.features[0].properties.city + ", ";
    result.data.features[0].properties.county === undefined ? dataCounty = " " : dataCounty = result.data.features[0].properties.county + ", ";
    result.data.features[0].properties.district === undefined ? dataDistrict = " " : dataDistrict =  result.data.features[0].properties.district  + ", ";
    result.data.features[0].properties.postcode === undefined ? dataPostcode = " " : dataPostcode =  " - " + result.data.features[0].properties.postcode;

    res.json(
        dataName + dataDistrict + dataCity + dataCounty + dataPostcode
    );
    } catch(error) {
        console.log(error)
    }
})

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(4000, () => {
    console.log("express is running");
})