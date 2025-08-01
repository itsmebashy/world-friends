export interface ProfileData {
  id: string
  profilePicture: string
  name: string
  username: string
  gender: "male" | "female" | "other"
  age: number
  countryCode: string
  aboutMe: string
  spokenLanguageCodes: string[]
  learningLanguageCodes: string[]
  visitedCountryCodes: string[]
  wantToVisitCountryCodes: string[]
  favoriteBooks: Book[]
}

export interface Book {
  id: string
  title: string
  author: string
}

// Current user's profile data
export const PROFILE_DATA: ProfileData = {
  id: "current-user",
  profilePicture: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  name: "John Smith",
  username: "john.smith",
  gender: "male",
  age: 28,
  countryCode: "US",
  aboutMe: "Language enthusiast who loves connecting with people from different cultures. Currently learning new languages and planning my next adventure around the world. I enjoy photography, hiking, and discovering local cuisines wherever I go.",
  spokenLanguageCodes: ["en", "fr"],
  learningLanguageCodes: ["es", "de", "ja"],
  visitedCountryCodes: ["US", "FR", "IT", "ES", "DE", "JP"],
  wantToVisitCountryCodes: ["BR", "AU", "TH", "EG", "IN", "NZ"],
  favoriteBooks: [
    {
      id: "book-1",
      title: "The Alchemist",
      author: "Paulo Coelho"
    },
    {
      id: "book-2", 
      title: "Sapiens",
      author: "Yuval Noah Harari"
    },
    {
      id: "book-3",
      title: "Educated", 
      author: "Tara Westover"
    },
    {
      id: "book-4",
      title: "The Power of Now",
      author: "Eckhart Tolle"
    }
  ]
}
