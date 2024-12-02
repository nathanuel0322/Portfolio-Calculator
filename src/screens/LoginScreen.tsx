import { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "../assets/css/signupscreen.css";

export default function LoginScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="authdiv">
            <p className="authtitle">NCP's Portfolio Calculator</p>
            <p id="createacc" className="text-white">
                Login
            </p>
            <div id="loginform" className="authform flex flex-col items-center">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email-address"
                    autoCapitalize="none"
                />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button
                    className="buttons"
                    onClick={async (e) => {
                        e.preventDefault();
                        await signInWithEmailAndPassword(auth, email, password)
                            .then(() => {
                                toast.success("Signed in!", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored",
                                });
                                return true;
                            })
                            .catch((error) => {
                                if (error.code === "auth/invalid-email") {
                                    toast.error("The email address is invalid.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/user-not-found") {
                                    toast.error("There is no user account linked to this email!", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/wrong-password") {
                                    toast.error("Incorrect password! Please try again.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/user-disabled") {
                                    toast.error("This user is currently disabled.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                } else if (error.code === "auth/missing-email") {
                                    toast.error("Please enter an email address.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                } else if (error.code === "auth/missing-password") {
                                    toast.error("Please enter a password.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                return false;
                            });
                    }}
                >
                    Sign In
                </button>
            </div>

            <button
                className="buttons"
                onClick={async () =>
                    await sendPasswordResetEmail(auth, email)
                        .then(() => {
                            if (email.includes("@") && email.includes(".com")) {
                                toast.info("Your password reset has been sent to your email.", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored",
                                });
                            } else {
                                toast.error("Please enter a valid email.", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored",
                                });
                            }
                        })
                        .catch((e) => {
                            if (e.code === "auth/invalid-email") {
                                toast.error("Please enter a valid email.", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored",
                                });
                            }
                        })
                }
            >
                Forgot Password?
            </button>

            <button className="buttons" onClick={() => navigate("/")}>
                Don't have an account? Create here
            </button>
        </div>
    );
}
