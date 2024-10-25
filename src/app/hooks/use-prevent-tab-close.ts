import { useEffect } from 'react';

export const usePreventTabClose = () => {
  useEffect(() => {
    // Función para manejar el evento de cerrar o recargar la pestaña
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Requerido para mostrar la alerta en algunos navegadores
    };

    // Agregar el evento cuando el componente se monta
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
