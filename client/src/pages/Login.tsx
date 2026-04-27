import { useState } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"
import { useAppContext } from "../context/useAppContext";
import type { FormEvent } from "react";

const Login = () => {
    const navigate = useNavigate()
    const { backend_url, setIsLoggedIn, getUserData } = useAppContext()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [state, setState] = useState("Sign Up")


    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {

            axios.defaults.withCredentials = true
            if (state === "Sign Up") {
                const { data } = await axios.post(`${backend_url}/api/auth/register`, {
                    name, email, password
                })

                if (data.success) {
                    setIsLoggedIn(true)
                    await getUserData()
                    toast.success("Registered successfully")
                    navigate("/")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backend_url}/api/auth/login`, {
                    email, password
                })

                if (data.success) {

                    setIsLoggedIn(true)
                    await getUserData()
                    toast.success("LoggedIn successfully")
                    navigate("/")
                } else {
                    toast.error(data.message)
                }

            }


        } catch (err) {
            console.log(err)
            if (err instanceof Error) {
                toast.error(err.message);
            } else if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Server error");
            } else {
                toast.error("Something went wrong");
            }
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:p-6 bg-gradient-to-br from-red-300">
            <img onClick={() => navigate("/")} src={assets.logo} className="absolute left-20 md:left-5 top-5 w-32 cursor-pointer md:w-28" alt="" />

            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-96 md:w-150 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === "Sign Up" ? "Sign Up" : "Login"}</h2>
                <p className="text-lg text-white text-center mb-6">{state === "Sign Up" ? "Create a new account" : "Welcome back! Please enter your details"}</p>

                <form onSubmit={onSubmitHandler}>

                    {state === "Sign Up" && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                            <img src={assets.person_icon} alt="" />
                            <input onChange={e => setName(e.target.value)} className="bg-transparent text-white placeholder-gray-400 outline-none w-full" value={name} type="text" placeholder="Enter your name" required />
                        </div>
                    )}
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)} className="bg-transparent text-white placeholder-gray-400 outline-none w-full" value={email} type="email" placeholder="Enter your email address" required />
                    </div>


                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)} className="bg-transparent text-white placeholder-gray-400 outline-none w-full" value={password} type="password" placeholder="Enter your password" required />
                    </div>

                    <p onClick={() => navigate("/reset-password")} className="text-right text-white hover:underline cursor-pointer">Forgot Password?</p>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xl cursor-pointer text-white font-bold py-4 px-4 rounded-full mt-4">
                        {state === "Sign Up" ? "Sign Up" : "Login"}
                    </button>
                </form>

                {state === "Sign Up" ? (
                    <p className="text-gray-400 text-center text-xs mt-4">Already have an account? <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => setState("Login")}>Login</span></p>
                ) : (
                    <p className="text-gray-400 text-center text-xs mt-4">Don't have an account? <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => setState("Sign Up")}>Sign Up</span></p>
                )}

            </div>




        </div>
    )
}

export default Login