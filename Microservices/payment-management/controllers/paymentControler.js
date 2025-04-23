import {
  cancelPaymentTransaction,
  createPaymentIntent,
  deleteCard,
  getCard,
  saveCard,
  updateCardDetails,
} from "../services/stripeService.js";
import {
  findPaymentTransactionById,
  getAllPaymentTransactions,
  savePaymentTransaction,
  updatePaymentTransaction,
} from "../services/paymentTransactionService.js";

import express from "express";

const router = express.Router();

//create payment transaction
router.post("/saveTansaction", async (req, res) => {
  const { userId, amount, courseId } = req.body;
  const response = await createPaymentIntent(userId, amount, courseId);
  res.send(response);
});

// get all payment transactions
router.get("/all", async (req, res) => {
  const response = await getAllPaymentTransactions();
  res.send(response);
});

//find payment transaction by id
router.get("/saveTansaction/:id", async (req, res) => {
  const { id } = req.params;
  const response = await findPaymentTransactionById(id);
  res.send(response);
});

//update payment transaction by id
router.put("/saveTansaction/:id", async (req, res) => {
  const { id } = req.params;
  const transaction = req.body;
  const response = await updatePaymentTransaction(id, transaction);
  res.send(response);
});

//cancel payment transaction by id
router.delete("/saveTansaction/cancel", async (req, res) => {
  const { userId, transactionId } = req.body;
  const response = await cancelPaymentTransaction(userId, transactionId);
  res.send(response);
});

//save card details
router.post("/save-card", async (req, res) => {
  const card = req.body;
  const response = await saveCard(card);
  res.send(response);
});

//get card details
router.get("/get-card", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    const response = await getCard(userId);
    
    if (response.status === 'error') {
      if (response.code === 'CARD_NOT_FOUND') {
        return res.status(404).json(response);
      }
      return res.status(400).json(response);
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in get-card endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add dummy card for testing (no Stripe required)
router.post("/add-dummy-card", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    // Create mock card details
    const mockCustomerId = `cus_dummy_${Date.now()}`;
    const mockSourceId = `src_dummy_${Date.now()}`;
    
    const dbResponse = await saveCard({
      userId,
      token: {
        card: {
          number: "4242424242424242",
          exp_month: 12,
          exp_year: 2030,
          cvc: "123"
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Dummy card added successfully',
      data: dbResponse.data
    });
  } catch (error) {
    console.error('Error adding dummy card:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add dummy card',
      error: error.message
    });
  }
});

// Update card details
router.post("/update-card", async (req, res) => {
  const { userId, updatedCardDetails } = req.body;
  const response = await updateCardDetails(userId, updatedCardDetails);
  res.send(response);
});

//delete card details
router.delete("/delete-card", async (req, res) => {
  const { userId } = req.body;
  const response = await deleteCard(userId);
  res.send(response);
});

export default router;
