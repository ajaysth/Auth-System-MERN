import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type UserData = {
    name?: string;
    email?: string;
    password?: string
    isAccountVerified?: boolean;

} | null;

export type AppContextType = {
    backend_url: string;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    userdata: UserData;
    setUserdata: Dispatch<SetStateAction<UserData>>;
    getUserData: () => Promise<void>
    getUserAuthenticatedState: () => Promise<void>
};

export const AppContext = createContext<AppContextType | null>(null);