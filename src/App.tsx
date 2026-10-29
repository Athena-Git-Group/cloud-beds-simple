import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { CalendarPage } from './pages/CalendarPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { HousekeepingPage } from './pages/HousekeepingPage'
import { MobilePage } from './pages/MobilePage'
import { RatesPage } from './pages/RatesPage'
import { ReportingPage } from './pages/ReportingPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { GroupsPage } from './pages/GroupsPage'
import { SettingsPage } from './pages/SettingsPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/housekeeping" element={<HousekeepingPage />} />
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="/rates" element={<RatesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/reporting" element={<ReportingPage />} />
        <Route path="/profiles" element={<PlaceholderPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/tickets" element={<PlaceholderPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
