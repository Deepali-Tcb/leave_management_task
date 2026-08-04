import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const adminProxyRouter = express.Router();

// Public routes
const publicRoutes = ["/health"];

// Middleware only for protected routes
adminProxyRouter.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  authMiddleware(req, res, (err) => {
    if (err) return next(err);

    roleMiddleware("ADMIN")(req, res, next);
  });
});

adminProxyRouter.use(
  "/",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        // JWT information forward
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

export default adminProxyRouter;
