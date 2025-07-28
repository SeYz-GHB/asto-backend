import db from '../../models/index.js';

// GET /api/products/category/:slug
export const getProductsByCategory = async (req, res) => {
  const { slug } = req.params;
  try {
    const products = await db.Product.findAll({
      where: { category: slug }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
};

// GET /api/products/:id 
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

export const getPaginatedProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await db.Product.findAndCountAll({
      limit,
      offset,
      order: [['create_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      products: rows,
    });
  } catch (err) {
    console.error("🔥 Pagination error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching paginated products",
    });
  }
};
// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      order: [['create_at', 'ASC']]
    });
    res.json({ products }); // 👈 must return key: products
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// ✅ GET /api/products/brand/:brand_id

export const getProductsByBrand = async (req, res) => {
  const { slug } = req.params;

  // Find brand by slug
  const brand = await db.Brand.findOne({ where: { slug } });
  if (!brand) return res.status(404).json({ message: "Brand not found" });

  // Use brand.id (brand_id) to find products
  const products = await db.Product.findAll({
    where: { brand_id: brand.id },
  });

  res.json({ success: true, products });
};

export const getProductsByBrandAndCategory = async (req, res) => {
  // Get from URL parameters, not query
  const { slug, brandName } = req.params;

  try {
    // First, find the brand by name to get its ID
    const brand = await db.Brand.findOne({
      where: { name: brandName }
    });

    if (!brand) {
      return res.status(404).json({ 
        success: false, 
        message: "Brand not found" 
      });
    }

    // Build where clause - adjust these field names based on your actual schema
    const whereClause = {
      // Assuming you have a category field that matches the slug
      category: slug,
      // Assuming brand_id is the foreign key in your products table
      brand_id: brand.id
    };

    const products = await db.Product.findAll({
      where: whereClause,
      include: [
        {
          model: db.Brand,
          attributes: ['id', 'name', 'image_url']
        }
      ],
      order: [['create_at', 'DESC']], // Note: fixed typo from 'create_at'
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id, {
      include: [
        { model: db.MouseModel, as: "MouseModel" },
        { model: db.KeyboardModel, as: "KeyboardModel" },
        { model: db.HeadphoneModel, as: "HeadphoneModel" },
        { model: db.MonitorModel, as: "MonitorModel" },
        { model: db.MousepadModel, as: "MousepadModel" },
        { model: db.Brand, as: "Brand" }, // ✅ Include brand with correct alias
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product detail:", err);
    res.status(500).json({ error: err.message });
  }
};
