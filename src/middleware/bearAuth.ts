import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

type DecodedToken = {
    // userId: string;
    userId:number
    email: string;
    userType: string;
    exp?: number;
};

// AUTHENTICATION MIDDLEWARE
export const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token as string, secret as string) as DecodedToken;
        return decoded;
    } catch (error: any) {
        return null;
    }
}

// AUTHORIZATION MIDDLEWARE
export const authMiddleware = async (req: Request, res: Response, next: NextFunction, requiredRole: string) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Authorization header is missing or malformed" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyToken(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    const userType = decodedToken.userType;

    if (requiredRole === "all" && ["admin", "user", "doctor", ].includes(userType)) {
        req.user = decodedToken;
        next();
    } else if (requiredRole === "both" && (userType === "admin" || userType === "user")) {
        req.user = decodedToken;
        next();
    } else if (userType === requiredRole) {
        req.user = decodedToken;
        next();
    } else {
        res.status(403).json({ error: "Forbidden: You do not have permission to access this resource" });
    }
};

// Middleware for specific roles
export const adminRoleAuth = async (req: Request, res: Response, next: NextFunction) => await authMiddleware(req, res, next, "admin");
export const userRoleAuth = async (req: Request, res: Response, next: NextFunction) => await authMiddleware(req, res, next, "user");
export const doctorRoleAuth = async (req: Request, res: Response, next: NextFunction) => await authMiddleware(req, res, next, "doctor");
export const bothRolesAuth = async (req: Request, res: Response, next: NextFunction) => await authMiddleware(req, res, next, "both");
export const allRolesAuth = async (req: Request, res: Response, next: NextFunction) => await authMiddleware(req, res, next, "all");