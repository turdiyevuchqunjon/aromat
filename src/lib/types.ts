export interface LeadRecord {
  id: string;
  token: string;
  createdAt: number;

  name: string;
  phone: string;
  message?: string;

  // Meta matching / attribution data captured at the moment of the lead
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  clientIp?: string;
  clientUserAgent?: string;
  eventSourceUrl?: string;
  leadEventId: string;

  // Purchase state
  status: "new" | "purchased";
  purchaseAmount?: number;
  purchaseCurrency?: string;
  purchasedAt?: number;
  purchaseEventId?: string;
}

export interface CapiUserData {
  em?: string[]; // hashed email(s)
  ph?: string[]; // hashed phone(s)
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  external_id?: string[];
}

export interface CapiEventPayload {
  event_name: "Lead" | "Purchase" | "PageView";
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: "website" | "system_generated";
  user_data: CapiUserData;
  custom_data?: Record<string, unknown>;
}
