import { Router } from "express";

const router = Router();
router.get("/", async (_req, res) => {
  res.json({ hello: "success running backend service", "client-default-port": 3000 });
});
export default router;
