export function permit(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { role } = req.user;
    if (allowed.includes(role)) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
}
