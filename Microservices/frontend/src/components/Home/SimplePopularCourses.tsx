import React, { useContext } from 'react';
import { FaStar, FaUsers, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Modern3DPopularCourses: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  // Sample course data - in a real app, this would come from an API
  const courses = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Patel',
      rating: 4.8,
      students: 2840,
      duration: '22 hours',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. Khan',
      rating: 4.9,
      students: 3560,
      duration: '28 hours',
      price: '$94.99',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      title: 'Web Development Bootcamp',
      instructor: 'Ms. Johnson',
      rating: 4.7,
      students: 5230,
      duration: '36 hours',
      price: '$99.99',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 4,
      title: 'Advanced Python Programming',
      instructor: 'Dr. Lee',
      rating: 4.6,
      students: 1980,
      duration: '18 hours',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
  ];

  // Handle enrollment click
  const handleEnrollClick = async (courseId: number) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/sign-in');
      return;
    }
    
    // If user is logged in, navigate to the course page
    navigate(`/course/${courseId}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after courses designed to help you master new skills and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded">
                  {course.price}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 hover:text-blue-600 transition-colors">
                  <Link to={`/course/${course.id}`}>{course.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4">by {course.instructor}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold">{course.rating}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <FaUsers className="text-gray-400 mr-1" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <FaClock className="text-gray-400 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleEnrollClick(course.id)}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/all-courses"
            className="inline-block bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Modern3DPopularCourses; 