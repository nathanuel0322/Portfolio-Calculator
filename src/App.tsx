import { createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase.js";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/home.css";
import Routing from "./components/global/Routing.js";

export interface User extends FirebaseUser {}

interface AuthContextType {
    user: User | undefined | null;
    setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
    logout: (params?: { isdeleting?: boolean; id?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: () => {},
    logout: async () => {},
});

export default function App() {
    const [user, setUser] = useState<User | undefined | null>(undefined);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout: async () => {
                    await signOut(auth)
                        .then(() =>
                            toast.success("Logged out.", {
                                position: toast.POSITION.TOP_CENTER,
                                theme: "colored",
                            })
                        )
                        .catch((error) => {
                            toast.error(error, {
                                position: toast.POSITION.TOP_CENTER,
                                theme: "colored",
                            });
                        });
                },
            }}
        >
            <Routing />
            <ToastContainer />
        </AuthContext.Provider>
    );
}
