// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    // Use decoded.student_id (this is what your login sets)
    req.student_id = decoded.student_id || decoded.studentId || decoded.id;
    req.role = decoded.role;
    next();
  });
}

module.exports = authMiddleware;
