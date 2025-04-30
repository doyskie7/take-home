import { db } from "../db/knex.js";
import { generateShortCode } from "../utils/shorter-util.js";
import { redis } from "../utils/redis.js"; // ✅ import Redis

export const getURLShortsController = async (req, res, next) => {
  try {
    const docs = await db("short_urls").select("*");
    res.status(200).json({ docs });
  } catch (error) {
    next(error);
  }
};

export const createURLShortController = async (req, res, next) => {
  try {
    const {
      full_url,
      expires_at,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = req.body;

    if (!full_url) {
      return res.status(400).json({ error: "full_url is required." });
    }

    const utmParams = new URLSearchParams();
    if (utm_source) utmParams.append("utm_source", utm_source);
    if (utm_medium) utmParams.append("utm_medium", utm_medium);
    if (utm_campaign) utmParams.append("utm_campaign", utm_campaign);
    if (utm_term) utmParams.append("utm_term", utm_term);
    if (utm_content) utmParams.append("utm_content", utm_content);

    let finalUrl = full_url;
    if (utmParams.toString()) {
      const hasQuery = full_url.includes("?");
      finalUrl += (hasQuery ? "&" : "?") + utmParams.toString();
    }

    const existing = await db("short_urls")
      .where("full_url", finalUrl)
      .orderBy("created_at", "desc")
      .first();
    if (existing) {
      const now = new Date();
      const expiresAt = new Date(existing.expires_at);

      if (expiresAt.getTime() > now.getTime()) {
        return res.status(403).json({
          message: "Short URL already exists and is active.",
          data: existing,
        });
      }
    }

    const generatedCode = generateShortCode();

    const [newRecord] = await db("short_urls")
      .insert({
        full_url: finalUrl,
        short_code: generatedCode,
        click_count: 0,
        created_at: new Date().toISOString(), // UTC timestamp
        expires_at: expires_at
          ? new Date(expires_at).toISOString()
          : new Date(Date.now() + 1 * 60 * 1000).toISOString(), // Default to 1 minute in UTC
      })
      .returning("*");

    res.status(201).json({
      message: "Short URL created successfully with UTM tracking.",
      data: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const redirectShortURL = async (req, res, next) => {
  try {
    const { short_code } = req.params;

    const cachedURL = await redis.get(short_code);
    if (cachedURL) {
      await db("short_urls").where({ short_code }).increment("click_count", 1);
      return res.redirect(cachedURL);
    }

    const record = await db("short_urls").where({ short_code }).first();

    if (!record) {
      return res.status(404).send("Short URL not found");
    }

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.status(410).send("This shortened URL has expired.");
    }

    const ttlInSeconds = record.expires_at
      ? Math.floor((new Date(record.expires_at) - new Date()) / 1000)
      : 86400;

    await redis.setEx(short_code, ttlInSeconds, record.full_url);

    await db("short_urls").where({ short_code }).increment("click_count", 1);

    res.redirect(record.full_url);
  } catch (error) {
    next(error);
  }
};

export const truncateTable = async (req, res, next) => {
  try {
    await db.raw("TRUNCATE TABLE short_urls RESTART IDENTITY CASCADE");

    res
      .status(200)
      .json({ message: "short_urls table truncated successfully." });
  } catch (error) {
    next(error);
  }
};
