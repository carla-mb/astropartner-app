// Return corresponding lunar phase emoji
export function phaseToEmoji(phase: string): string {
  switch (phase) {
    case 'New Moon': return '🌑';
    case 'Waxing Crescent': return '🌒';
    case 'First Quarter': return '🌓';
    case 'Waxing Gibbous': return '🌔';
    case 'Full Moon': return '🌕';
    case 'Waning Gibbous': return '🌖';
    case 'Last Quarter': return '🌗';
    case 'Waning Crescent': return '🌘';
    default: return '❓';
  }
}