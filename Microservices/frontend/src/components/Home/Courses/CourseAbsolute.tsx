import { Box, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CourseAbsolute = (props: { onOpen: () => void; price: number; img: string; _id: string; name: string }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { onOpen, price, img, _id, name } = props;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
 
  console.log("userdd", user?.id);

  // Check if user is already enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setCheckingEnrollment(false);
        return;
      }
      
      try {
        const response = await axios.get(
          `http://localhost:7071/api/courseManagement/enrolledCourses/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data && response.data.data) {
          // Check if this course is in the enrolled courses
          const enrolled = response.data.data.some(
            (course: any) => course._id === _id
          );
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setCheckingEnrollment(false);
      }
    };
    
    checkEnrollment();
  }, [user, _id]);

  // Handle payment flow
  function handlePayment(e: React.MouseEvent) {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login page with return URL
      navigate('/sign-in', { state: { from: `/course/${_id}` } });
      return;
    }
    
    // If user is logged in, navigate to payment page
    console.log("Navigating to payment page:", `/payment/${_id}/${price}/${user.id}`);
    navigate(`/payment/${_id}/${price}/${user.id}`);
  }

  // Handle direct enrollment (skipping payment for testing)
  async function handleDirectEnroll(e: React.MouseEvent) {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login page with return URL
      navigate('/sign-in', { state: { from: `/course/${_id}` } });
      return;
    }
    
    // Simple console logging for debugging
    console.log("Enrolling user:", user?.id);
    console.log("In course:", _id);
    console.log("With token:", localStorage.getItem("token"));
    
    try {
      // Create a mock transaction ID for testing
      const mockTransactionId = "test-" + Date.now();
      
      // Create form data object for clarity
      const enrollmentData = {
        courseId: _id,
        userId: user.id,
        transactionId: mockTransactionId
      };
      
      console.log("Sending enrollment data:", enrollmentData);
      
      // Call the enroll API endpoint
      const response = await axios.post(
        "http://localhost:7071/api/courseManagement/enroll",
        enrollmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      console.log("Enrollment response:", response.data);
      
      // Show success message
      toast.success("Successfully enrolled in course!");
      
      // Force reload enrollment status
      setIsEnrolled(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate(`/student-dashboard/${user.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course. Try again later.");
    }
  }
  
  // Navigate to already enrolled course
  function goToCourse() {
    navigate(`/my-course/${user?.id}/${_id}`);
  }

  return (
    <div className=" min-h-screen xl:border text-white bg-[#ffffff] xl:text-black xl:border-white  xl:shadow-2xl shadow-neutral-800  md:min-w-[300px] ">
      <div>
        <div>
          <Image src={img} />
        </div>
        <div className="flex justify-around font-semibold text-sm h-[48px] items-center ">
          <div className={`cursor-pointer text-center w-full border-b-[1px]`}>
            Personal
          </div>

        </div>
      </div>
      <div className="px-[24px]">
        <div>
          <h3 className="font-serif font-bold max-w-[250px] py-1 ">
            Subscribe to Edu Pulsde's top courses
          </h3>
          <p className="text-[12px]">
            Get this course, plus 8,000+ of our top-rated courses with Personal
            Plan{" "}
            <a href="http://" className="underline text-blue-800 font-bold">
              Learn more
            </a>
          </p>
          <div className="bg-blue-50 text-center  w-full py-[4px] font-semibold my-2" onClick={handlePayment}>
            Start Learn
          </div>
          <div className="w-full justify-center items-center flex flex-col space-y-[8px]">
            <p className="text-[9px]">Starting at ₹750 per month</p>
            <p className="text-[9px]"> Cancel anytime</p>
          </div>
          <div className="flex justify-center items-center ">
            <div className="h-[1px] bg-slate-200 w-full"></div>
            <p className="text-[10px] mx-1 my-3">or</p>
            <div className="h-[1px] bg-slate-200 w-full"></div>
          </div>
        </div>

        <div className="flex space-x-2 text-lg place-items-baseline">
          <p className="font-bold ">RS.{price}</p>
          <p className="line-through  ">RS.</p>
          <p className="text-xs">0 off</p>
        </div>
        <div className="flex text-red-600 items-baseline space-x-1 my-2">
          <p className="text-xs font-bold">52 minutes </p>
          <p className="text-xs">left at this price!</p>
        </div>
        <Box>
          <Text>{ }</Text>
        </Box>
        
        {checkingEnrollment ? (
          <div className="border-2 w-full text-center py-[7px] bg-gray-400 text-white text-sm font-bold mb-2">
            Checking enrollment status...
          </div>
        ) : isEnrolled ? (
          <div className="border-2 w-full text-center py-[7px] bg-green-500 hover:bg-green-600 text-white text-sm font-bold mb-2">
            <button 
              onClick={goToCourse}
              className="w-full h-full"
            >
              Go to Course
            </button>
          </div>
        ) : (
          <>
            {/* Buy This Course button */}
            <div className="border-2 w-full text-center py-[7px] bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold mb-2">
              <button 
                onClick={handlePayment}
                className="w-full h-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Buy this course
              </button>
            </div>
            
            {/* Direct enrollment button for testing */}
            <div className="border-2 w-full text-center py-[7px] bg-green-500 hover:bg-green-600 text-white text-sm font-bold">
              <button 
                onClick={handleDirectEnroll}
                className="w-full h-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enroll Now (Free)
              </button>
            </div>
          </>
        )}

        <div className="items-center text-[10px] space-y-1 w-full justify-center flex flex-col py-2">

          <p>Full Lifetime Access</p>
        </div>

        <div className="underline flex text-[11px] font-bold justify-around underline-offset-2 pb-7">
          <div>
            <Link to=''>share</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseAbsolute;
