import db from "../../models/index.js";

const {
  Product,
  Brand,
  MouseModel,
  KeyboardModel,
  HeadphoneModel,
  MonitorModel,
  MousepadModel,
  sequelize,
} = db;

export const uploadSingleProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required!",
      });
    }

    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;
    const { button: category } = req.body; // ✅ Rename `button` to `category` for clarity

    const {
      name,
      brand,
      price,
      stock,
      description = '',
      // Keyboard
      layout,
      switch_type,
      keyboard_color,
      keyboard_rgb,
      keyboard_connection,
      keycap_material,
      keyboard_battery,
      keyboard_weight_grams,
      others_features,
      // Mouse
      dpi,
      mouse_rgb,
      mouse_connection,
      mouse_battery,
      mouse_weight_grams,
      mouse_color,
      mouse_other_features,
      // Monitor
      screen_size,
      resolution,
      refresh_rate,
      panel_type,
      monitor_connection,
      monitor_color,
      monitor_weight,
      // Mousepad
      size,
      material,
      thickness_mm,
      mousepad_color,
      // Headphone
      frequency_respone,
      mic,
      headphone_connection,
      surround_sound,
      headphone_battery,
      headphone_weight_grams,
      headphone_color,
      headphone_other_features,
    } = req.body;

    if (!name || !brand || !price || !stock || !category) {
      return res.status(400).json({
        message: "name, brand, price, stock, category (button) are required",
      });
    }

    const product = await sequelize.transaction(async (trx) => {
      const [brandRow] = await Brand.findOrCreate({
        where: { name: brand.trim() },
        transaction: trx,
      });

      const exists = await Product.findOne({
        where: { name: name.trim(), brand_id: brandRow.id },
        transaction: trx,
      });

      if (exists) throw new Error("Product already exists for this brand");

      const newProduct = await Product.create(
        {
          name: name.trim(),
          brand_id: brandRow.id,
          price: Number(price),
          stock: Number(stock),
          description,
          image_url: imageUrl,
          image_public_id: imagePublicId,
          category, // ✅ ← This fixes the Sequelize error
        },
        { transaction: trx }
      );

      if (category === "keyboard") {
        await KeyboardModel.create(
          {
            product_id: newProduct.id,
            layout,
            switch_type,
            keyboard_rgb: keyboard_rgb?.toLowerCase() === "yes" ? 1 : 0,
            keyboard_connection,
            keyboard_color,
            keycap_material,
            keyboard_battery,
            keyboard_weight_grams,
            others_features,
          },
          { transaction: trx }
        );
      } else if (category === "mouse") {
        await MouseModel.create(
          {
            product_id: newProduct.id,
            dpi: dpi ? Number(dpi) : null,
            mouse_rgb: mouse_rgb?.toLowerCase() === "yes" ? 1 : 0,

            mouse_connection,
            mouse_battery,
            mouse_weight_grams: mouse_weight_grams
              ? Number(mouse_weight_grams)
              : null,
            mouse_color,
            mouse_other_features,
          },
          { transaction: trx }
        );
      } else if (category === "monitor") {
        await MonitorModel.create(
          {
            product_id: newProduct.id,
            screen_size,
            resolution,
            refresh_rate,
            panel_type,
            monitor_connection,
            monitor_color,
            monitor_weight,
          },
          { transaction: trx }
        );
      } else if (category === "mousepad") {
        await MousepadModel.create(
          {
            product_id: newProduct.id,
            size,
            material,
            thickness_mm,
            mousepad_color,
          },
          { transaction: trx }
        );
      } else {
        await HeadphoneModel.create(
          {
            product_id: newProduct.id,
            frequency_response: frequency_respone,
            mic: mic?.toLowerCase() === "yes",
            headphone_connection,
            surround_sound:
              surround_sound?.toLowerCase() === "yes" ? 1 : 0,
            headphone_battery,
            headphone_weight_grams,
            headphone_color,
            headphone_other_features,
          },
          { transaction: trx }
        );
      }

      return newProduct;
    });

    return res.status(201).json({
      message: "Product created successfully ✅",
      product,
    });
  } catch (err) {
    console.log("Upload error", err);
    return res.status(400).json({
      message: err.message || "Server error",
    });
  }
};
