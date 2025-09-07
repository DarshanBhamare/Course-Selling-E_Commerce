import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();                              
function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
    console.log(decoded);
  console.log("Decoded JWT:", decoded);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("JWT verification error:", error); // 👈 full error object
    return res.status(401).json({ errors: "Invalid token or expired" });
}

}

export default adminMiddleware;