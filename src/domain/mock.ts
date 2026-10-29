import { addDays, today } from '../lib/date'
import type { TFunc } from '../i18n'
import type {
  ActivityItem,
  Housekeeper,
  Reservation,
  Room,
  RoomType,
} from './types'

/** Localized room display name, e.g. "豪華套房 301" / "Deluxe Suite 301". */
export function roomLabel(t: TFunc, room: Pick<Room, 'typeId' | 'number'>): string {
  return `${t(`roomType.${room.typeId}`)} ${room.number}`
}

export const ROOM_TYPES: RoomType[] = [
  { id: 'sq', name: 'Standard Queen', abbr: 'SQ' },
  { id: 'ok', name: 'Ocean King', abbr: 'OK' },
  { id: 'tw', name: 'Twin Double', abbr: 'TW' },
  { id: 'ds', name: 'Deluxe Suite', abbr: 'DS' },
]

export const HOUSEKEEPERS: Housekeeper[] = [
  { id: 'hk1', name: 'Maria Lopez', initials: 'ML' },
  { id: 'hk2', name: 'Chen Wei', initials: 'CW' },
  { id: 'hk3', name: 'Sofia Rossi', initials: 'SR' },
  { id: 'hk4', name: 'Daniel Park', initials: 'DP' },
]

export const CURRENCY = 'USD'
export const PROPERTY_NAME = 'Azure Bay Hotel & Suites'

/** Base nightly rate per room type (weekends take a +15% uplift in the grid). */
export const BASE_RATE: Record<string, number> = { sq: 129, tw: 149, ok: 214, ds: 329 }

// Property settings — field names mirror the v2 API organization/property schema.
export const PROPERTY = {
  code: 'AZB-001',
  currencyCode: 'USD',
  timeZone: 'America/Los_Angeles',
  checkinTime: '15:00',
  checkoutTime: '11:00',
  lateCheckoutFee: 45,
  phone: '+1 (415) 555-0142',
  email: 'frontdesk@azurebay.example',
  website: 'azurebay.example',
  bookingUrl: 'book.azurebay.example',
  address: '2200 Ocean Drive, Monterey, CA 93940, USA',
  amenities: ['Wi-Fi', 'Pool', 'Parking', 'Breakfast', 'Gym', 'Spa', 'Pet friendly', 'Airport shuttle'],
}

export type GroupStatus = 'confirmed' | 'tentative' | 'cancelled'
export interface GroupBooking {
  id: string
  name: string
  code: string
  status: GroupStatus
  checkIn: string
  checkOut: string
  rooms: number
  picked: number
  source: string
}

export function makeGroups(): GroupBooking[] {
  const d = (n: number) => addDays(T, n)
  return [
    { id: 'g1', name: 'Meridian Tech Offsite', code: 'GRP-2041', status: 'confirmed', checkIn: d(1), checkOut: d(4), rooms: 18, picked: 18, source: 'Direct' },
    { id: 'g2', name: 'Chen–Watanabe Wedding', code: 'GRP-2055', status: 'confirmed', checkIn: d(6), checkOut: d(8), rooms: 24, picked: 16, source: 'Direct' },
    { id: 'g3', name: 'Pacific Dental Conference', code: 'GRP-2060', status: 'tentative', checkIn: d(12), checkOut: d(15), rooms: 40, picked: 9, source: 'Sales' },
    { id: 'g4', name: 'Harbor Rotary Club Retreat', code: 'GRP-2033', status: 'confirmed', checkIn: d(-2), checkOut: d(1), rooms: 12, picked: 12, source: 'Direct' },
    { id: 'g5', name: 'Northwind Film Crew', code: 'GRP-2068', status: 'tentative', checkIn: d(20), checkOut: d(27), rooms: 30, picked: 0, source: 'Sales' },
    { id: 'g6', name: 'Alpine Ski Team', code: 'GRP-2012', status: 'cancelled', checkIn: d(3), checkOut: d(6), rooms: 15, picked: 0, source: 'Expedia' },
  ]
}

const T = today()

export function makeRooms(): Room[] {
  return [
    { id: 'r101', name: 'Standard Queen 101', number: '101', typeId: 'sq', floor: 1, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'turnover', assignedTo: 'hk1', doNotDisturb: false, comments: '已核准延遲退房至 13:00。需於 15:00 貴賓到店前完成翻房。', arrivalTime: '15:00' },
    { id: 'r102', name: 'Standard Queen 102', number: '102', typeId: 'sq', floor: 1, condition: 'clean', roomStatus: 'vacant', frontDeskStatus: 'check_in', assignedTo: 'hk1', doNotDisturb: false, comments: '', arrivalTime: '16:00' },
    { id: 'r103', name: 'Standard Queen 103', number: '103', typeId: 'sq', floor: 1, condition: 'inspected', roomStatus: 'vacant', frontDeskStatus: 'not_reserved', assignedTo: null, doNotDisturb: false, comments: '' },
    { id: 'r104', name: 'Twin Double 104', number: '104', typeId: 'tw', floor: 1, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'stayover', assignedTo: 'hk2', doNotDisturb: true, comments: '客人要求 14:00 前不要整理。' },
    { id: 'r105', name: 'Twin Double 105', number: '105', typeId: 'tw', floor: 1, condition: 'clean', roomStatus: 'vacant', frontDeskStatus: 'check_in', assignedTo: 'hk2', doNotDisturb: false, comments: '客人要求加床。' },
    { id: 'r201', name: 'Ocean King 201', number: '201', typeId: 'ok', floor: 2, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'check_out', assignedTo: null, doNotDisturb: false, comments: '迷你吧需補貨。' },
    { id: 'r202', name: 'Ocean King 202', number: '202', typeId: 'ok', floor: 2, condition: 'inspected', roomStatus: 'vacant', frontDeskStatus: 'check_in', assignedTo: 'hk3', doNotDisturb: false, comments: '', arrivalTime: '14:30' },
    { id: 'r203', name: 'Ocean King 203', number: '203', typeId: 'ok', floor: 2, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'turnover', assignedTo: 'hk3', doNotDisturb: false, comments: '為下一位客人布置蜜月房。', arrivalTime: '17:00' },
    { id: 'r204', name: 'Ocean King 204', number: '204', typeId: 'ok', floor: 2, condition: 'clean', roomStatus: 'occupied', frontDeskStatus: 'stayover', assignedTo: 'hk3', doNotDisturb: false, comments: '' },
    { id: 'r205', name: 'Twin Double 205', number: '205', typeId: 'tw', floor: 2, condition: 'out_of_service', roomStatus: 'vacant', frontDeskStatus: 'not_reserved', assignedTo: null, doNotDisturb: false, comments: '冷氣維修 — 維修工單 #4471，預計明日完成。' },
    { id: 'r301', name: 'Deluxe Suite 301', number: '301', typeId: 'ds', floor: 3, condition: 'inspected', roomStatus: 'vacant', frontDeskStatus: 'check_in', assignedTo: 'hk4', doNotDisturb: false, comments: '已擺放迎賓備品。', arrivalTime: '13:00' },
    { id: 'r302', name: 'Deluxe Suite 302', number: '302', typeId: 'ds', floor: 3, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'check_out', assignedTo: 'hk4', doNotDisturb: false, comments: '' },
    { id: 'r303', name: 'Deluxe Suite 303', number: '303', typeId: 'ds', floor: 3, condition: 'clean', roomStatus: 'vacant', frontDeskStatus: 'not_reserved', assignedTo: null, doNotDisturb: false, comments: '' },
    { id: 'r304', name: 'Ocean King 304', number: '304', typeId: 'ok', floor: 3, condition: 'dirty', roomStatus: 'occupied', frontDeskStatus: 'stayover', assignedTo: null, doNotDisturb: false, comments: '' },
  ]
}

export function makeReservations(): Reservation[] {
  // Positioned relative to today so the Calendar always looks populated.
  const d = (n: number) => addDays(T, n)
  return [
    {
      id: 'b1', code: 'CB-10431', guestName: 'James Whitfield', roomId: 'r101',
      checkIn: d(-1), checkOut: d(0), adults: 2, children: 0, status: 'in_house',
      source: 'Booking.com', balance: 0, total: 420,
      messages: [
        { id: 'm1', author: 'guest', name: 'James W.', at: '09:12', body: '可以延遲退房嗎？我的班機是 18:00。' },
        { id: 'm2', author: 'staff', name: '櫃台', at: '09:20', body: '已為您延長至 13:00，祝您有個美好的早晨！' },
      ],
    },
    { id: 'b2', code: 'CB-10432', guestName: 'Aiko Tanaka', roomId: 'r101', checkIn: d(0), checkOut: d(3), adults: 1, children: 0, status: 'confirmed', source: 'Direct', balance: 540, total: 540, messages: [] },
    { id: 'b3', code: 'CB-10440', guestName: 'The Mertens Family', roomId: 'r102', checkIn: d(0), checkOut: d(4), adults: 2, children: 2, source: 'Expedia', status: 'confirmed', balance: 880, total: 880, messages: [] },
    { id: 'b4', code: 'CB-10401', guestName: 'Liam O’Connor', roomId: 'r104', checkIn: d(-2), checkOut: d(2), adults: 2, children: 0, source: 'Direct', status: 'in_house', balance: 120, total: 640, messages: [] },
    { id: 'b5', code: 'CB-10455', guestName: 'Priya Nair', roomId: 'r105', checkIn: d(0), checkOut: d(2), adults: 1, children: 0, source: 'Airbnb', status: 'confirmed', balance: 260, total: 260, messages: [] },
    { id: 'b6', code: 'CB-10388', guestName: 'Carlos Mendes', roomId: 'r201', checkIn: d(-3), checkOut: d(0), adults: 2, children: 0, source: 'Booking.com', status: 'in_house', balance: 0, total: 960, messages: [] },
    { id: 'b7', code: 'CB-10462', guestName: 'Elena Volkova', roomId: 'r202', checkIn: d(0), checkOut: d(5), adults: 2, children: 0, source: 'Direct', status: 'confirmed', balance: 1450, total: 1450, messages: [] },
    { id: 'b8', code: 'CB-10410', guestName: 'Noah Schmidt', roomId: 'r203', checkIn: d(-1), checkOut: d(0), adults: 2, children: 1, source: 'Expedia', status: 'in_house', balance: 0, total: 710, messages: [] },
    { id: 'b9', code: 'CB-10470', guestName: 'Sarah & Tom Avery', roomId: 'r203', checkIn: d(0), checkOut: d(4), adults: 2, children: 0, source: 'Direct', status: 'confirmed', balance: 1180, total: 1180, messages: [{ id: 'm3', author: 'guest', name: 'Sarah A.', at: '昨天', body: '我們是來慶祝結婚週年的 🥂' }] },
    { id: 'b10', code: 'CB-10344', guestName: 'Yuki Mori', roomId: 'r204', checkIn: d(-4), checkOut: d(3), adults: 1, children: 0, source: 'Booking.com', status: 'in_house', balance: 0, total: 1120, messages: [] },
    { id: 'b11', code: 'CB-10466', guestName: 'Grace Lee', roomId: 'r301', checkIn: d(0), checkOut: d(2), adults: 2, children: 0, source: 'Direct', status: 'confirmed', balance: 900, total: 900, messages: [] },
    { id: 'b12', code: 'CB-10399', guestName: 'Robert King', roomId: 'r302', checkIn: d(-3), checkOut: d(0), adults: 2, children: 0, source: 'Expedia', status: 'in_house', balance: 0, total: 1340, messages: [] },
    { id: 'b13', code: 'CB-10350', guestName: 'Fatima Al-Sayed', roomId: 'r304', checkIn: d(-5), checkOut: d(2), adults: 2, children: 1, source: 'Direct', status: 'in_house', balance: 230, total: 1680, messages: [] },
    { id: 'b14', code: 'CB-10478', guestName: 'Henrik Olsen', roomId: 'r103', checkIn: d(2), checkOut: d(5), adults: 1, children: 0, source: 'Booking.com', status: 'confirmed', balance: 480, total: 480, messages: [] },
  ]
}

export function makeActivity(reservations: Reservation[]): ActivityItem[] {
  const has = (id: string) => reservations.some((r) => r.id === id)
  const items: ActivityItem[] = [
    { id: 'a1', kind: 'arrival', reservationId: 'b11', guestName: 'Grace Lee', time: '13:00' },
    { id: 'a2', kind: 'departure', reservationId: 'b1', guestName: 'James Whitfield', time: '13:00' },
    { id: 'a3', kind: 'arrival', reservationId: 'b7', guestName: 'Elena Volkova', time: '14:30' },
    { id: 'a4', kind: 'payment', reservationId: 'b13', guestName: 'Fatima Al-Sayed', time: '11:48' },
    { id: 'a5', kind: 'arrival', reservationId: 'b9', guestName: 'Sarah & Tom Avery', time: '17:00' },
    { id: 'a6', kind: 'note', reservationId: 'b4', guestName: 'Liam O’Connor', time: '10:05' },
  ]
  return items.filter((a) => has(a.reservationId))
}
