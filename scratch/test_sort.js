const sortableTime = (t) => {
  if (!t) return '99:99';
  let timeStr = t.toString().toLowerCase().trim();
  
  let hours = 0;
  let minutes = 0;

  // Manejar formato 12h (am/pm)
  if (timeStr.includes('am') || timeStr.includes('pm')) {
    const isPm = timeStr.includes('pm');
    // Remover am/pm y limpiar
    timeStr = timeStr.replace(/am|pm/g, '').trim();
    const parts = timeStr.split(':');
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1], 10) || 0;

    if (isPm && hours < 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;
  } else {
    // Formato 24h o simple
    const parts = timeStr.split(':');
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1], 10) || 0;
  }

  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
};

const times = ["8:00 am", "10:00 am", "2:00 pm", "14:00", "8:00 pm", "20:00", "12:00 am", "12:00 pm"];
const sorted = times.map(t => ({ original: t, sortable: sortableTime(t) }))
                  .sort((a, b) => a.sortable.localeCompare(b.sortable));

console.log(JSON.stringify(sorted, null, 2));
