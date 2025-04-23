import React from 'react';
import { FaGraduationCap, FaUserTie, FaChalkboardTeacher, FaBook } from 'react-icons/fa';

const Modern3DWhyChooseUs: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bits Elevate?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide a comprehensive and effective learning platform designed to help you achieve your academic and professional goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <FaGraduationCap className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Expert Instructors</h3>
            <p className="text-gray-600 text-center">
              Learn from industry experts and academics with years of experience and deep knowledge in their fields.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <FaUserTie className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Industry Relevant</h3>
            <p className="text-gray-600 text-center">
              Courses designed to meet industry demands and keep you updated with the latest skills and knowledge.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <FaChalkboardTeacher className="text-purple-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Interactive Learning</h3>
            <p className="text-gray-600 text-center">
              Engage with dynamic content, quizzes, and hands-on projects to reinforce your understanding.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <FaBook className="text-amber-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Diverse Curriculum</h3>
            <p className="text-gray-600 text-center">
              Access a wide range of courses spanning various disciplines and specializations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modern3DWhyChooseUs; 