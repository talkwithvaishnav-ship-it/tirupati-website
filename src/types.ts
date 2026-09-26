export type LeadStatus = "NEW" | "CONTACTED" | "INSPECTION_SCHEDULED" | "QUOTATION_SENT" | "CONVERTED" | "CLOSED";

export interface SiteSettings {
  business_name: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  google_business_profile_url: string;
  opening_hours: string;
  service_areas: string[];
}

/** Cloudinary (ya koi bhi public URL) par rakhi hui photo / video. */
export interface PhotoAsset {
  url: string;
  public_id?: string;
  original_filename?: string;
  content_type?: string;
  size?: number;
}

export interface Lead {
  id: string;
  lead_id: string;
  lead_type: "inspection" | "estimate" | "contact";
  name: string;
  phone: string;
  whatsapp_number?: string;
  email?: string;
  city: string;
  service: string;
  property_type?: string;
  approximate_area?: number;
  problem_description?: string;
  preferred_contact_time?: string;
  preferred_inspection_date?: string;
  photo_assets: PhotoAsset[];
  status: LeadStatus;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  project_name: string;
  location: string;
  service: string;
  category: "Terrace" | "Roof" | "Bathroom" | "Basement" | "Commercial" | "Industrial";
  area: number;
  completion_date: string;
  description: string;
  problem: string;
  inspection: string;
  solution: string;
  result: string;
  before_photo: PhotoAsset;
  after_photo: PhotoAsset;
  published: boolean;
  created_at: string;
}

export interface WorkVideo {
  id: string;
  title: string;
  description: string;
  service_category?: string;
  location?: string;
  active: boolean;
  display_order: number;
  video_asset: PhotoAsset;
  /** Optional: khali chhodo to Cloudinary video se apne aap thumbnail ban jayega. */
  thumbnail_asset?: PhotoAsset | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  city: string;
  service: string;
  rating: number;
  review_text: string;
  property_type?: string;
  photo_asset?: PhotoAsset | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  short: string;
  image: string;
  benefits: string[];
  problem: string;
  symptoms: string[];
  causes: string[];
  solution: string;
  materials: string[];
  durability: string;
  warranty: string;
  process: string[];
  faqs: { question: string; answer: string }[];
}

export interface CityItem {
  slug: string;
  name: string;
  title: string;
  description: string;
  localProblems: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  image: string;
  content: string[];
  faqs: { question: string; answer: string }[];
}

export interface ProductItem {
  name: string;
  category: string;
  description: string;
  application: string;
  benefits: string[];
  technical: string[];
}

export interface SiteData {
  settings: SiteSettings;
  projects: Project[];
  videos: WorkVideo[];
  testimonials: Testimonial[];
}
