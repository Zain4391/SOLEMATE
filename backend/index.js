import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorhandler from "errorhandler";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(errorhandler());

const PORT = process.env.PORT || 5000;

//test route
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

//all routes go here

//spin up dev server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
