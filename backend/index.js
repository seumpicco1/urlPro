const express = require('express');
const mongoose = require('mongoose');
const service = require('./service');
const app = express();
const PORT = 3000 
const host = "https://urlbackend-x12i.onrender.com"
const urlDb = require("./dbUrl");
const bodyParser = require("body-parser"); //use to parse incoming request bodies
const cors = require('cors');
mongoose.connect('mongodb+srv://mdb305041:mdb305-mongodb@cluster0.th2hpog.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const corsOptions = {
  origin: 'https://urlshrotenersynerry.onrender.com',
  optionsSuccessStatus: 200
}

app.use((req, res, next) => {   res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');  
 next(); });
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://urlshrotenersynerry.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/shorten', async (req, res) => {

  const urlKey = service.generateUrlKey();
  const shortUrl = `${host}/${urlKey}`
  //   console.log(shortUrl);
  console.log(req.body.longURL);
  urlDb.save(req.body.longURL, shortUrl, urlKey, urlDb.clicks);
  res.json(shortUrl);
});

app.get("/all", async (req, res) => {
  // console.log(req.params);
  console.log(req.body);
  try {


    const url = await urlDb.findAll({});
    console.log(url.longURL);
    // console.log(req.params);

    return res.status(200).json(url)
  } catch (error) {
    return res.status(500).send("Cannot get")
  }
});

app.delete("/:shortUrlId", async (req, res) => {
  try {
    const shortUrlId = req.params.shortUrlId;
    const deletedUrl = await urlDb.deleteUrl(shortUrlId); 
    
    if (!deletedUrl) {
      return res.status(404).send("URL not found");
    }

 
    return res.status(200).json({ message: "URL deleted successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error. Please try again.");
  }
});


app.get("/:shortUrlId", async (req, res) => {
  // console.log(req.params);
  try {
    console.log("1");
    const url = await urlDb.find(req.params.shortUrlId);
    console.log(url.longURL);
    // console.log(req.params);
        console.log("3");
    return !url ? res.status(404).send("Not found") : res.redirect(301, url.longURL)
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error. Please try again.")
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
