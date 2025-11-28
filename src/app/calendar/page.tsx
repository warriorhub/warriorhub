import CalendarView from '@/components/CalendarView';

export default function CalendarPage() {
  return <CalendarView initialDate={new Date(2025, 0, 1)} />;
}
