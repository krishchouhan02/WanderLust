require("dotenv").config();
const Listing = require("../models/listing.js");
const opencage = require("opencage-api-client");

// all Listings

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Add Listings Form

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Listing

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    res.redirect("/listings");
    return;
  }

  res.render("listings/show.ejs", { listing });
};

// create New Listings

module.exports.createListing = async (req, res, next) => {
  let response = await opencage.geocode({
    q: req.body.listing.location,
    key: process.env.GEO_API,
  });

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.results[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// Edit New Listings

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    res.redirect("/listings");
    return;
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_300");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update Listings

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated ");
  res.redirect(`/listings/${id}`);
};

// Delete Listing

module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
