const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");

router.use((req, res, next) => {
  next();
});

// Index route & Create Route

router
  .route("/")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    asyncWrap(listingController.createListing)
  );

// New route

router.get("/new", isLoggedIn, listingController.newForm);

// Search route

router.get(
  "/search",
  asyncWrap(async (req, res) => {
    const query = req.query.q;
    let allListings;

    if (query) {
      allListings = await Listing.find({
        $or: [
          { location: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, query });
  })
);

// Filter route

router.get("/filter", async (req, res) => {
  const { category } = req.query;
  let allListings = [];

  if (category) {
    allListings = await Listing.find({ category });
  }

  res.render("listings/index.ejs", { allListings, query: category });
});

// Show Route & Update Route & Delete Route

router
  .route("/:id")
  .get(asyncWrap(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.deleteListing));

// Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.editListing)
);

module.exports = router;
