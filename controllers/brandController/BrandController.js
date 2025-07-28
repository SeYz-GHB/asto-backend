
import db from '../../models/index.js'
//create brand
export const createBrands = async (req,res) => {
    try{
        const {name} = req.body;
        const image = req.file;
        const existingBrand = await db.Brand.findOne({
            where : {name},
        })
        if(existingBrand) return res.status(200).json({message : "brand already exist!"});

        const insertBrand = await db.Brand.create({
            name,
            image_url : image?.path,
        })
        return res.status(201).json({
            success : true,
            message : "Brand created successfully.",
            brand : insertBrand,
        });
        
        
        
    }
    catch(error){
        console.error("there is an error : " , error.message);
        res.status(500).json({success : false, message : error.message})
    }
}

//get all brands
export const getBrands = async (req,res) => {
    try {
        const brands = await db.Brand.findAll();
        res.status(200).json({success : true, brands : brands});
    }
    catch(error){
        console.error("there are an error", error.message);
        res.status(500).json({success : false, message : error.message})
    }

}

// delete brands
export const deleteBrands = async(req,res) => {

    try {
        const {id} = req.params;
        const deleteBrands =await db.Brand.destroy({
            where : {id}
        });
        if (deleteBrands === 0) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }
        
        res.status(200).json({ success: true, message: "Brand deleted successfully" });

    }
     catch(error){
        console.error("there are an error", error.message);
        res.status(500).json({success : false, message : error.message})
    }
}

// get brans by category
export const getBrandsByCategory = async (req, res) => {
  const { slug } = req.params;
  const category = slug;

  try {
    const productsInCategory = await db.Product.findAll({
      where: { category },
      attributes: ['brand_id'],
      raw: true
    });

    // Extract unique brand IDs
    const brandIds = [...new Set(productsInCategory.map(product => product.brand_id))];

    if (brandIds.length === 0) {
      return res.status(200).json({ success: true, brands: [] });
    }

    // Get brands with those IDs
    const brands = await db.Brand.findAll({
      where: {
        id: brandIds
      },
      attributes: ['id', 'name', 'image_url']
    });

    res.status(200).json({ success: true, brands });
  } catch (error) {
    console.error("Error fetching brands by category:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};