export interface CreateShortUrlPayload {
  full_url: string;
  expires_at: Date;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface CreateUrlFormValues extends Partial<CreateShortUrlPayload> {
  url: string;
  expiry: "1minute" | "1day" | "7days" | "30days";
  custom_slug?: string;
}

export interface CreateShortUrlResponseData {
  id: number;
  short_code: string;
  full_url: string;
  click_count: number;
  created_at: string;
  expires_at: string;
}

export interface CreateShortUrlResponse {
  message: string;
  data: CreateShortUrlResponseData;
}
