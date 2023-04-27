import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "arcaptor_db",
    });
    console.log(
      `Connected to Mongo Database ${conn.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`Error in MONGO DB ${error}`.bgRed.white);
    process.exit(1)
  }
};
