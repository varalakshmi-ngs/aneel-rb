'use client';

import { EventsSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardEventsPage() {
  const { events, eventForm, setEventForm, handleEventSubmit, editEvent, handleDeleteEvent, token } = useAdminDashboard();

  return (
    <EventsSection
      events={events}
      eventForm={eventForm}
      setEventForm={setEventForm}
      handleEventSubmit={handleEventSubmit}
      editEvent={editEvent}
      handleDeleteEvent={handleDeleteEvent}
      token={token}
    />
  );
}
