import Mailgun from "mailgun-js";
import dotenv from "dotenv";

dotenv.config();

const MAILGUN_ENABLED = process.env.MAILGUN_ENABLED === 'true';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

console.log('Email service configuration:', {
    MAILGUN_ENABLED,
    MAILGUN_DOMAIN: MAILGUN_DOMAIN ? 'Set' : 'Not Set',
    MAILGUN_API_KEY: MAILGUN_API_KEY ? 'Set' : 'Not Set'
});

let mailgun;
if (MAILGUN_ENABLED) {
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
        console.error('Mailgun is enabled but API key or domain is missing');
        throw new Error('Mailgun configuration is incomplete');
    }
    mailgun = new Mailgun({
        apiKey: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN,
    });
}

const sendEmail = async (email, subject, text, html) => {
    try {
        if (!MAILGUN_ENABLED) {
            console.log('Email sending is disabled. Skipping email to:', email);
            return { 
                status: 'disabled',
                message: 'Email sending is disabled',
                email: email,
                subject: subject
            };
        }

        if (!mailgun) {
            throw new Error('Mailgun client not initialized');
        }

        const data = {
            from: "imeshworkspace@gmail.com",
            to: email,
            subject,
            text,
            html,
        };
        
        const result = await mailgun.messages().send(data);
        console.log('Email sent successfully:', result);
        return {
            status: 'success',
            message: 'Email sent successfully',
            email: email,
            subject: subject,
            result: result
        };
    }
    catch (error) {
        console.error("Email sending error:", error);
        return {
            status: 'error',
            message: error.message,
            email: email,
            subject: subject
        };
    }
}

export { sendEmail };