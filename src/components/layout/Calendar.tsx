// src/components/dashboard/Calendar.tsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Meeting {
  id: string;
  title: string;
  date: string;
  status: "pending" | "confirmed" | "declined";
}

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Meeting[]>([
    { id: "1", title: "Team Meeting", date: "2025-09-20", status: "confirmed" },
    { id: "2", title: "Investor Call", date: "2025-09-22", status: "pending" },
  ]);

  // Add availability
  const handleDateClick = (info: any) => {
    const title = prompt("Enter availability/meeting title:");
    if (title) {
      const newMeeting: Meeting = {
        id: String(Date.now()),
        title,
        date: info.dateStr,
        status: "pending",
      };
      setEvents([...events, newMeeting]);
    }
  };

  // Accept/Decline meetings
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const action = window.confirm("Accept this meeting? Click Cancel to Decline.")
      ? "confirmed"
      : "declined";

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId ? { ...evt, status: action as Meeting["status"] } : evt
      )
    );
  };

  return (
    <div className="bg-white p-4 mt-10 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Meeting Scheduler</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((evt) => ({
          id: evt.id,
          title: `${evt.title} (${evt.status})`,
          date: evt.date,
          color:
            evt.status === "confirmed"
              ? "#22c55e" // green
              : evt.status === "declined"
              ? "#ef4444" // red
              : "#facc15", // yellow (pending)
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="600px"
      />

      {/* Confirmed Meetings List */}
      <div className="mt-6">
        <h3 className="text-md font-semibold">✅ Confirmed Meetings</h3>
        <ul className="list-disc pl-5 mt-2">
          {events
            .filter((e) => e.status === "confirmed")
            .map((meeting) => (
              <li key={meeting.id}>
                {meeting.title} — {meeting.date}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

