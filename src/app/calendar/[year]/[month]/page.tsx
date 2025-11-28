import CalendarView from '@/components/CalendarView';

interface MonthPageProps {
  params: { year: string; month: string };
}

export default function CalendarMonthPage({ params }: MonthPageProps) {
  const yearNum = Number(params.year);
  const monthNum = Number(params.month) - 1; // incoming month is 1-12, Date expects 0-11

  const isValidYear = !Number.isNaN(yearNum);
  const isValidMonth = !Number.isNaN(monthNum) && monthNum >= 0 && monthNum <= 11;

  const initialDate = isValidYear && isValidMonth
    ? new Date(yearNum, monthNum, 1)
    : new Date();

  return <CalendarView initialDate={initialDate} />;
}
