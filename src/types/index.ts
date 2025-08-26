export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  openDays: string;
  openHours: string;
  seats: number;
  seatMap: string;
  circuitLastUpdate: string;
  isNewCircuit?: boolean;
  circuitAge?: number;
  karts?: Kart[];
}

export interface TimeSlot {
  id: string;
  branchId: string;
  date: string;
  startTime: string;
  durationMin: number;
  bufferMin: number;
  capacity: number;
  available: number;
  status: string;
  heldSeats?: number;
}

export interface Plan {
  id: string;
  name: string;
  qualyLaps: number;
  raceLaps: number;
  description: string;
  active: boolean;
  currentPrice?: PlanPrice;
  prices?: PlanPrice[];
}

export interface PlanPrice {
  id: string;
  planId: string;
  method: PaymentMethod;
  amount: number;
  surchargePct?: number;
  validFrom: string;
  validTo?: string;
  active: boolean;
}

export interface Kart {
  id: string;
  branchId: string;
  number: number;
  status: "ok" | "oos";
  reason?: string;
  fromDate?: string;
  toDate?: string;
}

export interface KartStatus {
  number: number;
  status: "available" | "booked" | "held" | "oos";
  reason?: string;
}

export interface Booking {
  id: string;
  code: string;
  branchId: string;
  timeSlotId: string;
  planId: string;
  seats: string;
  qty: number;
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  depositPct: number;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  branch?: Branch;
  timeSlot?: TimeSlot;
  plan?: Plan;
  payments?: Payment[];
  participants?: Participant[];
}

export interface Participant {
  id: string;
  kartNumber: number;
  name: string;
  dni?: string;
  isHolder: boolean;
  email?: string; // Solo para el titular
  phone?: string; // Solo para el titular
}

export interface Payment {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  externalRef?: string;
  metadata?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  active: boolean;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
}

export type PaymentMethod = "cash" | "transfer" | "mp" | "card";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "noShow";
export type PaymentStatus = "unpaid" | "deposit" | "paid";

export interface BookingFormData {
  branchId: string;
  timeSlotId: string;
  planId: string;
  participants: Participant[];
  notes?: string;
  paymentMethod: PaymentMethod;
  sessionId: string;
}

export interface Hold {
  id: string;
  timeSlotId: string;
  seats: string;
  expiresAt: string;
  sessionId: string;
}
