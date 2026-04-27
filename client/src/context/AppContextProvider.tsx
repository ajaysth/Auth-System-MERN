import { useEffect, useState, type ReactNode } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";

type AppContextProviderProps = {
    children: ReactNode;
};

type UserData = {
    name?: string;
    email?: string;
    password?: string;
    isAccountVerified?: boolean;
} | null;

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userdata, setUserdata] = useState<UserData>(null);

    const getUserAuthenticatedState = async () => {
        try {
            const { data } = await axios.get(backend_url + "/api/auth/isAuthenticated", {
                withCredentials: true
            })
            if (data.success) {
                setIsLoggedIn(true)
                await getUserData()
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || err.message)
            } else if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Unknown error occurred")
            }
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backend_url + "/api/userData", {
                withCredentials: true
            })
            if (data.success) {
                console.log(data)
                setUserdata(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            await getUserAuthenticatedState()
        }

        checkAuth()
    }, [])

    const value = {
        getUserData,
        backend_url,
        isLoggedIn,
        setIsLoggedIn,
        userdata,
        setUserdata,
        getUserAuthenticatedState
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};