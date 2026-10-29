// Domain model reconstructed from the public Cloudbeds PMS knowledge base.
// Terminology intentionally mirrors Cloudbeds (Condition / Front desk status /
// Assigned to) so the simulation reads like the real product.

/** Housekeeping condition — Cloudbeds' three-state model + operational extras. */
export type Condition = 'inspected' | 'clean' | 'dirty' | 'out_of_service'

/** Whether the unit is physically occupied right now. */
export type RoomStatus = 'vacant' | 'occupied'

/**
 * Front desk status drives what the room means operationally today.
 * `turnover` = departs today AND a new guest is already assigned (same-day flip).
 * `stayover` = guest continues; only a light service is needed.
 */
export type FrontDeskStatus =
  | 'check_in'
  | 'check_out'
  | 'stayover'
  | 'turnover'
  | 'not_reserved'

export interface RoomType {
  id: string
  name: string
  abbr: string
}

export interface Housekeeper {
  id: string
  name: string
  initials: string
}

export interface Room {
  id: string
  /** Display name, e.g. "Ocean King 201". */
  name: string
  number: string
  typeId: string
  floor: number
  condition: Condition
  roomStatus: RoomStatus
  frontDeskStatus: FrontDeskStatus
  assignedTo: string | null // Housekeeper id
  doNotDisturb: boolean
  /** Cross-shift note surfaced in the Unit detail panel. */
  comments: string
  arrivalTime?: string
}

export type ReservationStatus = 'confirmed' | 'in_house' | 'checked_out' | 'cancelled'

export interface Reservation {
  id: string
  code: string
  guestName: string
  roomId: string
  /** ISO date (YYYY-MM-DD), inclusive check-in day. */
  checkIn: string
  /** ISO date (YYYY-MM-DD), exclusive check-out day. */
  checkOut: string
  adults: number
  children: number
  status: ReservationStatus
  source: string
  balance: number
  total: number
  messages: ReservationMessage[]
}

export interface ReservationMessage {
  id: string
  author: 'guest' | 'staff'
  name: string
  at: string
  body: string
}

export interface ActivityItem {
  id: string
  kind: 'arrival' | 'departure' | 'note' | 'payment'
  reservationId: string
  guestName: string
  time: string
}
