// Test script to check the Course Management API
import fetch from 'node-fetch';

async function testCourseManagementAPI() {
  try {
    console.log('Testing Course Management API...');
    
    // Test getting a course by ID
    const courseId = '123'; // Replace with a valid course ID if you know one
    const courseResponse = await fetch(`http://localhost:7071/api/courseManagement/${courseId}`);
    
    console.log('Course API Status:', courseResponse.status);
    
    if (!courseResponse.ok) {
      console.error('Failed to get course:', await courseResponse.text());
      return;
    }
    
    const courseData = await courseResponse.json();
    console.log('Course API Response Structure:', JSON.stringify(courseData, null, 2));
    
    // Validate the response structure
    if (!courseData.data) {
      console.error('Warning: Course API response does not contain a "data" property');
    } else {
      console.log('Course data is available in the expected format');
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testCourseManagementAPI(); 