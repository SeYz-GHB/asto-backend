import dotenv from "dotenv";
dotenv.config();

import { faker } from "@faker-js/faker";
import db from "./models/index.js";

const seedUsers = async () => {
  try {
    console.log("🟢 Connecting to DB...");
    await db.sequelize.authenticate();
    console.log("✅ DB Connected!");

    const totalUsers = 1_000_000; // 🔹 Insert 1 million users
    const batchSize = 10_000; // 🔹 Increase batch size (optional)


    for (let batch = 0; batch < totalUsers / batchSize; batch++) {
  const users = [];

    for (let i = 0; i < batchSize; i++) {
      users.push({
        name: faker.person.fullName(),
        email: `user_${batch}_${i}_${Date.now()}@example.com`, // ✅ Unique email
        password: faker.internet.password({ length: 12 }),
        role: "customer",
        phone: faker.phone.number(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        created_at: faker.date.between({ from: "2023-01-01", to: new Date() }),
        last_login: faker.date.recent(),
        is_verified: faker.datatype.boolean(),
        reset_password_token: null,
        reset_password_expires_at: null,
        verification_token: null,
        verification_token_expires_at: null,
      });
    }

    await db.User.bulkCreate(users);
    console.log(`✅ Inserted batch ${batch + 1}`);
  }


    console.log("🎉 Finished inserting 100,000 customers!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers();
