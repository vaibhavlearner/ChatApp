//import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp.jsx";
// import { Toaster } from "react-hot-toast";
// import { useAuthContext } from "./context/AuthContext";

function App() {
    return (
        <div className="p-4 h-screen flex items-center justify-center">
            <Home> </Home>
        </div>
    );
}

export default App;
