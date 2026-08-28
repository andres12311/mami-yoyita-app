export const formatCurrency = (val) => 
  new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(Number(val) || 0);

export const formatTime12h = (timeStr) => {
  if (!timeStr) return '--:--';
  const str = String(timeStr).trim();
  
  // Si ya tiene AM/PM, lo devolvemos tal cual
  if (str.toLowerCase().includes('am') || str.toLowerCase().includes('pm')) {
    return str.toLowerCase();
  }

  // Intentamos parsear formato HH:mm
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0').substring(0, 2);
    
    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // la hora '0' debe ser '12'
    
    return `${hours}:${minutes} ${ampm}`;
  }

  return timeStr;
};

export const sortableTime = (t) => {
  if (!t) return '99:99';
  let timeStr = t.toString().toLowerCase().trim();
  
  if (!/\d/.test(timeStr)) return '99:99';

  let hours = 0;
  let minutes = 0;

  // Extraer am/pm antes de limpiar
  const isPm = timeStr.includes('pm');
  const isAm = timeStr.includes('am');
  
  // Solo dejar números y separador
  let cleanTime = timeStr.replace(/[^0-9:.]/g, '').trim();
  const parts = cleanTime.split(/[:.]/);
  
  hours = parseInt(parts[0], 10) || 0;
  minutes = parseInt(parts[1], 10) || 0;

  // Lógica de 12 horas
  if (isPm || isAm) {
    if (isPm && hours < 12) hours += 12;
    if (isAm && hours === 12) hours = 0;
  } else if (hours > 0 && hours < 7) {
    // Si no dice am/pm y es una hora como "2" o "2:00", 
    // lo tratamos como PM (14:00) porque es más probable en entregas.
    hours += 12;
  }

  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
};
