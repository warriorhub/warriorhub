export const HST_TIME_ZONE = 'Pacific/Honolulu';

type DateInput = string | number | Date;

const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value));

const toParts = (value: DateInput) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(toDate(value));

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
  };
};

export const formatHstDate = (value: DateInput) => new Intl.DateTimeFormat('en-US', {
  timeZone: HST_TIME_ZONE,
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(toDate(value));

export const formatHstTime = (value: DateInput) => new Intl.DateTimeFormat('en-US', {
  timeZone: HST_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
}).format(toDate(value));

export const formatHstShortDate = (value: DateInput) => new Intl.DateTimeFormat('en-US', {
  timeZone: HST_TIME_ZONE,
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
}).format(toDate(value));

export const formatHstDateTime = (value: DateInput) => `${formatHstDate(value)} ${formatHstTime(value)}`;

// Convert a date+time entered as local Honolulu time to an ISO string (UTC)
export const toUtcFromDateAndTime = (date: string, time: string) => new Date(
  `${date}T${time || '00:00'}-10:00`,
).toISOString();

// Convert a datetime-local input (yyyy-MM-ddTHH:mm) entered as Honolulu time to ISO UTC
export const toUtcFromDateTimeLocal = (dateTimeLocal: string) => new Date(
  `${dateTimeLocal}:00-10:00`,
).toISOString();

// Convert stored UTC datetime to a datetime-local string in Honolulu (yyyy-MM-ddTHH:mm)
export const toDateTimeLocalHst = (value: DateInput) => {
  const { year, month, day, hour, minute } = toParts(value);
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
