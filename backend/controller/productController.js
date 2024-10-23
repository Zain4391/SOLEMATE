import { db } from "../DB/connect.js";

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM Product");
    if (products.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found", Products: null, error: true });
    }
    res.status(200).json({ message: null, Products: products, error: false });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", Products: null, error: true });
  }
};

//create a product
export const createProduct = async (req, res) => {
  try {
    const { pId, pName, brand, price, stock } = req.body();
    if (!pId || !pName || !brand || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", id: null, error: true });
    }
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
  }
};
