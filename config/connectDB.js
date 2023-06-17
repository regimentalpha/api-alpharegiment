import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.5dqbvgf.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: "alphaRegiment_db",
        w: "majority",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
      }
    );
    console.log(
      `Connected to Mongo Database ${conn.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`Error in MONGO DB ${error}`.bgRed.white);
    process.exit(1);
  }
};
