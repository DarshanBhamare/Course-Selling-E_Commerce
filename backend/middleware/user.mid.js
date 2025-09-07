import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();                              
function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);
console.log("Admin Secret:", process.env.JWT_ADMIN_PASSWORD); // Should log 'admin123'

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);

    console.log(decoded);
  console.log("Decoded JWT:", decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("JWT verification error:", error); // 👈 full error object
    return res.status(401).json({ errors: "Invalid token or expired" });
}

}

export default userMiddleware;