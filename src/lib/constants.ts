import type {
  ButterflyConfig,
  ContactInfo,
  InvitationLine,
  MapLocation,
  WeddingDate,
} from "@/types";

export const THEME = {
  cream: "#FFF5F7",
  sand: "#FFB6C1",
  gold: "#E63946",
  ivory: "#FFF0F5",
  brown: "#6B0F28",
  dark: "#3D0818",
  darkSoft: "#5C1528",
  rose: "#C41E3A",
  pink: "#FF69B4",
  blush: "#FFE4EC",
} as const;

export const INVITATION_LINES: InvitationLine[] = [
  { id: "line-1", text: "بەوپەڕی خۆشحاڵییەوه" },
  { id: "line-2", text: "بانگەیشتتان دهکەین" },
  { id: "line-3", text: "بۆ ئامادەبوون" },
  { id: "line-4", text: "له ئاهەنگی گواستەنەوی" },
];

export const GROOM_NAME = "بەرەدەین";
export const BRIDE_NAME = "ریحان";

export const WEDDING_DATE: WeddingDate = {
  day: 11,
  month: 7,
  year: 2026,
  time: "4:20 عەسر",
  timeLabel: "کاتژمێر",
};

export const MAP_LOCATION: MapLocation = {
  lat: 36.1917,
  lng: 44.0095,
  label: "پارکی سامی عبدالرحمان — دەرگای داوە ٢",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=36.1917,44.0095",
};

export const CONTACT: ContactInfo = {
  phone: "+964 751 799 6339",
  whatsappUrl: "https://wa.me/9647517996339",
};

export const BUTTERFLY_CONFIGS: ButterflyConfig[] = [
  {
    id: "b1",
    position: [-2, 0.5, 0],
    direction: "camera",
    speed: 1.2,
    scale: 0.35,
    color: "#E63946",
  },
  {
    id: "b2",
    position: [2, 0.3, -0.5],
    direction: "up",
    speed: 1.5,
    scale: 0.3,
    color: "#FFB6C1",
  },
  {
    id: "b3",
    position: [0, -0.2, 1],
    direction: "left",
    speed: 1.1,
    scale: 0.4,
    color: "#FFF0F5",
  },
  {
    id: "b4",
    position: [-1.5, 0.8, -1],
    direction: "up",
    speed: 1.8,
    scale: 0.28,
    color: "#E63946",
  },
  {
    id: "b5",
    position: [1.5, 0.6, 0.5],
    direction: "camera",
    speed: 1.3,
    scale: 0.32,
    color: "#FF8FAB",
  },
  {
    id: "b6",
    position: [0.5, 1, -0.8],
    direction: "right",
    speed: 1.6,
    scale: 0.25,
    color: "#FFB6C1",
  },
];

export const FLOWER_COLORS = [
  "#C41E3A",
  "#E63946",
  "#FF8FAB",
  "#FFB6C1",
  "#9D0208",
] as const;
