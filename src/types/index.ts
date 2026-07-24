export interface ButterflyConfig {
  id: string;
  position: [number, number, number];
  direction: string;
  speed: number;
  scale: number;
  color: string;
}

export interface ContactInfo {
  phone: string;
  whatsappUrl: string;
}

export interface InvitationLine {
  id: string;
  text: string;
}

export interface MapLocation {
  lat: number;
  lng: number;
  label: string;
  googleMapsUrl: string;
}

export interface WeddingDate {
  day: number;
  month: number;
  year: number;
  time: string;
  timeLabel: string;
}
