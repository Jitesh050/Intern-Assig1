const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Jitesh005:Jitesh%40234@cluster0.ueni8wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // Choose DB
    const db = client.db("testDB");  

    // Choose collection
    const users = db.collection("users");

    // Insert some sample data
    const result = await users.insertMany([
      { name: "xyz" },
      { name: "abc" },
      { name: "Lakshmi" },
      { name: "Jitesh" }
    ]);

    console.log("Inserted documents:", result.insertedCount);

    // Fetch them back
    const allUsers = await users.find().toArray();
    console.log("Users in DB:", allUsers);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
