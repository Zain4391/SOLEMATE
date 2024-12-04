import { db } from "../DB/connect.js";
import { v4 as uuid } from "uuid";

// Create a payment
export const createPayment = async (req, res) => {
  const { orderId } = req.params;
  const { paymentAmount, paymentMethod } = req.body;

  if (!paymentAmount || !paymentMethod) {
    return res.status(400).json({
      message: "Payment amount and method are required.",
      error: true,
    });
  }

  try {
    const paymentId = uuid();
    const paymentDate = new Date().toISOString();

    // Check if the order exists and is not already completed
    const orderCheck = await db.query(
      `SELECT * FROM "Order" WHERE o_id = $1 AND is_complete = FALSE`,
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found or already completed.",
        error: true,
      });
    }

    // Insert payment details
    const result = await db.query(
      `INSERT INTO payment (payment_id, payment_amount, payment_date, payment_method, order_o_id, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [paymentId, paymentAmount, paymentDate, paymentMethod, orderId, "PENDING"]
    );

    return res.status(201).json({
      message: "Payment created successfully.",
      error: false,
      Payment: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({
      message: "Error creating payment.",
      error: true,
    });
  }
};

// Update payment status and complete the order
export const updatePaymentStatus = async (req, res) => {
  const { orderId, paymentId } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({
      message: "Payment status is required.",
      error: true,
    });
  }

  try {
    await db.query("BEGIN");

    // Update the payment status
    const paymentResult = await db.query(
      `UPDATE payment
       SET status = $1
       WHERE payment_id = $2
       RETURNING *`,
      [paymentStatus, paymentId]
    );

    if (paymentResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({
        message: "Payment not found.",
        error: true,
      });
    }

    const payment = paymentResult.rows[0];

    // If payment is completed, mark the associated order as completed
    if (paymentStatus === "COMPLETED") {
      const orderResult = await db.query(
        `UPDATE "Order"
         SET is_complete = TRUE
         WHERE o_id = $1
         RETURNING *`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        await db.query("ROLLBACK");
        return res.status(404).json({
          message: "Order not found.",
          error: true,
        });
      }
    }

    await db.query("COMMIT");

    return res.status(200).json({
      message: "Payment status updated successfully.",
      error: false,
      Payment: paymentResult.rows[0],
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      message: "Error updating payment status.",
      error: true,
    });
  }
};

// Get all payments for a specific order
export const getAllPayments = async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM payment WHERE order_o_id = $1`,
      [orderId]
    );

    return res.status(200).json({
      message: "Payments fetched successfully.",
      error: false,
      Payments: result.rows,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({
      message: "Error fetching payments.",
      error: true,
    });
  }
};

// Get a specific payment by ID
export const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM payment WHERE payment_id = $1`,
      [paymentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found.",
        error: true,
        Payment: null,
      });
    }

    return res.status(200).json({
      message: "Payment fetched successfully.",
      error: false,
      Payment: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({
      message: "Error fetching payment.",
      error: true,
    });
  }
};
