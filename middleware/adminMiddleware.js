// middleware/
function adminMiddleware(req, res, next) {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}

module.exports = adminMiddleware;
