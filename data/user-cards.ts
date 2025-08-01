export interface UserCardData {
  id: string
  profilePicture: string
  name: string
  username: string
  gender: "male" | "female" | "other"
  age: number
  countryCode: string
  spokenLanguageCodes: string[]
  learningLanguageCodes: string[]
  greetingCode: string
}

export const DUMMY_USERS: UserCardData[] = [
  {
    id: "user-card-1",
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Marie Dubois",
    username: "marie.d",
    gender: "female",
    age: 23,
    countryCode: "FR",
    spokenLanguageCodes: ["fr", "en"],
    learningLanguageCodes: ["es", "it"],
    greetingCode: "FR",
  },
  {
    id: "user-card-2",
    profilePicture:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Kenji Tanaka",
    username: "kenji.t",
    gender: "male",
    age: 28,
    countryCode: "JP",
    spokenLanguageCodes: ["ja", "en"],
    learningLanguageCodes: ["zh"],
    greetingCode: "JP",
  },
  {
    id: "user-card-3",
    profilePicture:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Sophia Müller",
    username: "sophia.m",
    gender: "female",
    age: 25,
    countryCode: "DE",
    spokenLanguageCodes: ["de", "en"],
    learningLanguageCodes: ["fr"],
    greetingCode: "DE",
  },
  {
    id: "user-card-4",
    profilePicture:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "David Lee",
    username: "david.l",
    gender: "male",
    age: 30,
    countryCode: "KR",
    spokenLanguageCodes: ["ko", "en"],
    learningLanguageCodes: ["ja"],
    greetingCode: "KR",
  },
  {
    id: "user-card-5",
    profilePicture:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Isabella Costa",
    username: "isabella.c",
    gender: "female",
    age: 22,
    countryCode: "BR",
    spokenLanguageCodes: ["pt", "en"],
    learningLanguageCodes: ["es"],
    greetingCode: "BR",
  },
  {
    id: "user-card-6",
    profilePicture:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Liam Smith",
    username: "liam.s",
    gender: "male",
    age: 27,
    countryCode: "GB",
    spokenLanguageCodes: ["en"],
    learningLanguageCodes: ["de", "fr"],
    greetingCode: "GB",
  },
  {
    id: "user-card-7",
    profilePicture:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Chloe Brown",
    username: "chloe.b",
    gender: "female",
    age: 24,
    countryCode: "US",
    spokenLanguageCodes: ["en", "es"],
    learningLanguageCodes: ["ja"],
    greetingCode: "US",
  },
  {
    id: "user-card-8",
    profilePicture:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Arjun Singh",
    username: "arjun.s",
    gender: "male",
    age: 29,
    countryCode: "IN",
    spokenLanguageCodes: ["hi", "en"],
    learningLanguageCodes: ["fr"],
    greetingCode: "IN",
  },
  {
    id: "user-card-9",
    profilePicture:
      "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Olivia White",
    username: "olivia.w",
    gender: "female",
    age: 26,
    countryCode: "AU",
    spokenLanguageCodes: ["en"],
    learningLanguageCodes: ["es", "pt"],
    greetingCode: "AU",
  },
  {
    id: "user-card-10",
    profilePicture:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Noah Taylor",
    username: "noah.t",
    gender: "male",
    age: 31,
    countryCode: "CA",
    spokenLanguageCodes: ["en", "fr"],
    learningLanguageCodes: ["de"],
    greetingCode: "CA",
  },
  {
    id: "user-card-11",
    profilePicture:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Yuki Sato",
    username: "yuki.s",
    gender: "female",
    age: 24,
    countryCode: "JP",
    spokenLanguageCodes: ["ja"],
    learningLanguageCodes: ["en", "ko"],
    greetingCode: "JP",
  },
  {
    id: "user-card-12",
    profilePicture:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Carlos Rodriguez",
    username: "carlos.r",
    gender: "male",
    age: 29,
    countryCode: "ES", // Assuming Spain for Spanish speaker
    spokenLanguageCodes: ["es"],
    learningLanguageCodes: ["en", "fr"],
    greetingCode: "ES", // Need to add ES to greetings if not there
  },
  {
    id: "user-card-13",
    profilePicture:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Lena Schmidt",
    username: "lena.s",
    gender: "female",
    age: 26,
    countryCode: "DE",
    spokenLanguageCodes: ["de", "en"],
    learningLanguageCodes: ["es"],
    greetingCode: "DE",
  },
  {
    id: "user-card-14",
    profilePicture:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Min-jun Kim",
    username: "minjun.k",
    gender: "male",
    age: 33,
    countryCode: "KR",
    spokenLanguageCodes: ["ko"],
    learningLanguageCodes: ["en", "zh"],
    greetingCode: "KR",
  },
  {
    id: "user-card-15",
    profilePicture:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Camila Silva",
    username: "camila.s",
    gender: "female",
    age: 21,
    countryCode: "BR",
    spokenLanguageCodes: ["pt"],
    learningLanguageCodes: ["en", "es"],
    greetingCode: "BR",
  },
]

