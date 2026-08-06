import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token não informado",
    });
  }

  const token = authHeader.substring(7);

  try {
    verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
}
