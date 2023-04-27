import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://akkugunwal:akkugunwal@cluster0.3fb3wwd.mongodb.net/?retryWrites=true&w=majority", {
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
