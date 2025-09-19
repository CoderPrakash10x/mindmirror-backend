// backend/middleware/validateRegister.js
function validateRegister(req, res, next) {
  const { unique_id, name, password, role } = req.body;

  if (!unique_id || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['admin', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or student' });
  }

  next();
}

module.exports = validateRegister;
