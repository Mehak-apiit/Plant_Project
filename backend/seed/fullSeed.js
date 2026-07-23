import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

// MODELS inline to avoid import issues
const userSchema = new mongoose.Schema({ name:String, email:{type:String,unique:true,lowercase:true}, password:{type:String,select:false}, role:{type:String,default:"Customer"}, isEmailVerified:{type:Boolean,default:true} }, { timestamps:true });
userSchema.pre("save", async function(){ if(!this.isModified("password")) return; this.password = await bcrypt.hash(this.password,10); });
const User = mongoose.model("User", userSchema);

const categorySchema = new mongoose.Schema({ name:{type:String,required:true,unique:true}, slug:{type:String,required:true,unique:true}, image:{type:String,default:""}, description:{type:String,default:""}, isActive:{type:Boolean,default:true} }, { timestamps:true });
const Category = mongoose.model("Category", categorySchema);

const subCategorySchema = new mongoose.Schema({ name:{type:String,required:true}, slug:{type:String,required:true,unique:true}, category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true}, description:{type:String,default:""}, isActive:{type:Boolean,default:true} }, { timestamps:true });
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

const vendorSchema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true}, shopName:{type:String,required:true,unique:true}, shopSlug:{type:String,required:true,unique:true}, shopDescription:{type:String,default:""}, status:{type:String,default:"approved"}, balance:{type:Number,default:0} }, { timestamps:true });
const Vendor = mongoose.model("Vendor", vendorSchema);

const productImageSchema = new mongoose.Schema({ url:{type:String,required:true}, publicId:{type:String,default:""}, isPrimary:{type:Boolean,default:false} }, { _id:false });
const productSchema = new mongoose.Schema({ name:{type:String,required:true}, slug:{type:String,required:true,unique:true}, description:{type:String,required:true}, shortDescription:{type:String,default:""}, category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true}, subCategory:{type:mongoose.Schema.Types.ObjectId,ref:"SubCategory",required:true}, vendor:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor",required:true}, images:[productImageSchema], price:{type:Number,required:true}, discountPrice:{type:Number,default:0}, stock:{type:Number,default:50}, sku:{type:String,required:true,unique:true}, plantType:{type:String,default:""}, sunlightRequirement:{type:String,default:""}, wateringRequirement:{type:String,default:""}, isFeatured:{type:Boolean,default:false}, isFlashSale:{type:Boolean,default:false}, isPremium:{type:Boolean,default:false}, status:{type:String,default:"active"}, isActive:{type:Boolean,default:true}, isDeleted:{type:Boolean,default:false}, ratingsAverage:{type:Number,default:0}, ratingsCount:{type:Number,default:0} }, { timestamps:true });
const Product = mongoose.model("Product", productSchema);

const bannerSchema = new mongoose.Schema({ title:{type:String,required:true}, description:{type:String,default:""}, image:{type:String,default:""}, link:{type:String,default:""}, isActive:{type:Boolean,default:true} }, { timestamps:true });
const Banner = mongoose.model("Banner", bannerSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear everything
  await User.deleteMany({});
  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  await Vendor.deleteMany({});
  await Product.deleteMany({});
  await Banner.deleteMany({});
  console.log("Cleared old data");

  // --- ADMIN USER ---
  const admin = await User.create({ name:"Admin", email:"admin@plantshop.com", password:"admin123", role:"Admin", isEmailVerified:true });
  console.log("Admin created");

  // --- VENDOR USER ---
  const vendorUser = await User.create({ name:"Green Valley Nursery", email:"vendor@plantshop.com", password:"vendor123", role:"Vendor", isEmailVerified:true });
  const vendor = await Vendor.create({ user:vendorUser._id, shopName:"Green Valley Nursery", shopSlug:"green-valley-nursery", shopDescription:"Premium plants from the heart of nature", status:"approved", balance:15000 });
  console.log("Vendor created");

  // --- CATEGORIES ---
  const cats = await Category.insertMany([
    { name:"Indoor Plants", slug:"indoor-plants", image:"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop", description:"Perfect for your home and office" },
    { name:"Outdoor Plants", slug:"outdoor-plants", image:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", description:"Beautiful gardens start here" },
    { name:"Succulents", slug:"succulents", image:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&h=200&fit=crop", description:"Low maintenance, high beauty" },
    { name:"Flowering Plants", slug:"flowering-plants", image:"https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&h=200&fit=crop", description:"Add colors to your life" },
    { name:"Air Purifying", slug:"air-purifying", image:"https://images.unsplash.com/photo-1545241047-6083a3684587?w=200&h=200&fit=crop", description:"Breathe fresh, live healthy" },
    { name:"Cacti", slug:"cacti", image:"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop", description:"Desert beauty for your desk" },
  ]);
  console.log("Categories created");

  // --- SUB CATEGORIES ---
  const subCats = await SubCategory.insertMany([
    { name:"Ficus", slug:"ficus", category:cats[0]._id, description:"Popular indoor trees" },
    { name:"Pothos", slug:"pothos", category:cats[0]._id, description:"Trailing indoor plants" },
    { name:"Ferns", slug:"ferns", category:cats[0]._id, description:"Lush green ferns" },
    { name:"Palms", slug:"palms", category:cats[1]._id, description:"Tropical outdoor palms" },
    { name:"Flowering Shrubs", slug:"flowering-shrubs", category:cats[1]._id, description:"Beautiful outdoor shrubs" },
    { name:"Echeveria", slug:"echeveria", category:cats[2]._id, description:"Rosette succulents" },
    { name:"Cactus", slug:"cactus", category:cats[2]._id, description:"Spiky desert plants" },
    { name:"Roses", slug:"roses", category:cats[3]._id, description:"Classic flowering plants" },
    { name:"Orchids", slug:"orchids", category:cats[3]._id, description:"Exotic orchids" },
    { name:"Snake Plants", slug:"snake-plants", category:cats[4]._id, description:"Best air purifiers" },
    { name:"Peace Lily", slug:"peace-lily", category:cats[4]._id, description:"Elegant air purifiers" },
    { name:"Desert Cacti", slug:"desert-cacti", category:cats[5]._id, description:"Authentic desert cacti" },
  ]);
  console.log("Subcategories created");

  // Helper to get subcategory by name
  const sub = (name) => subCats.find(s => s.name === name)._id;

  // --- PRODUCTS (24 unique plants with unique Unsplash images) ---
  const products = [
    {
      name:"Monstera Deliciosa", slug:"monstera-deliciosa", description:"The Swiss Cheese Plant is a stunning tropical with unique split leaves. Perfect for bright indirect light, it grows vigorously and adds a tropical feel to any room.", shortDescription:"Iconic split-leaf tropical plant",
      category:cats[0]._id, subCategory:sub("Pothos"), vendor:vendor._id, price:899, discountPrice:699, stock:45, sku:"IND-001", isFeatured:true,
      images:[{url:"https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Tropical",sunlightRequirement:"Indirect bright",wateringRequirement:"Weekly",ratingsAverage:4.8,ratingsCount:124
    },
    {
      name:"Fiddle Leaf Fig", slug:"fiddle-leaf-fig", description:"A statement piece for any room with its large, violin-shaped leaves. Prefers bright, filtered light and consistent watering.", shortDescription:"Statement indoor tree with large leaves",
      category:cats[0]._id, subCategory:sub("Ficus"), vendor:vendor._id, price:1299, discountPrice:999, stock:30, sku:"IND-002", isFeatured:true,
      images:[{url:"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Tree",sunlightRequirement:"Bright indirect",wateringRequirement:"Every 10 days",ratingsAverage:4.6,ratingsCount:89
    },
    {
      name:"Golden Pothos", slug:"golden-pothos", description:"One of the easiest houseplants to grow. Trailing vines with golden-green variegated leaves. Great for shelves and hanging baskets.", shortDescription:"Easy-care trailing vine",
      category:cats[0]._id, subCategory:sub("Pothos"), vendor:vendor._id, price:299, discountPrice:249, stock:100, sku:"IND-003", isFeatured:true, isFlashSale:true,
      images:[{url:"https://images.unsplash.com/photo-1572688484438-313a56e6dc34?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Vine",sunlightRequirement:"Low to bright",wateringRequirement:"When dry",ratingsAverage:4.9,ratingsCount:210
    },
    {
      name:"Boston Fern", slug:"boston-fern", description:"Lush, feathery fronds that add a vintage charm. Excellent natural air purifier that thrives in humid environments.", shortDescription:"Lush feathery air purifier",
      category:cats[0]._id, subCategory:sub("Ferns"), vendor:vendor._id, price:449, stock:60, sku:"IND-004",
      images:[{url:"https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Fern",sunlightRequirement:"Indirect light",wateringRequirement:"Keep moist",ratingsAverage:4.5,ratingsCount:67
    },
    {
      name:"Snake Plant", slug:"snake-plant", description:"NASA recommends it for air purification. Tall, sword-like leaves are nearly indestructible. Perfect for beginners.", shortDescription:"Indestructible air purifier",
      category:cats[4]._id, subCategory:sub("Snake Plants"), vendor:vendor._id, price:399, discountPrice:349, stock:80, sku:"AIR-001", isFeatured:true,
      images:[{url:"https://images.unsplash.com/photo-1593482892540-2c64ad8c1e11?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Any light",wateringRequirement:"Every 2-3 weeks",ratingsAverage:4.9,ratingsCount:312
    },
    {
      name:"Peace Lily", slug:"peace-lily", description:"Elegant white blooms with glossy green leaves. One of the best air-purifying plants. Flowers in low light conditions.", shortDescription:"Elegant white blooming air purifier",
      category:cats[4]._id, subCategory:sub("Peace Lily"), vendor:vendor._id, price:499, discountPrice:399, stock:55, sku:"AIR-002",
      images:[{url:"https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Herbaceous",sunlightRequirement:"Low to medium",wateringRequirement:"Weekly",ratingsAverage:4.7,ratingsCount:178
    },
    {
      name:"Areca Palm", slug:"areca-palm", description:"A graceful palm with feathery fronds that creates a tropical paradise indoors. Excellent humidifier and air purifier.", shortDescription:"Graceful tropical indoor palm",
      category:cats[0]._id, subCategory:sub("Palms"), vendor:vendor._id, price:799, stock:40, sku:"IND-005",
      images:[{url:"https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=400&fit=crop",isPrimary:true}],
      plantType:"Palm",sunlightRequirement:"Bright indirect",wateringRequirement:"Weekly",ratingsAverage:4.6,ratingsCount:95
    },
    {
      name:"Jade Plant", slug:"jade-plant", description:"A symbol of good luck and prosperity. Thick, oval leaves on woody stems. Easy to care for and long-lived.", shortDescription:"Lucky money plant",
      category:cats[2]._id, subCategory:sub("Echeveria"), vendor:vendor._id, price:349, stock:70, sku:"SUC-001",
      images:[{url:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Bright direct",wateringRequirement:"Every 2 weeks",ratingsAverage:4.8,ratingsCount:156
    },
    {
      name:"Echeveria Lola", slug:"echeveria-lola", description:"A stunning rosette succulent with pale lavender-grey leaves edged in pink. Compact and perfect for windowsills.", shortDescription:"Lavender rosette succulent",
      category:cats[2]._id, subCategory:sub("Echeveria"), vendor:vendor._id, price:249, discountPrice:199, stock:90, sku:"SUC-002", isFlashSale:true,
      images:[{url:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=500&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Full sun",wateringRequirement:"When dry",ratingsAverage:4.7,ratingsCount:88
    },
    {
      name:"Barrel Cactus", slug:"barrel-cactus", description:"A classic desert plant with beautiful ribbed structure. Produces vibrant yellow flowers in summer. Extremely drought tolerant.", shortDescription:"Classic desert beauty",
      category:cats[5]._id, subCategory:sub("Desert Cacti"), vendor:vendor._id, price:599, stock:35, sku:"CAC-001",
      images:[{url:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Cactus",sunlightRequirement:"Full sun",wateringRequirement:"Monthly",ratingsAverage:4.5,ratingsCount:42
    },
    {
      name:"Prickly Pear Cactus", slug:"prickly-pear", description:"Flat paddle-shaped pads with colorful fruits. Iconic desert plant that can grow indoors or outdoors in warm climates.", shortDescription:"Iconic flat-pad cactus",
      category:cats[5]._id, subCategory:sub("Desert Cacti"), vendor:vendor._id, price:449, stock:40, sku:"CAC-002",
      images:[{url:"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=600&fit=crop",isPrimary:true}],
      plantType:"Cactus",sunlightRequirement:"Full sun",wateringRequirement:"Monthly",ratingsAverage:4.3,ratingsCount:31
    },
    {
      name:"Red Rose Bush", slug:"red-rose-bush", description:"Classic red roses that bloom prolifically throughout the season. Fragrant and perfect for garden borders or containers.", shortDescription:"Fragrant red blooming roses",
      category:cats[3]._id, subCategory:sub("Roses"), vendor:vendor._id, price:699, discountPrice:599, stock:25, sku:"FLW-001",
      images:[{url:"https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Shrub",sunlightRequirement:"Full sun",wateringRequirement:"Daily",ratingsAverage:4.8,ratingsCount:203
    },
    {
      name:"Purple Orchid", slug:"purple-orchid", description:"Exotic Phalaenopsis orchid with cascading purple blooms. Lasts for months with proper care. Elegant gift plant.", shortDescription:"Exotic cascading orchid",
      category:cats[3]._id, subCategory:sub("Orchids"), vendor:vendor._id, price:899, discountPrice:749, stock:20, sku:"FLW-002", isPremium:true,
      images:[{url:"https://images.unsplash.com/photo-1566907098335-779e93e852ad?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Epiphyte",sunlightRequirement:"Indirect light",wateringRequirement:"Ice cube method",ratingsAverage:4.9,ratingsCount:167
    },
    {
      name:"Bird of Paradise", slug:"bird-of-paradise", description:"Dramatic banana-like leaves that create an instant tropical jungle. Large statement plant for spacious rooms.", shortDescription:"Dramatic tropical statement plant",
      category:cats[0]._id, subCategory:sub("Palms"), vendor:vendor._id, price:1499, discountPrice:1199, stock:15, sku:"IND-006", isFeatured:true,
      images:[{url:"https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=500&fit=crop",isPrimary:true}],
      plantType:"Tropical",sunlightRequirement:"Bright direct",wateringRequirement:"Weekly",ratingsAverage:4.7,ratingsCount:76
    },
    {
      name:"Rubber Plant", slug:"rubber-plant", description:"Thick, glossy burgundy leaves on a sturdy trunk. Low-maintenance statement plant that cleans indoor air effectively.", shortDescription:"Glossy burgundy air purifier",
      category:cats[0]._id, subCategory:sub("Ficus"), vendor:vendor._id, price:649, stock:45, sku:"IND-007",
      images:[{url:"https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Tree",sunlightRequirement:"Bright indirect",wateringRequirement:"Every 10 days",ratingsAverage:4.6,ratingsCount:89
    },
    {
      name:"Lucky Bamboo", slug:"lucky-bamboo", description:"Symbol of fortune and prosperity. Grows in water or soil. Elegant spiraled stalks add zen vibes to any space.", shortDescription:"Zen fortune plant",
      category:cats[0]._id, subCategory:sub("Pothos"), vendor:vendor._id, price:199, stock:120, sku:"IND-008", isFlashSale:true,
      images:[{url:"https://images.unsplash.com/photo-1585056845133-e0e7e8afcc61?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Grass",sunlightRequirement:"Low indirect",wateringRequirement:"Keep in water",ratingsAverage:4.4,ratingsCount:198
    },
    {
      name:"Aloe Vera", slug:"aloe-vera", description:"Medicinal succulent with soothing gel inside its leaves. Easy to grow and incredibly useful for skin care and first aid.", shortDescription:"Medicinal healing plant",
      category:cats[2]._id, subCategory:sub("Echeveria"), vendor:vendor._id, price:279, stock:85, sku:"SUC-003",
      images:[{url:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=450&h=500&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Bright direct",wateringRequirement:"Every 3 weeks",ratingsAverage:4.8,ratingsCount:245
    },
    {
      name:"Money Plant", slug:"money-plant", description:"Heart-shaped leaves on cascading vines. Believed to bring good luck and prosperity. Thrives in water or soil.", shortDescription:"Good luck trailing vine",
      category:cats[0]._id, subCategory:sub("Pothos"), vendor:vendor._id, price:179, discountPrice:149, stock:150, sku:"IND-009", isFlashSale:true,
      images:[{url:"https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Vine",sunlightRequirement:"Low to bright",wateringRequirement:"Weekly",ratingsAverage:4.7,ratingsCount:320
    },
    {
      name:"Spider Plant", slug:"spider-plant", description:"Arching green and white striped leaves with baby plantlets. Fun, pet-friendly, and excellent at purifying indoor air.", shortDescription:"Fun pet-friendly air purifier",
      category:cats[4]._id, subCategory:sub("Snake Plants"), vendor:vendor._id, price:299, stock:75, sku:"AIR-003",
      images:[{url:"https://images.unsplash.com/photo-1572688484438-313a56e6dc34?w=500&h=600&fit=crop",isPrimary:true}],
      plantType:"Herbaceous",sunlightRequirement:"Indirect light",wateringRequirement:"Weekly",ratingsAverage:4.8,ratingsCount:189
    },
    {
      name:"Calathea Orbifolia", slug:"calathea-orbifolia", description:"Stunning round leaves with silver-green stripes. Moves leaves up at night. A true showstopper for plant collectors.", shortDescription:"Striped leaf showstopper",
      category:cats[0]._id, subCategory:sub("Ferns"), vendor:vendor._id, price:799, discountPrice:649, stock:20, sku:"IND-010", isPremium:true,
      images:[{url:"https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=500&h=550&fit=crop",isPrimary:true}],
      plantType:"Tropical",sunlightRequirement:"Low indirect",wateringRequirement:"Distilled water",ratingsAverage:4.5,ratingsCount:56
    },
    {
      name:"Haworthia", slug:"haworthia", description:"Tiny zebra-striped succulent perfect for desks and windowsills. Slow-growing and extremely easy to care for.", shortDescription:"Tiny striped desk succulent",
      category:cats[2]._id, subCategory:sub("Echeveria"), vendor:vendor._id, price:179, stock:100, sku:"SUC-004",
      images:[{url:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=450&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Bright indirect",wateringRequirement:"Every 2 weeks",ratingsAverage:4.6,ratingsCount:134
    },
    {
      name:"Bougainvillea", slug:"bougainvillea", description:"Vibrant magenta bracts that create a spectacular display. Fast-growing climber perfect for fences and trellises.", shortDescription:"Vibrant climbing showpiece",
      category:cats[1]._id, subCategory:sub("Flowering Shrubs"), vendor:vendor._id, price:549, stock:30, sku:"OUT-001",
      images:[{url:"https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500&h=450&fit=crop",isPrimary:true}],
      plantType:"Climber",sunlightRequirement:"Full sun",wateringRequirement:"Moderate",ratingsAverage:4.7,ratingsCount:72
    },
    {
      name:"Croton", slug:"croton", description:"Fiery mix of red, orange, yellow and green leaves. Adds a tropical splash of color to any indoor space.", shortDescription:"Colorful tropical foliage",
      category:cats[0]._id, subCategory:sub("Ficus"), vendor:vendor._id, price:399, stock:40, sku:"IND-011",
      images:[{url:"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=480&h=500&fit=crop",isPrimary:true}],
      plantType:"Shrub",sunlightRequirement:"Bright direct",wateringRequirement:"When top inch dry",ratingsAverage:4.4,ratingsCount:48
    },
    {
      name:"ZZ Plant", slug:"zz-plant", description:"Waxy, dark green leaves on graceful arching stems. Nearly indestructible and tolerates deep shade and neglect.", shortDescription:"Waxy indestructible plant",
      category:cats[4]._id, subCategory:sub("Snake Plants"), vendor:vendor._id, price:499, discountPrice:399, stock:65, sku:"AIR-004",
      images:[{url:"https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?w=500&h=500&fit=crop",isPrimary:true}],
      plantType:"Rhizome",sunlightRequirement:"Low to bright",wateringRequirement:"Every 2 weeks",ratingsAverage:4.8,ratingsCount:167
    },
    {
      name:"String of Pearls", slug:"string-of-pearls", description:"Cascading beads that create a living curtain. Unique trailing succulent that looks magical in hanging planters.", shortDescription:"Magical trailing bead plant",
      category:cats[2]._id, subCategory:sub("Echeveria"), vendor:vendor._id, price:349, stock:25, sku:"SUC-005", isPremium:true,
      images:[{url:"https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=450&h=600&fit=crop",isPrimary:true}],
      plantType:"Succulent",sunlightRequirement:"Bright indirect",wateringRequirement:"When dry",ratingsAverage:4.9,ratingsCount:92
    },
  ];

  await Product.insertMany(products);
  console.log(`${products.length} products created`);

  // --- BANNERS ---
  await Banner.insertMany([
    { title:"Summer Plant Sale", description:"Up to 40% off on all indoor plants. Limited time offer!", image:"", link:"/products", isActive:true },
    { title:"New Arrivals", description:"Check out our latest collection of rare tropical plants", image:"", link:"/products", isActive:true },
  ]);
  console.log("Banners created");

  console.log("\n✅ SEED COMPLETE!");
  console.log("Admin login: admin@plantshop.com / admin123");
  console.log("Vendor login: vendor@plantshop.com / vendor123");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
