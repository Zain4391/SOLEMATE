import { db } from "../DB/connect.js";
import { v4 as uuid } from "uuid";

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM Product");
    if (products.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found", Products: null, error: true });
    }
    res
      .status(200)
      .json({ message: null, Products: products.rows, error: false });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", Products: null, error: true });
  }
};

//get Product by ID
export const getProductById = async (req, res) => {
  res
    .status(200)
    .json({ message: "Product Found", Product: req.product, error: false });
};

//create a product
export const createProduct = async (req, res) => {
  try {
    const { pName, brand, price, stock } = req.body;
    if (!pName || !brand || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", id: null, error: true });
    }

    const pId = uuid(); //generate random ID
    const product = await db.query(
      "INSERT INTO Product (p_id,p_name,brand,price,stock) VALUES ($1,$2,$3,$4,$5) RETURNING p_id",
      [pId, pName, brand, price, stock]
    );
    res.status(201).json({
      message: "Product created successfully",
      id: product.rows[0].p_id,
      error: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error", id: null, error: true });

    console.log(error);
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { pName, brand, price, stock } = req.body; // No parentheses in req.body
    const { id } = req.params;

    // Check if the product exists
    const existingProduct = await db.query(
      "SELECT * FROM Product WHERE p_id = $1",
      [id]
    );

    const updatedName = pName || existingProduct.rows[0].p_name;
    const updatedBrand = brand || existingProduct.rows[0].brand;
    const updatedPrice = price || existingProduct.rows[0].price;
    const updatedStock = stock || existingProduct.rows[0].stock;

    // Update the product
    const updatedProduct = await db.query(
      "UPDATE Product SET p_name = $1, brand = $2, price = $3, stock = $4 WHERE p_id = $5 RETURNING *",
      [updatedName, updatedBrand, updatedPrice, updatedStock, id]
    );

    res.status(200).json({
      message: "Product updated successfully",
      Product: updatedProduct.rows[0],
      error: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", Product: null, error: true });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Product WHERE p_id = $1", [id]);
    res
      .status(200)
      .json({ message: "Product deleted successfully", error: false });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: true });
  }
};
