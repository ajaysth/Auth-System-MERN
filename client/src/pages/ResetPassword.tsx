import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const { backend_url } = useAppContext();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle OTP input change
    const handleChange = (value: string, index: number) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const paste = e.clipboardData.getData("text").slice(0, 6);
        const pasteArray = paste.split("");

        const newOtp = [...otp];

        pasteArray.forEach((char, index) => {
            if (/^[0-9a-zA-Z]$/.test(char)) {
                newOtp[index] = char;
            }
        });

        setOtp(newOtp);
    };

    // Email submit
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backend_url + "/api/auth/send-reset-otp", { email })
            if (data.success) {
                toast.success(data.message)
                setIsEmailSent(true)
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            console.log(err);

        }


    };

    // OTP submit
    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const otpArray = inputRefs.current.map(e => e?.value || "")
        setOtp(otpArray)
        setIsOtpSubmitted(true)
    };

    // Password submit
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        console.log({
            email,
            otpArray: otp,
            finalOtp: otp.join(""),
            newPassword
        });

        e.preventDefault();

        try {
            const finalOtp = otp.join("");   // ✅ FIX HERE

            const { data } = await axios.post(backend_url + "/api/auth/reset-password", { email, otp: finalOtp, resetPassword: newPassword })
            if (data.success) {
                toast.success(data.message)
                navigate("/login");
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err);

        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:p-6 bg-gradient-to-br from-red-300">

            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                className="absolute left-20 md:left-5 top-5 w-32 cursor-pointer md:w-28"
                alt=""
            />

            {/* EMAIL FORM */}
            {!isEmailSent && (
                <form
                    onSubmit={handleEmailSubmit}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96"
                >
                    <h1 className="text-white text-2xl font-semibold mb-4 text-center">
                        Email Verify OTP
                    </h1>
                    <p className="text-center text-indigo-300 mb-6">
                        Please enter your email address.
                    </p>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} className="w-3 h-3" alt="" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email id"
                            className="bg-transparent outline-none text-white w-full"
                            required
                        />
                    </div>

                    <button className="w-full text-lg text-white py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full active:scale-90 duration-200 cursor-pointer">
                        Send OTP
                    </button>
                </form>
            )}

            {/* OTP FORM */}
            {isEmailSent && !isOtpSubmitted && (
                <form
                    onSubmit={handleOtpSubmit}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96"
                >
                    <h1 className="text-white text-2xl font-semibold mb-4 text-center">
                        Reset Password OTP
                    </h1>
                    <p className="text-center text-indigo-300 mb-6">
                        Enter the 6-digit code sent to your email.
                    </p>

                    <div
                        className="flex justify-between mb-8"
                        onPaste={handlePaste}
                    >
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                            />
                        ))}
                    </div>

                    <button className="w-full text-lg text-white py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full active:scale-90 duration-200 cursor-pointer">
                        Verify OTP
                    </button>
                </form>
            )}

            {/* NEW PASSWORD FORM */}
            {isEmailSent && isOtpSubmitted && (
                <form
                    onSubmit={handlePasswordSubmit}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96"
                >
                    <h1 className="text-white text-2xl font-semibold mb-4 text-center">
                        New Password
                    </h1>
                    <p className="text-center text-indigo-300 mb-6">
                        Enter your new password.
                    </p>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.lock_icon} className="w-3 h-3" alt="" />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            className="bg-transparent outline-none text-white w-full"
                            required
                        />
                    </div>

                    <button className="w-full text-lg text-white py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full active:scale-90 duration-200 cursor-pointer">
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;