import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { HOUSEKEEPERS, ROOM_TYPES, makeActivity, makeReservations, makeRooms } from './mock'
import type { Condition, Reservation, ReservationStatus, Room } from './types'

interface Store {
  rooms: Room[]
  reservations: Reservation[]
  roomTypes: typeof ROOM_TYPES
  housekeepers: typeof HOUSEKEEPERS
  activity: ReturnType<typeof makeActivity>
  setCondition: (roomIds: string[], condition: Condition) => void
  assignHousekeeper: (roomIds: string[], housekeeperId: string | null) => void
  toggleDnd: (roomId: string) => void
  setComments: (roomId: string, comments: string) => void
  setReservationStatus: (reservationId: string, status: ReservationStatus) => void
  payBalance: (reservationId: string) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(makeRooms)
  const [reservations, setReservations] = useState<Reservation[]>(makeReservations)
  const activity = useMemo(() => makeActivity(reservations), [reservations])

  const setCondition = useCallback((roomIds: string[], condition: Condition) => {
    const set = new Set(roomIds)
    setRooms((prev) => prev.map((r) => (set.has(r.id) ? { ...r, condition } : r)))
  }, [])

  const assignHousekeeper = useCallback((roomIds: string[], housekeeperId: string | null) => {
    const set = new Set(roomIds)
    setRooms((prev) => prev.map((r) => (set.has(r.id) ? { ...r, assignedTo: housekeeperId } : r)))
  }, [])

  const toggleDnd = useCallback((roomId: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, doNotDisturb: !r.doNotDisturb } : r)))
  }, [])

  const setComments = useCallback((roomId: string, comments: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, comments } : r)))
  }, [])

  const setReservationStatus = useCallback((reservationId: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status } : r)))
  }, [])

  const payBalance = useCallback((reservationId: string) => {
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, balance: 0 } : r)))
  }, [])

  const value = useMemo<Store>(
    () => ({
      rooms,
      reservations,
      roomTypes: ROOM_TYPES,
      housekeepers: HOUSEKEEPERS,
      activity,
      setCondition,
      assignHousekeeper,
      toggleDnd,
      setComments,
      setReservationStatus,
      payBalance,
    }),
    [rooms, reservations, activity, setCondition, assignHousekeeper, toggleDnd, setComments, setReservationStatus, payBalance],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used within StoreProvider')
  return v
}

export function useRoom(roomId: string | null): Room | undefined {
  const { rooms } = useStore()
  return useMemo(() => rooms.find((r) => r.id === roomId), [rooms, roomId])
}

export function useHousekeeperName(id: string | null): string {
  const { housekeepers } = useStore()
  if (!id) return 'Unassigned'
  return housekeepers.find((h) => h.id === id)?.name ?? 'Unassigned'
}
