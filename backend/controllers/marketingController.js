import { Banner, FlashSale, NewsletterSubscriber } from "../models/marketingModel.js";


//  1. CREATE BANNER (ADMIN)
export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  2. GET ACTIVE BANNERS (PUBLIC)
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  3. UPDATE BANNER (ADMIN)
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    Object.assign(banner, req.body);
    await banner.save();

    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 4. DELETE BANNER (ADMIN)
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.deleteOne();
    res.json({ message: "Banner removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// FLASH SALE CONTROLLERS

//  5. CREATE FLASH SALE (ADMIN)
export const createFlashSale = async (req, res) => {
  try {
    const sale = await FlashSale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  6. GET ACTIVE FLASH SALES (PUBLIC)
export const getActiveFlashSales = async (req, res) => {
  try {
    const now = new Date();

    const sales = await FlashSale.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate("products");

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  7. UPDATE FLASH SALE (ADMIN)
export const updateFlashSale = async (req, res) => {
  try {
    const sale = await FlashSale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Flash sale not found" });
    }

    Object.assign(sale, req.body);
    await sale.save();

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  8. DELETE FLASH SALE (ADMIN)
export const deleteFlashSale = async (req, res) => {
  try {
    const sale = await FlashSale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Flash sale not found" });
    }

    await sale.deleteOne();
    res.json({ message: "Flash sale removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  NEWSLETTER CONTROLLERS

// 9. SUBSCRIBE (PUBLIC)
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await NewsletterSubscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const subscriber = await NewsletterSubscriber.create({ email });

    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 10. GET ALL SUBSCRIBERS (ADMIN)
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 11. UNSUBSCRIBE
export const unsubscribe = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.json({ message: "Unsubscribed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};