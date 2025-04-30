// utils/api.ts
import axios from "axios";
import { CreateShortUrlPayload, CreateShortUrlResponse } from "../types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createShortUrl = async (
  payload: CreateShortUrlPayload
): Promise<CreateShortUrlResponse> => {
  const response = await api.post<CreateShortUrlResponse>(
    "/v1/symph/url/short",
    payload
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  return response;
};
