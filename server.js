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
import courseRoutes from "./routes/courseRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import instaMojoRoutes from "./routes/instaMojoRoutes.js";
import { defaultErros } from "./middlewares/error.js";
import cloudinary from "cloudinary";
import Insta from "instamojo-nodejs";

// configure dotenv file
dotenv.config({ path: "./config/.env" });

// rest object
const app = express();

// middlewaress
app.use(
  cors({
    origin: "*",
    methods: "*",
    headers: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);

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

// INSTAMOJO VARIABLES
const MOJO_TEST_API_KEY = "test_c925be7e1b4384c0466fa23bd33";
const MOJO_TEST_AUTH_KEY = "test_777bacce8b2ee939476703fba9b";

Insta.setKeys(process.env.INSTAMOJO_API_KEY, process.env.INSTAMOJO_AUTH_KEY);
// Insta.setKeys(MOJO_TEST_API_KEY, MOJO_TEST_AUTH_KEY);
Insta.isSandboxMode(true);

// ROUTES CONFIGURATION
app.get("/", (req, res) => {
  res.send(
    "<h1 style=text-align:center><a href=https://alpharegiment.in >Welcome to Alpha Regiment</a></h1>"
  );
});

app.use("/api/v1", userRoutes); // USER ROUTES
app.use("/api/v1", courseRoutes); // COURSE ROUTES
app.use("/api/v1", affiliateRoutes); // AFFILIATE ROUTES
app.use("/api/v1", instaMojoRoutes); // INSTA MOJO ROUTES

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
