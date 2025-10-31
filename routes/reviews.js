const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

// Reviews
// Post Review route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewController.addReview)
);

// Delete  Review Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewController.deleteReview)
);

module.exports = router;
