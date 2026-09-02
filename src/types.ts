export type PostType = "WCAC" | "PCAC" | "WCAB" | "PCAB" | "LOST" | "FOUND";
export type PostStatus = "OPEN" | "FULFILLED" | "CLOSED";

export const POST_TYPES: { value: PostType; label: string; blurb: string }[] = [
  { value: "WCAC", label: "WCAC — Will Come And Collect", blurb: "You need something and will pick it up." },
  { value: "PCAC", label: "PCAC — Please Come And Collect", blurb: "You have something someone can pick up." },
  { value: "WCAB", label: "WCAB — Will Come And Buy", blurb: "You want to buy something." },
  { value: "PCAB", label: "PCAB — Please Come And Buy", blurb: "You're selling something." },
  { value: "LOST", label: "LOST", blurb: "You lost something." },
  { value: "FOUND", label: "FOUND", blurb: "You found something." },
];

export type Profile = {
  id: string;
  full_name: string | null;
  hostel: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  type: PostType;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
};

export type PostResponse = {
  id: string;
  post_id: string;
  user_id: string;
  message: string | null;
  accepted: boolean;
  created_at: string;
  profiles?: Profile | null;
};
