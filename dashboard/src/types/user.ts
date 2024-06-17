import { Profile } from "./profile";

export type User = {
     id: number;
     username: string;
     email: string;
     role: string;
     profile: Profile;
     isEmailConfirmed: boolean;
     lst_login: Date;
     created_at: Date;
}