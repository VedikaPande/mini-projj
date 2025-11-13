const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();


const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "mindsupport";
const COLLECTION_NAME = "patients";

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Clearing old collection data...");
    await collection.deleteMany({});

    // Load CSV
    const csvPath = path.join(__dirname, "hospital_dataset_mental_health.csv");

    console.log("Reading CSV:", csvPath);

    const records = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          records.push({
            _id: row.Patient_ID,
            patient_name: row.Patient_Name,
            age: Number(row.Age),
            gender: row.Gender,
            diagnosis: row.Diagnosis,
            admission_date: row.Admission_Date,
            discharge_date: row.Discharge_Date,
            treatment_type: row.Treatment_Type,
            medication: row.Medication,
            session_count: Number(row.Session_Count),
            severity_level: row.Severity_Level,
            outcome: row.Outcome,
            doctor_description: row.Doctor_Description,
            doctor_statement: row.Doctor_Statement
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`Total Records Loaded: ${records.length}`);

    // Insert into MongoDB
    console.log("Inserting into database...");
    await collection.insertMany(records);

    console.log("SEED COMPLETE! 200 Patients added to MongoDB.");
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

seedDatabase();
