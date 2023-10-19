const Url = require("./model.js");
// const save = (longURL, shortURL, shortUrlId) => {
//     Url.create({ longURL : longURL, shortURL, shortUrlId: shortUrlId })

// const find = (shortUrlId) => {
//     Url.findOne({ shortUrlId: shortUrlId }
//     );

//     console.log(shortUrlId)
// };

const save = (longURL, shortURL, shortUrlId, clicks) => {
  Url.create({ longURL, shortURL, shortUrlId, clicks });
};

const find = async (shortUrlId) => {
  try {
    const url = await Url.findOne({ shortUrlId: shortUrlId });
    if (url) {
      url.clicks+=1;
      await url.save();
      console.log("2");
    }
    return url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findAll = async () => {
  try {
    const url = await Url.find({});
    return url;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  save,
  find,findAll
};
