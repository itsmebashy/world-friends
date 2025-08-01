export interface CountryGreeting {
  countryCode: string
  greeting: string
  emoji: string
  color: string
}

export const COUNTRY_GREETINGS: CountryGreeting[] = [
  { countryCode: "US", greeting: "Hello!", emoji: "🗽", color: "#3B82F6" }, // Blue
  { countryCode: "FR", greeting: "Bonjour!", emoji: "🥖", color: "#EF4444" }, // Red
  { countryCode: "JP", greeting: "Kon'nichiwa!", emoji: "🌸", color: "#F59E0B" }, // Amber
  { countryCode: "KR", greeting: "Annyeonghaseyo!", emoji: "🇰🇷", color: "#10B981" }, // Emerald
  { countryCode: "DE", greeting: "Guten Tag!", emoji: "🍺", color: "#6366F1" }, // Indigo
  { countryCode: "GB", greeting: "Cheerio!", emoji: "💂", color: "#EC4899" }, // Pink
  { countryCode: "CA", greeting: "Eh!", emoji: "🍁", color: "#EF4444" }, // Red
  { countryCode: "AU", greeting: "G'day!", emoji: "🦘", color: "#F59E0B" }, // Amber
  { countryCode: "BR", greeting: "Olá!", emoji: "⚽", color: "#10B981" }, // Emerald
  { countryCode: "IN", greeting: "Namaste!", emoji: "🕌", color: "#6366F1" }, // Indigo
]

export const getGreetingByCode = (countryCode: string): CountryGreeting | undefined => {
  return COUNTRY_GREETINGS.find((greeting) => greeting.countryCode === countryCode)
}

