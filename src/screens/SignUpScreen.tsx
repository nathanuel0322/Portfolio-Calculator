import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/css/signupscreen.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function SignupScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="authdiv">
            <p className="authtitle">NCP's Portfolio Calculator</p>
            <p id="createacc" className="text-white">
                Create an Account
            </p>
            <div className="flex flex-col items-center justify-center">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email-address"
                    autoCapitalize="none"
                    autoCorrect="false"
                />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="buttons !px-4 py-[.375rem]"
                    onClick={async () => {
                        if (password !== confirmPassword) {
                            toast.error("Passwords do not match!", {
                                position: toast.POSITION.TOP_CENTER,
                                theme: "colored",
                            });
                            return;
                        }
                        await createUserWithEmailAndPassword(auth, email, password)
                            .then(async () => {
                                toast.success("Signed in!.", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored",
                                });
                            })
                            .catch((error) => {
                                if (error.code === "auth/email-already-in-use") {
                                    toast.error("The email address is already in use!", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/invalid-email") {
                                    toast.error("The email address is invalid!", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/operation-not-allowed") {
                                    toast.error("Sorry, you can't do that right now.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                                if (error.code === "auth/weak-password") {
                                    toast.error("Please create a stronger password.", {
                                        position: toast.POSITION.TOP_CENTER,
                                        theme: "colored",
                                    });
                                }
                            });
                    }}
                >
                    Sign Up
                </button>
            </div>
            <p className="mt-4 font-medium text-white">Already have an account?</p>
            <button id="signinbutton" className="buttons" onClick={() => navigate("/signin")} type="button">
                Sign In
            </button>
        </div>
    );
}
