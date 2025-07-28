import path from "path";
import csvParser from "csv-parser";
import db from "../../models/index.js";
import { cloudinary } from "../../config/cloudinary.js";
import { Readable } from "stream";

const { Product, Brand, KeyboardModel, MouseModel, MonitorModel, HeadphoneModel, MousePadModel, sequelize } = db;

export const uploadBulkProducts = async (req, res) => {
  const csvFile = req.files.csv?.[0];
  const imageFiles = req.files.images || [];

  if (!csvFile || imageFiles.length === 0) {
    return res.status(400).json({ error: "CSV and images required" });
  }

  // ✅ Convert CSV buffer to rows
  const rows = [];
  await new Promise((resolve, reject) => {
    Readable.from(csvFile.buffer) // ✅ read from buffer
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  const successes = [];
  const failures = [];

  await sequelize.transaction(async (trx) => {
    for (const row of rows) {
      try {
        const imageFileName = row.image_name?.trim();

        // ✅ Find matching file by originalname
        const file = imageFiles.find((f) => f.originalname.trim() === imageFileName);
        if (!file) throw new Error(`Image not found: ${imageFileName}`);

        // ✅ Upload buffer to Cloudinary
        const secure_url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products", transformation: [{ width: 500, height: 500, crop: "limit" }] },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer); // ✅ upload directly from memory
        });

        // ✅ Brand
        const [brandRow] = await Brand.findOrCreate({
          where: { name: row.brand.trim() },
          transaction: trx,
        });

        // ✅ Product
        const product = await Product.create(
          {
            name: row.name.trim(),
            brand_id: brandRow.id,
            category: row.category.trim(),
            price: Number(row.price),
            stock: Number(row.stock),
            description: row.description || "",
            image_url: secure_url,
            image_public_id: path.basename(secure_url || ""),
          },
          { transaction: trx }
        );

        // ✅ Category-Specific Models
        switch ((row.category || "").toLowerCase()) {
          case "keyboard":
            await KeyboardModel.create(
              {
                product_id: product.id,
                layout: row.layout,
                switch_type: row.switch_type,
                keyboard_rgb: (row.keyboard_rgb || "").toLowerCase() === "yes" ? 1 : 0,
                keyboard_connection: row.keyboard_connection,
                keyboard_color: row.keyboard_color,
                keycap_material: row.keycap_material,
                keyboard_battery: row.keyboard_battery,
                keyboard_weight_grams: row.keyboard_weight_grams,
                others_features: row.others_features,
              },
              { transaction: trx }
            );
            break;

          case "mouse":
            await MouseModel.create(
              {
                product_id: product.id,
                dpi: row.dpi,
                mouse_rgb: (row.mouse_rgb || "").toLowerCase() === "yes" ? 1 : 0,
                mouse_connection: row.mouse_connection,
                mouse_battery: row.mouse_battery,
                mouse_weight_grams: row.mouse_weight_grams,
                mouse_color: row.mouse_color,
                mouse_other_features: row.mouse_other_features,
              },
              { transaction: trx }
            );
            break;

          case "monitor":
            await MonitorModel.create(
              {
                product_id: product.id,
                screen_size: row.screen_size,
                resolution: row.resolution,
                refresh_rate: row.refresh_rate,
                panel_type: row.panel_type,
                monitor_connection: row.monitor_connection,
                monitor_color: row.monitor_color,
                monitor_weight: row.monitor_weight,
              },
              { transaction: trx }
            );
            break;

          case "headphone":
            await HeadphoneModel.create(
              {
                product_id: product.id,
                frequency_response: row.frequency_response,
                mic: (row.mic || "").toLowerCase() === "yes",
                headphone_connection: row.headphone_connection,
                surround_sound: (row.surround_sound || "").toLowerCase() === "yes" ? 1 : 0,
                headphone_battery: row.headphone_battery,
                headphone_weight_grams: row.headphone_weight_grams,
                headphone_color: row.headphone_color,
                headphone_other_features: row.headphone_other_features,
              },
              { transaction: trx }
            );
            break;

          case "mousepad":
            await MousePadModel.create(
              {
                product_id: product.id,
                size: row.size,
                material: row.material,
                thickness_mm: row.thickness_mm,
                mousepad_color: row.mousepad_color,
              },
              { transaction: trx }
            );
            break;
        }

        successes.push(row.name);
      } catch (err) {
        console.error(`🔥 Failed for ${row.name}:`, err.message);
        failures.push({ row, error: err.message });
      }
    }
  });

  res.json({
    uploaded: successes.length,
    failed: failures.length,
    successes,
    failures,
  });
};
