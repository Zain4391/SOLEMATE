import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  UpdateProduct,
  DeleteProduct,
} from "../controller/productController.js";
import { checkProductId } from "../middleware/Products.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", createProduct);

productRouter.param("id", checkProductId); //All routes below this wont need to validate the product id

productRouter.get("/:id", getProductById);
productRouter.put("/:id", UpdateProduct);
productRouter.delete("/:id", DeleteProduct);

export default productRouter;
