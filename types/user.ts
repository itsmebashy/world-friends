/**
 * User-related TypeScript interfaces and types
 */

export interface UserCardData {
  id: string;
  profilePicture: string;
  name: string;
  username: string;
  gender: "male" | "female" | "other";
  age: number;
  countryCode: string;
  spokenLanguageCodes: string[];
  learningLanguageCodes: string[];
  greetingCode: string;
}
