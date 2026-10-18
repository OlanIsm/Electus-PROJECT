import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [month, setMonth] = useState(selectedDate);

  return (
    <section className="dashboard-calendar" aria-label="Calendar">
      <Calendar
        mode="single"
        required
        selected={selectedDate}
        onSelect={date => date && setSelectedDate(date)}
        month={month}
        onMonthChange={setMonth}
        weekStartsOn={1}
        fixedWeeks
        className="workspace-calendar"
        formatters={{ formatWeekdayName: date => date.toLocaleDateString("en-GB", { weekday: "short" }) }}
        classNames={{
          months: "calendar-months",
          month: "calendar-month",
          caption: "calendar-caption",
          caption_label: "calendar-caption-label",
          nav: "calendar-nav",
          nav_button: "calendar-nav-button",
          nav_button_previous: "calendar-previous",
          nav_button_next: "calendar-next",
          table: "calendar-table",
          head_row: "calendar-weekdays",
          head_cell: "calendar-weekday",
          row: "calendar-week",
          cell: "calendar-cell",
          day: "calendar-day",
          day_selected: "calendar-selected",
          day_today: "calendar-today",
          day_outside: "calendar-outside",
        }}
      />
      <div className="calendar-footer">
        <span>{selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        <button type="button" onClick={() => {
          const today = new Date();
          setSelectedDate(today);
          setMonth(today);
        }}>Today</button>
      </div>
    </section>
  );
}
