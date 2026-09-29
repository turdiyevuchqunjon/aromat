/** Lid ma'lumotlari — bazada emas, shifrlangan Purchase havolasi ichida saqlanadi */
export interface LeadRecord {
  id: string;
  createdAt: number;

  name: string;
  phone: string;

  // Lid qoldirilgan paytdagi Meta matching / attribution ma'lumotlari
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
  eventSourceUrl?: string;
}

export interface CapiUserData {
  em?: string[]; // hashed email(s)
  ph?: string[]; // hashed phone(s)
  fn?: string[]; // hashed first name
  country?: string[]; // hashed ISO country code
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
