import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import { AuthContext } from "../../App.js";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../screens/Home.js";
import SignupScreen from "../../screens/SignUpScreen.js";
import PastSearches from "../../screens/PastSearches.js";
import LoginScreen from "../../screens/LoginScreen.js";
import Results from "../../screens/Results.js";
import { PuffLoader } from "react-spinners";
import "../../assets/css/routing.css";

export default function Routing() {
    const { user, setUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            // console.log("user in onAuthStateChanged", user);
            setUser(user);
            setIsLoading(false);
        });
    }, []);

    // useEffect(() => {
    //     if (user) setIsLoading(false);
    // }, [user]);

    if (isLoading) {
        return <PuffLoader color="white" loading={true} size={150} className="loader" />;
    }

    return (
        <Routes>
            <Route path="/" element={user ? <Home /> : <SignupScreen />} />
            <Route path="/signin" element={user ? <Navigate to="/" /> : <LoginScreen />} />
            {/* <Route path="/signup" element={<SignupScreen />} /> */}
            <Route path="/pastsearches" element={<PastSearches />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
