const User = require('../../domain/models/User');
const { hashPassword, verifyPassword, generateToken } = require('../../infrastructure/security');

class UserService {
  async register(userData) {
    const { email, password, firstName, lastName, role } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    await user.save();
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user);
    return { user, token };
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  async enrollInCourse(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    ).select('-password');
  }
}

module.exports = new UserService(); 