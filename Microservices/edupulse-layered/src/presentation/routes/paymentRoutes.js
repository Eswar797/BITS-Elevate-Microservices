const express = require('express');
const router = express.Router();
const paymentService = require('../../application/services/PaymentService');
const { authenticateToken } = require('../../infrastructure/security');

// Card management
router.post('/paymentMangement/save-card', authenticateToken, async (req, res) => {
  try {
    const { userId, cardDetails } = req.body;
    const result = await paymentService.saveCard(userId, cardDetails);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/paymentMangement/get-card', authenticateToken, async (req, res) => {
  try {
    const card = await paymentService.getCard(req.user.id);
    res.json({ data: card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/paymentMangement/update-card', authenticateToken, async (req, res) => {
  try {
    const { cardDetails } = req.body;
    const result = await paymentService.updateCard(req.user.id, cardDetails);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Transaction management
router.post('/paymentMangement/process', authenticateToken, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const result = await paymentService.processPayment(req.user.id, courseId, amount);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/paymentMangement/saveTansaction/cancel', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.body;
    const result = await paymentService.cancelTransaction(transactionId);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin routes
router.get('/paymentMangement/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all payment data' });
    }
    const payments = await paymentService.getAllPayments();
    res.json({ data: payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/paymentMangement/user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access to payment data' });
    }
    const payments = await paymentService.getUserPayments(req.params.userId);
    res.json({ data: payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 