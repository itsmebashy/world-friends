export interface Country {
  code: string
  name: string
  flag: string
}

export interface Language {
  code: string
  name: string
}

export interface Hobby {
  id: string
  name: string
  emoji: string
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
]

export const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "de", name: "German" },
  { code: "zh", name: "Mandarin Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
]

export const HOBBIES: Hobby[] = [
  { id: "reading", name: "Reading", emoji: "📚" },
  { id: "writing", name: "Writing", emoji: "✍️" },
  { id: "cooking", name: "Cooking", emoji: "🍳" },
  { id: "traveling", name: "Traveling", emoji: "✈️" },
  { id: "photography", name: "Photography", emoji: "📸" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "dancing", name: "Dancing", emoji: "💃" },
  { id: "sports", name: "Sports", emoji: "⚽" },
  { id: "gaming", name: "Gaming", emoji: "🎮" },
  { id: "art", name: "Art & Drawing", emoji: "🎨" },
  { id: "movies", name: "Movies & TV", emoji: "🎬" },
  { id: "hiking", name: "Hiking", emoji: "🥾" },
  { id: "yoga", name: "Yoga", emoji: "🧘" },
  { id: "meditation", name: "Meditation", emoji: "🕯️" },
  { id: "gardening", name: "Gardening", emoji: "🌱" },
  { id: "technology", name: "Technology", emoji: "💻" },
  { id: "learning", name: "Learning Languages", emoji: "🗣️" },
  { id: "volunteering", name: "Volunteering", emoji: "🤝" },
  { id: "fitness", name: "Fitness", emoji: "💪" },
  { id: "crafts", name: "Arts & Crafts", emoji: "🎭" },
]

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find((country) => country.code === code)
}

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find((language) => language.code === code)
}

export const getHobbyById = (id: string): Hobby | undefined => {
  return HOBBIES.find((hobby) => hobby.id === id)
}

