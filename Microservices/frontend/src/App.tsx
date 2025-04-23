import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from './UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AllCourses from './pages/StudentDashboard/AllCourses';
import CourseData from './pages/CourseData';
import CoursePage from './components/Home/Courses/CoursePage';
import CreatorDashboard from './pages/Creator/CreatorDashboard';
import Footer from './components/Footer/Footer';
import HeaderPrimary from './components/Header/HeaderPrimary';
import Home from './pages/Home';
import MyCourse from './pages/MyCourse';
import Payment from './pages/Payment';
import SearchResults from './pages/StudentDashboard/SearchResults';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <HeaderPrimary />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/course/:id" element={<CoursePage />} />
              <Route path="/payment/:id/:price/:userId" element={<Payment />} />

              <Route path="/my-course/:userId/:courseId" element={<MyCourse />} />

              <Route path="/all-courses" element={<AllCourses />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/courses/:id" element={<CourseData />} />

              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-dashboard/:userId" element={<StudentDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/creator/*" element={<CreatorDashboard />} />


            </Routes>
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </BrowserRouter>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
