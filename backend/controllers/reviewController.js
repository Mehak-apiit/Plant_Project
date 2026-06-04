import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { product, vendor, rating, reviewText, images } = req.body;

    const user = req.user._id;

    // check already reviewed
    const alreadyReviewed = await Review.findOne({ product, user });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product,
      vendor,
      user,
      rating,
      reviewText,
      images
    });

    // UPDATE PRODUCT RATING
    await updateProductRating(product);

    res.status(201).json({
      success: true,
      review
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET REVIEWS OF PRODUCT
export const getProductReviewsAdvanced = async (req, res) => {
  try {
    const { page = 1, limit = 5, rating } = req.query;

    let filter = {
      product: req.params.productId,
      isApproved: true
    };

    if (rating) {
      filter.rating = Number(rating);
    }

    const reviews = await Review.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("user", "name");

    const total = await Review.countDocuments(filter);

    res.json({
      total,
      page,
      reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // only owner
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();

    //  UPDATE PRODUCT RATING AGAIN
    await updateProductRating(review.product);

    res.json({ message: "Review deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  CORE LOGIC (IMPORTANT)
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;

  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews || 0;

  await Product.findByIdAndUpdate(productId, {
    ratingsCount: numReviews,
    ratingsAverage: avgRating
  });
};
//UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {
    const { rating, reviewText, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // owner check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    review.images = images || review.images;

    await review.save();

    await updateProductRating(review.product);

    res.json({
      success: true,
      review
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN APPROVE OR REJECT REVIEW
export const toggleReviewApproval = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.json({
      message: `Review ${review.isApproved ? "approved" : "rejected"}`
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VENDOR REVIEWS
export const getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const reviews = await Review.find({ vendor: vendorId })
      .populate("product", "name")
      .populate("user", "name email");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};