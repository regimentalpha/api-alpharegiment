import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/connectDB.js";
import userRoues from "./routes/userRoutes.js";
import { defaultErros } from "./middlewares/error.js";

// configure dotenv file
dotenv.config({ path: "./config/.env" });

// rest object
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// ROUTES CONFIGURATION
app.get("/", (req, res) => {
  res.send(
    "<h1 style=text-align:center><a href=https://alpharegiment.com >Welcome to Alpha Regiment</a></h1>"
  );
});

app.use("/api/v1", userRoues); // USER ROUTES

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
