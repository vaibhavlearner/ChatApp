import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({
        fullName,
        username,
        password,
        confirmPassword,
        gender,
    }) => {
        const success = handleInputErrors({
            fullName,
            username,
            password,
            confirmPassword,
            gender,
        });

        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    username,
                    password,
                    confirmPassword,
                    gender,
                }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // local storage
            localStorage.setItem("chat-user", JSON.stringify(data)); //
            setAuthUser(data); //authenticated h abhi coz added in local storage, will remove from local storage while log out
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return { loading, signup };
};
export default useSignup;

function handleInputErrors({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}) {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in the fields");
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwrods do not match");
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must be of atleast 6 characters");
        return false;
    }
    return true;
}
