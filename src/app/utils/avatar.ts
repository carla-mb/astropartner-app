// Get correct avatar or use the default one
export function getUserAvatar(zodiacSign?: string): string {
  return zodiacSign
    ? `/assets/images/zodiac/${zodiacSign}.png`
    : '/assets/images/icons/avatar.png'; 
}
