import type { ProfileData } from './profile'

export interface UserDetailsData extends ProfileData {
  isFriend: boolean
}

// Mock user details data for different users
export const USER_DETAILS: Record<string, UserDetailsData> = {
  "user-card-1": {
    id: "user-card-1",
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Marie Dubois",
    username: "marie.d",
    gender: "female",
    age: 23,
    countryCode: "FR",
    aboutMe: "Bonjour! I'm a French student passionate about languages and cultures. I love traveling, cooking traditional French dishes, and meeting people from around the world. Currently studying international relations and hoping to work in diplomacy.",
    spokenLanguageCodes: ["fr", "en"],
    learningLanguageCodes: ["es", "it"],
    visitedCountryCodes: ["FR", "ES", "IT", "GB", "DE"],
    wantToVisitCountryCodes: ["JP", "BR", "AU", "US"],
    favoriteBooks: [
      {
        id: "book-marie-1",
        title: "L'Étranger",
        author: "Albert Camus"
      },
      {
        id: "book-marie-2",
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry"
      },
      {
        id: "book-marie-3",
        title: "Madame Bovary",
        author: "Gustave Flaubert"
      }
    ],
    isFriend: false
  },
  "user-card-2": {
    id: "user-card-2",
    profilePicture: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Kenji Tanaka",
    username: "kenji.t",
    gender: "male",
    age: 28,
    countryCode: "JP",
    aboutMe: "こんにちは! I'm a software engineer from Tokyo who loves learning about different cultures through language exchange. I enjoy anime, traditional Japanese arts, and exploring new technologies. Always excited to share Japanese culture with friends from around the world.",
    spokenLanguageCodes: ["ja", "en"],
    learningLanguageCodes: ["zh"],
    visitedCountryCodes: ["JP", "KR", "CN", "US"],
    wantToVisitCountryCodes: ["FR", "IT", "BR", "AU", "IN"],
    favoriteBooks: [
      {
        id: "book-kenji-1",
        title: "Norwegian Wood",
        author: "Haruki Murakami"
      },
      {
        id: "book-kenji-2",
        title: "The Book of Tea",
        author: "Kakuzo Okakura"
      },
      {
        id: "book-kenji-3",
        title: "Shogun",
        author: "James Clavell"
      }
    ],
    isFriend: true
  },
  "user-card-3": {
    id: "user-card-3",
    profilePicture: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    name: "Sophia Müller",
    username: "sophia.m",
    gender: "female",
    age: 25,
    countryCode: "DE",
    aboutMe: "Hallo! I'm a German architecture student with a passion for sustainable design and cultural preservation. I love hiking in the Alps, visiting museums, and learning about different architectural styles around the world.",
    spokenLanguageCodes: ["de", "en"],
    learningLanguageCodes: ["fr"],
    visitedCountryCodes: ["DE", "FR", "IT", "AT", "CH"],
    wantToVisitCountryCodes: ["JP", "BR", "IN", "EG"],
    favoriteBooks: [
      {
        id: "book-sophia-1",
        title: "The Architecture of Happiness",
        author: "Alain de Botton"
      },
      {
        id: "book-sophia-2",
        title: "Faust",
        author: "Johann Wolfgang von Goethe"
      }
    ],
    isFriend: false
  }
}

export const getUserDetails = (userId: string): UserDetailsData | undefined => {
  return USER_DETAILS[userId]
}
