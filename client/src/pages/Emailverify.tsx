import { useNavigate } from 'react-router-dom'
import { assets } from "../assets/assets"
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useAppContext } from '../context/useAppContext';
import { toast } from 'react-toastify';


const Emailverify = () => {
    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);
    const { backend_url, isLoggedIn, getUserData, userdata } = useAppContext()
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate()

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move to next box
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const paste = e.clipboardData.getData("text");
        const pasteArray = paste.split("");

        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index]!.value = char;
            }
        });
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e?.value)
            const otp = otpArray.join("")
            const { data } = await axios.post(backend_url + "/api/auth/verify-email", {
                otp
            })

            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate("/")
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            console.log(err);

        }

    }

    useEffect(() => {
        if (isLoggedIn && userdata && userdata.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedIn, userdata]);
    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:p-6 bg-gradient-to-br from-red-300">
            <img onClick={() => navigate("/")} src={assets.logo} className="absolute left-20 md:left-5 top-5 w-32 cursor-pointer md:w-28" alt="" />


            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96">
                <h1 className='text-white text-2xl font-semibold mb-4 text-center'>Email Verify Otp</h1>
                <p className='text-center text-indigo-300 mb-6'>Please enter 6-digit code sent to your email address.</p>

                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {otp.map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                            type="text"
                            maxLength={1}
                            value={otp[index]}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <button className='w-full text-lg text-white py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full active:scale-90 duration-200 cursor-pointer'>Verify Email</button>
            </form>
        </div>
    )
}

export default Emailverify

// className = 'w-12 h-12 bg-[#333A5C] text-white text-center text-xl  rounded-md' 