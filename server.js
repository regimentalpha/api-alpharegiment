import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import { defaultErros } from "./middlewares/error.js";
import cloudinary from "cloudinary";

// configure dotenv file
dotenv.config({ path: "./config/.env" });

// rest object
const app = express();

// middlewaress
app.use(
  cors({
    origin: [
      "https://www.senapariwar.com",
      "https://senapariwar.com",
      "http://localhost:3000",
      "http://www.localhost:3000",
      "https://alpharegiment.in",
      "https://www.alpharegiment.in",
    ],
    methods: "*",
    headers: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.json({ limit: "10000kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10000kb", extended: true }));

// CONFIGURE CLOUDINARY FOR UPLOADING IMAGES
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

// ROUTES CONFIGURATION
app.get("/", (req, res) => {
  res.send(
    "<h1 style=text-align:center><a href=https://alpharegiment.in >Welcome to Alpha Regiment</a></h1>"
  );
});

app.use("/api/v1", userRoutes); // USER ROUTES

// Middleware for error
app.use(defaultErros);

// PORT -- On Which backend run
const PORT = process.env.PORT || 8080;
// RUN APP LISTENER AND CONNECT DB FUNCTION
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.NODE_ENV} mode on PORT: ${PORT}`.bgCyan
        .white
    );
  });
});
