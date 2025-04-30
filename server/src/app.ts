import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mainRoute from "./routes/main";
import urlShorterRoute from "./routes/url-shorter-routes";
import { redis } from "./utils/redis";
import {
  redirectShortURL,
  truncateTable,
} from "./controllers/url-shorter-controller";
dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Root endpoint - Returns a simple hello world message and default client port
app.use("/", mainRoute);

// GET /v1/symph/url/shorts - Fetches all records from the example_foreign_table
// POST /v1/symph/url/short - Creates a new record, returns the created document
app.use("/v1/symph/url", urlShorterRoute);

app.use("/dev/truncate", truncateTable);
// root level access to redirect shorten url
app.use("/:short_code", redirectShortURL);


const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await redis.connect();
  console.log(`server has started on port ${PORT}`);
});
