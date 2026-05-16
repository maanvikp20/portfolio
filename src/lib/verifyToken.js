// checks for admin token and role before allowing access to admin dash
import jwt from "jsonwebtoken";

export function verifyAdminToken(reqOrCookies) {
  let token;

  // check for token in cookies
  if (typeof reqOrCookies.get === "function") {
    const result = reqOrCookies.get("token");
    token = typeof result === "object" ? result?.value : result;
  } 
  
  // fallback to check headers
  if (!token && reqOrCookies.cookies?.get) {
    token = reqOrCookies.cookies.get("token")?.value;
  }

  // If token not found, throw error
  if (!token) {
    throw new Error("Authentication token is missing from session headers.");
  }

  // Verify token and check for admin role
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    
    if (decoded.role !== "admin") {
      throw new Error("Unauthorized access configuration level.");
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired authorization token signature.");
  }
}