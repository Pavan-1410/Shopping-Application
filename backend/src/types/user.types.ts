export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

export interface AppUser {      //interface here is a TypeScript way to describe the shape of an object.
  user_id: number;              // here AppUser is object of the mention type
  firebase_uid: string;         // consider it as class
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: Date;
}

