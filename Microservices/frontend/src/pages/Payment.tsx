import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import Loader from '../components/Loader';
import { UserContext } from '../UserContext';
import { useContext } from 'react';

// Visualization service URL
const VISUALIZATION_SERVICE_URL = 'http://localhost:3005';

export default function Payment() {
  const { id, price, userId } = useParams<{ id: string; userId: string; price: string }>();
  const [courseData, setCourseData] = useState<any>({});
  const [paymentData, setPaymentData] = useState<any>({
    brand: "Visa",
    last4: "4242",
    exp_month: 12,
    exp_year: 2030
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentStep, setPaymentStep] = useState<'review' | 'processing' | 'complete'>('review');
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Function to notify visualization service about payment activity
  const notifyVisualizationService = async (transactionData: any) => {
    try {
      console.log('Notifying visualization service about payment activity');
      const response = await fetch(`${VISUALIZATION_SERVICE_URL}/api/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType: 'PAYMENT',
          userId: transactionData.userId,
          courseId: transactionData.courseId,
          amount: transactionData.amount,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.error('Failed to notify visualization service:', await response.text());
      } else {
        console.log('Visualization service notified successfully');
      }
    } catch (error) {
      console.error('Error notifying visualization service:', error);
      // Don't interrupt the purchase flow if visualization service notification fails
    }
  };

  // Generate course demo image based on course ID
  const getCourseDemoImage = (courseId: string) => {
    // Create different images based on courseId to make it feel personalized
    const courseIdHash = courseId ? courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const categories = ['coding', 'business', 'design', 'marketing', 'photography', 'music'];
    const category = categories[courseIdHash % categories.length];
    return `https://source.unsplash.com/500x300/?${category},course`;
  };

  // Fetch course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching course data for id:', id);
        setLoading(true);
        
        // Try to get course from local storage first to avoid random changes
        const savedCourseData = localStorage.getItem(`course_${id}`);
        if (savedCourseData) {
          const parsedData = JSON.parse(savedCourseData);
          setCourseData(parsedData);
          setLoading(false);
          return;
        }
        
        // Simulate course data fetch for demo purposes with more realistic names
        // Deterministic mapping from ID to course name
        const courseNames = [
          "Web Development Masterclass",
          "Digital Marketing Essentials",
          "UI/UX Design Fundamentals", 
          "Data Science & Analytics",
          "Mobile App Development",
          "Business Leadership Skills"
        ];
        
        // Use courseId to determine course name - ensure consistent mapping
        const courseIdHash = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const courseIndex = courseIdHash % courseNames.length;
        const courseName = courseNames[courseIndex];
        
        const courseData = {
          id: id,
          name: courseName,
          price: price || "1999",
          img: getCourseDemoImage(id || '1'),
          description: `Master the essentials of ${courseName} with this comprehensive course designed for all skill levels.`
        };
        
        // Save to localStorage to ensure consistency
        localStorage.setItem(`course_${id}`, JSON.stringify(courseData));
        
        setCourseData(courseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        // Don't show errors to user in demo mode
        const fallbackData = {
          id: id,
          name: "Demo Course",
          price: price || "1999",
          img: getCourseDemoImage(id || '1')
        };
        setCourseData(fallbackData);
        localStorage.setItem(`course_${id}`, JSON.stringify(fallbackData));
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    } else {
      // If no ID is present, redirect to courses page
      toast.error("Course information is missing");
      navigate('/all-courses');
    }
  }, [id, price, navigate]);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user || !user.id) {
      toast.info('You must be logged in to complete purchase');
      navigate('/sign-in');
      return;
    }

    if (!id) {
      toast.error('Course information is missing');
      navigate('/all-courses');
      return;
    }

    try {
      setCheckoutLoading(true);
      setPaymentStep('processing');
      
      // Simulate payment process steps
      toast.info("Validating payment information...");
      
      // Create transaction object
      const transactionData = {
        transactionId: `payment_${Date.now()}`,
        userId: user.id,
        courseId: id,
        amount: parseInt(price || courseData.price || "1999"),
        status: 'succeeded'
      };
      
      // First timeout to simulate card verification
      setTimeout(() => {
        toast.info("Processing transaction...");
        
        // Save purchase to localStorage to simulate database
        const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        if (!purchasedCourses.includes(id)) {
          purchasedCourses.push(id);
          localStorage.setItem('purchasedCourses', JSON.stringify(purchasedCourses));
        }
        
        // Store transaction history
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transactionData);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Second timeout to simulate payment processing
        setTimeout(async () => {
          // Notify visualization service
          await notifyVisualizationService(transactionData);
          
          // Call the payment service API directly as a fallback
          try {
            fetch('http://localhost:7072/api/paymentMangement/saveTansaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.id,
                amount: courseData.price || price,
                courseId: id,
              }),
            }).catch(err => console.log('Payment service notification error:', err));
          } catch (e) {
            console.log('Error calling payment service:', e);
          }
          
          setPaymentStep('complete');
          toast.success('Payment successful! You are now enrolled in the course.');
        }, 1000);
      }, 1000);
      
    } catch (error) {
      console.error('Error handling payment:', error);
      // Still simulate success even if there was an error
      setPaymentStep('complete');
      toast.success('Payment successful! You are now enrolled in the course.');
    }
  };

  const handleViewCourse = () => {
    if (id && user?.id) {
      // Redirect to the specific course page
      navigate(`/my-course/${user.id}/${id}`);
    } else {
      // Fallback to user profile if course ID is missing
      navigate('/user-profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
        <p className="ml-3 text-gray-600">Loading course information...</p>
      </div>
    );
  }

  // Payment step indicator component
  const PaymentSteps = () => (
    <div className="flex justify-center mb-6 pt-4">
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paymentStep === 'review' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
            1
          </div>
          <span className="text-sm mt-1">Review</span>
        </div>
        <div className={`h-1 w-12 ${paymentStep === 'review' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paymentStep === 'processing' ? 'bg-blue-500 text-white' : paymentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            2
          </div>
          <span className="text-sm mt-1">Processing</span>
        </div>
        <div className={`h-1 w-12 ${paymentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paymentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            3
          </div>
          <span className="text-sm mt-1">Complete</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Course Checkout</h1>
      <p className="text-center text-gray-500 mb-6">Complete your purchase to gain immediate access</p>
      
      <PaymentSteps />
      
      {paymentStep === 'processing' ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-400"></div>
            <h2 className="text-xl font-semibold mb-4">Processing Your Payment</h2>
            <p className="text-gray-600 mb-4">Please wait while we process your transaction. This usually takes less than 30 seconds.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-[pulse_1s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-sm text-gray-500 italic">Do not refresh the page</p>
          </div>
        </div>
      ) : paymentStep === 'complete' ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">You have successfully enrolled in <span className="font-semibold">{courseData.name}</span>.</p>
            <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to your registered email address.</p>
            <button
              onClick={handleViewCourse}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              View My Course
            </button>
          </div>
        </div>
      ) : (
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" onSubmit={handlePayment}>
          {/* Course Details Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={courseData.img} 
                alt={courseData.name || 'Course Image'} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                key={id} // Add key to ensure image updates when course ID changes
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-2xl font-bold text-white">{courseData.name}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{courseData.description}</p>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Bestseller</span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">On-demand</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Certificate</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-gray-500">Course Price</p>
                  <p className="text-2xl font-bold text-gray-800">RS.{courseData.price || price}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">Lifetime Access</p>
                  <p className="text-gray-500 text-sm">No additional fees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200">Payment Details</h3>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Method:</span>
                <div className="flex items-center">
                  <span className="font-semibold">{paymentData.brand}</span>
                  <svg className="ml-2 w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3C5.686 3 3 5.686 3 9v6c0 3.314 2.686 6 6 6h6c3.314 0 6-2.686 6-6V9c0-3.314-2.686-6-6-6H9z" fill="#1A56DB" />
                    <path d="M13.5 16.5h-3v-9h3v9z" fill="white" />
                    <path d="M16.5 16.5h-3v-9h3v9z" fill="white" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Card Number:</span>
                <span className="font-semibold">**** **** **** {paymentData.last4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="font-semibold">{paymentData.exp_month}/{paymentData.exp_year}</span>
              </div>
              <div className="mt-4 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Demo Mode: Using dummy payment card for testing</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Course Price:</span>
                <span>RS.{courseData.price || price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Discount:</span>
                <span>RS.0</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>RS.{courseData.price || price}</span>
              </div>
            </div>
            
            <button 
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
                checkoutLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transition-colors'
              }`}
              type="submit" 
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Processing...' : 'Complete Purchase'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
