import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authProxyRouter = express.Router();

// Public routes
const publicRoutes = [
  "/health",
  "/login",
  "/email-verify",
  "/reset-password"
];

// Middleware only for protected routes
authProxyRouter.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  return authMiddleware(req, res, next);
});


authProxyRouter.use(
  "/",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,

    // JWT Information Forwards
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.user_id);
          proxyReq.setHeader("x-user-role", req.user.role);
          proxyReq.setHeader("x-user-email", req.user.email);
        }

        fixRequestBody(proxyReq, req, res);
      },
    },
  }),
);

export default authProxyRouter;
