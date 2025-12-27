// Colors mapped to each diretoria for calendar event display
export const DIRETORIA_COLORS: Record<string, string> = {
  'Presidência Executiva': '#ef4444', // red
  'Presidência do Conselho': '#f59e0b', // amber
  'VP Negócios': '#10b981', // emerald
  'Operações': '#3b82f6', // blue
  'DDR': '#8b5cf6', // violet
  'Formação Empreendedora': '#ec4899' // pink
};

// Get color for single or multiple diretorias
export function getDiretoriaColor(diretorias: string[]): string {
  if (diretorias.length === 0) {
    return '#6b7280'; // gray for no diretoria
  }
  if (diretorias.length === 1) {
    return DIRETORIA_COLORS[diretorias[0]] || '#6b7280';
  }
  // Multiple diretorias - return a gradient pattern color
  return 'linear-gradient(135deg, ' + 
    diretorias.slice(0, 3).map((d, i) => `${DIRETORIA_COLORS[d] || '#6b7280'} ${i * 50}%`).join(', ') + 
    ')';
}

// Get solid color for multiple diretorias (for text backgrounds)
export function getDiretoriaSolidColor(diretorias: string[]): string {
  if (diretorias.length === 0) {
    return '#6b7280';
  }
  if (diretorias.length === 1) {
    return DIRETORIA_COLORS[diretorias[0]] || '#6b7280';
  }
  // Multiple diretorias - blend colors
  return '#9333ea'; // Purple for multi-diretoria
}

// Get short abbreviation for diretorias display
export function getDiretoriasAbbrev(diretorias: string[]): string {
  if (diretorias.length === 0) return '';
  if (diretorias.length === 1) {
    const abbrevs: Record<string, string> = {
      'Presidência Executiva': 'PX',
      'Presidência do Conselho': 'PC',
      'VP Negócios': 'VP',
      'Operações': 'OP',
      'DDR': 'DD',
      'Formação Empreendedora': 'FE'
    };
    return abbrevs[diretorias[0]] || diretorias[0].substring(0, 2);
  }
  return `${diretorias.length}D`;
}
