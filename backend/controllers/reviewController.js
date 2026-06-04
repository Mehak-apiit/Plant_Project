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
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).populate("user", "name");

    res.json(reviews);

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