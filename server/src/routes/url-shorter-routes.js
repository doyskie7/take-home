import { Router } from "express";
import {
  getURLShortsController,
  createURLShortController,
} from "../controllers/url-shorter-controller.js"; // named import

const router = Router();

router.get("/shorts", getURLShortsController);
router.post("/short", createURLShortController);

export default router;
