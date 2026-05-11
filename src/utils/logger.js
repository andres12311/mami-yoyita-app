/**
 * Logger condicional que solo muestra errores detallados en desarrollo.
 * En producción, oculta stack traces para evitar filtrar información interna.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  error: (message, error) => {
    if (isDev) {
      console.error(message, error);
    } else {
      console.error(message); // Sin stack trace en producción
    }
  },
  warn: (message) => {
    if (isDev) console.warn(message);
  },
  info: (message) => {
    if (isDev) console.log(message);
  }
};
