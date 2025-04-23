const { stripe, mailgun } = require('../../infrastructure/external-services');
const Course = require('../../domain/models/Course');
const User = require('../../domain/models/User');

class PaymentService {
  async createPaymentIntent(courseId, userId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        courseId: course._id.toString(),
        userId: user._id.toString()
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount
    };
  }

  async confirmPayment(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    const { courseId, userId } = paymentIntent.metadata;
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    // Enroll student in course
    course.studentsEnrolled.push(userId);
    await course.save();

    user.enrolledCourses.push(courseId);
    await user.save();

    // Send confirmation email
    await this.sendEnrollmentConfirmationEmail(user, course);

    return {
      success: true,
      course: course,
      user: user
    };
  }

  async sendEnrollmentConfirmationEmail(user, course) {
    if (!process.env.MAILGUN_ENABLED) {
      console.log('Email sending is disabled');
      return;
    }

    try {
      await mailgun.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `EduPulse <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: user.email,
        subject: 'Course Enrollment Confirmation',
        text: `Dear ${user.firstName},\n\nYou have successfully enrolled in the course "${course.title}".\n\nThank you for choosing EduPulse!`,
        html: `
          <h1>Course Enrollment Confirmation</h1>
          <p>Dear ${user.firstName},</p>
          <p>You have successfully enrolled in the course <strong>${course.title}</strong>.</p>
          <p>Thank you for choosing EduPulse!</p>
        `
      });
    } catch (error) {
      console.error('Failed to send enrollment confirmation email:', error);
    }
  }
}

module.exports = new PaymentService(); 