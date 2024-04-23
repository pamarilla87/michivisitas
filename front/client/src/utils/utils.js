/**
 * Formats a date string into "DD-MM-YYYY" format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date.
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const formatDateToDDMMYYYY = (isoDateString) => {
    // Extract the date part (before the 'T')
    const datePart = isoDateString.split('T')[0]; // Gets '2024-05-01' from '2024-05-01T00:00:00.000+00:00'
    
    // Split the date part into components
    const [year, month, day] = datePart.split('-'); // Splits '2024-05-01' into ['2024', '05', '01']
    
    // Return in DD-MM-YYYY format
    return `${day}-${month}-${year}`; // Returns '01-05-2024'
};

export const calculateAdditionalData = (data) => {
    const startDate = new Date(data.fechaDesde);
    const endDate = new Date(data.fechaHasta);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { error: 'Invalid date formats' };
    }

    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const visitsPerDay = parseInt(data.visitasPorDia, 10) || 0;
    const totalVisits = data.frecuenciaVisita === 'Todos los días'
        ? totalDays * visitsPerDay
        : totalDays * 0.5 * visitsPerDay;
    const totalHours = totalVisits * (parseFloat(data.tipoServicio) || 0);

    return {
        totalDias: totalDays,
        totalVisitas: totalVisits,
        totalHoras: totalHours
    };
};