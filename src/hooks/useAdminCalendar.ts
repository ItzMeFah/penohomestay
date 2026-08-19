import { useState } from 'react';

export const useAdminCalendar = () => {
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [selectedCalendarVillaId, setSelectedCalendarVillaId] = useState("");

  const MONTHS_ID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const DAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return {
    calYear,
    setCalYear,
    calMonth,
    setCalMonth,
    selectedCalendarVillaId,
    setSelectedCalendarVillaId,
    MONTHS_ID,
    DAYS_ID
  };
};
