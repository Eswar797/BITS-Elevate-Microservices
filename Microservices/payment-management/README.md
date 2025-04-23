# EduPulse Payment Service

This service handles payment processing for the EduPulse platform. It has been configured to work in a testing mode by default, which does not require actual payment processing.

## Dummy Payment System

The payment service is configured to run in test mode, which means:

1. No actual payment processing is performed
2. Authentication is bypassed for easier testing
3. Mock payment cards can be added without requiring real payment details
4. Transactions will be recorded in the database for testing purposes

## How to Use the Dummy Payment System

1. When a user visits the payment page, they will be prompted to add a dummy card if they don't have a payment method
2. Clicking the "Add Dummy Card for Testing" button will create a mock Visa card with last4 digits "4242"
3. The user can then complete the checkout process without any actual payment being processed
4. Course enrollment will work as expected after the mock payment

## Environment Configuration

The `.env` file already has the test mode enabled with:

```
PAYMENT_BYPASS=true
PAYMENT_BYPASS_AMOUNT=100
```

## API Endpoints

- `POST /api/paymentMangement/add-dummy-card` - Adds a dummy payment card for the specified user
- `GET /api/paymentMangement/get-card` - Retrieves card details for a user
- `POST /api/paymentMangement/saveTansaction` - Processes a payment transaction (mock in test mode)

## Switching to Production Mode

To enable real payment processing with Stripe, update the `.env` file:

```
PAYMENT_BYPASS=false
```

Make sure to provide a valid Stripe secret key in the `.env` file as well. 