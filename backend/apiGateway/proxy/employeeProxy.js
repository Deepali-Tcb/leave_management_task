import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const employeeProxyRouter = express.Router();

// Public routes
const publicRoutes = ["/health"];

// Middleware only for protected routes
employeeProxyRouter.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  authMiddleware(req, res, (err) => {
    if (err) return next(err);

    roleMiddleware("EMPLOYEE")(req, res, next);
  });
});

employeeProxyRouter.use(
  "/",
  createProxyMiddleware({
    target: process.env.EMPLOYEE_SERVICE_URL,
    changeOrigin: true,

    on: {
      // proxyReq -> request target service ko ja rahi hai
      // req -> client ki original Express request
      // res -> Express response object

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

export default employeeProxyRouter;
