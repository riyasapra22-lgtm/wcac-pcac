export type PostType = "WCAC" | "PCAC" | "WCAB" | "PCAB" | "LOST" | "FOUND" | "VOLUNTEER";
export type PostStatus = "OPEN" | "FULFILLED" | "CLOSED";

export const POST_TYPES: { value: PostType; label: string; blurb: string }[] = [
  { value: "WCAC", label: "WCAC — Will Come And Collect", blurb: "You need something and will pick it up." },
  { value: "PCAC", label: "PCAC — Please Come And Collect", blurb: "You have something someone can pick up." },
  { value: "WCAB", label: "WCAB — Will Come And Buy", blurb: "You want to buy something." },
  { value: "PCAB", label: "PCAB — Please Come And Buy", blurb: "You're selling something." },
  { value: "LOST", label: "LOST", blurb: "You lost something." },
  { value: "FOUND", label: "FOUND", blurb: "You found something." },
  { value: "VOLUNTEER", label: "VOLUNTEER — WCAC People", blurb: "You need people, not things." },
];

export type Profile = {
  id: string;
  full_name: string | null;
  hostel: string | null;
  points: number;
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
  event_id: string | null;
  slots_needed: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
  events?: Pick<Event, "id" | "title"> | null;
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

export type CommunityKind = "HOSTEL" | "COMMITTEE" | "SOCIETY" | "CLUB";

export const COMMUNITY_KINDS: { value: CommunityKind; label: string }[] = [
  { value: "HOSTEL", label: "Hostel" },
  { value: "COMMITTEE", label: "Committee" },
  { value: "SOCIETY", label: "Society" },
  { value: "CLUB", label: "Club" },
];

export type Community = {
  id: string;
  name: string;
  kind: CommunityKind;
  description: string | null;
  created_by: string | null;
  created_at: string;
  community_members?: { count: number }[];
};

export type CommunityMember = {
  community_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: Profile | null;
};

export type Event = {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_by: string | null;
  created_at: string;
  communities?: Pick<Community, "id" | "name" | "kind"> | null;
};

export type EventNeedResponseKind = "HAVE" | "NEED";

export type EventNeed = {
  id: string;
  event_id: string;
  item_name: string;
  created_at: string;
  event_need_responses?: EventNeedResponse[];
};

export type EventNeedResponse = {
  id: string;
  event_need_id: string;
  user_id: string;
  response: EventNeedResponseKind;
  created_at: string;
  profiles?: Profile | null;
};

export type ResourceMode = "LEND" | "RENT" | "SELL" | "GIVE_AWAY";
export type ResourceStatus = "AVAILABLE" | "UNAVAILABLE";

export const RESOURCE_MODES: { value: ResourceMode; label: string }[] = [
  { value: "LEND", label: "Lend" },
  { value: "RENT", label: "Rent" },
  { value: "SELL", label: "Sell" },
  { value: "GIVE_AWAY", label: "Give away" },
];

export type Resource = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  mode: ResourceMode;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
};
