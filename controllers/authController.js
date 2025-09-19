const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// ➤ Register Controller
exports.register = async (req, res) => {
  const { unique_id, name, password } = req.body;

  try {
    const existingUser = await Student.findOne({ unique_id });
    if (existingUser) return res.status(400).json({ message: 'Unique ID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      unique_id: unique_id.trim(),
      name: name.trim(),
      password: hashedPassword,
      role: 'student'
    });

    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ➤ Login Controller
exports.login = async (req, res) => {
  const { unique_id, password } = req.body;

  try {
    const student = await Student.findOne({ unique_id });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { student_id: student.unique_id, _id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 🟢 yaha token ke sath student_id bhi bhej rahe hain
    res.json({
      token,
      student_id: student.unique_id,
      name: student.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};