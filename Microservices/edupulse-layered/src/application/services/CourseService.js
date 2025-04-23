const Course = require('../../domain/models/Course');
const User = require('../../domain/models/User');

class CourseService {
  async createCourse(courseData) {
    const course = new Course(courseData);
    await course.save();
    return course;
  }

  async getCourseById(id) {
    return await Course.findById(id)
      .populate('instructor', 'firstName lastName email')
      .populate('studentsEnrolled', 'firstName lastName email');
  }

  async getAllCourses() {
    return await Course.find()
      .populate('instructor', 'firstName lastName email')
      .populate('studentsEnrolled', 'firstName lastName email');
  }

  async updateCourse(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true })
      .populate('instructor', 'firstName lastName email')
      .populate('studentsEnrolled', 'firstName lastName email');
  }

  async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  async enrollStudent(courseId, userId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already enrolled
    if (course.studentsEnrolled.includes(userId)) {
      throw new Error('User is already enrolled in this course');
    }

    // Add student to course
    course.studentsEnrolled.push(userId);
    await course.save();

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    return course;
  }

  async addLesson(courseId, lessonData) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.lessons.push(lessonData);
    await course.save();
    return course;
  }

  async updateLesson(courseId, lessonId, updateData) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lessonIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) {
      throw new Error('Lesson not found');
    }

    course.lessons[lessonIndex] = { ...course.lessons[lessonIndex].toObject(), ...updateData };
    await course.save();
    return course;
  }

  async deleteLesson(courseId, lessonId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.lessons = course.lessons.filter(lesson => lesson._id.toString() !== lessonId);
    await course.save();
    return course;
  }
}

module.exports = new CourseService(); 