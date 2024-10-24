import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorhandler from "errorhandler";
import { db } from "./DB/connect.js";
import productRouter from "./routes/productRoutes.js";
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(errorhandler());

const PORT = process.env.PORT || 5000;

//all routes go here
app.use("/api/products", productRouter);

//spin up dev server
app.listen(PORT, () => {
  db.connect((err) => {
    if (err) {
      console.error(err);
    }
    console.log("Connected to SOLEMATE");
  });
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  db.end((err) => {
    if (err) {
      console.error("Error during disconnection", err.stack);
    } else {
      console.log("Disconnected from the database");
    }
    process.exit(0);
  });
});
