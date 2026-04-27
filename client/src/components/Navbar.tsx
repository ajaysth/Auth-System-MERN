import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {

    const { userdata, backend_url, setUserdata, setIsLoggedIn } = useAppContext()
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logoutHandler = async () => {
        try {
            axios.defaults.withCredentials = true

            const { data } = await axios.post(backend_url + "/api/auth/logout")
            if (data.success) {
                setIsLoggedIn(false)
                setUserdata(null)
                toast.success("Logged out successfully")
            } else {
                console.log(data);

                toast.error("Logout Failed")
            }

        } catch (err) {
            console.log(err);

        }
    }

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true

            const { data } = await axios.post(backend_url + "/api/auth/send-verify-email")

            if (data.success) {
                navigate("/email-verify")
                toast.success(data.message)

            } else {
                toast.error(data.message)
            }

        } catch (err) {
            console.log(err);

        }
    }
    return (
        <div className='w-full flex justify-between items-center p-6 md:p-4 absolute top-0'>
            <img src={assets.logo} alt="Logo" className='w-32 md:w-28' />


            {userdata ?

                <div ref={menuRef} className="relative">
                    {/* Avatar */}
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-semibold cursor-pointer"
                    >
                        {userdata?.name?.[0]?.toUpperCase()}
                    </div>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute top-full right-0 mt-2 bg-white text-black rounded shadow-lg p-2 z-10">
                            <ul>
                                {userdata.isAccountVerified ? null : <li onClick={sendVerificationOtp} className="px-3 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                                    Verify Email
                                </li>}

                                <li onClick={() => logoutHandler()} className="px-3 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>


                :
                <button onClick={() => navigate("/login")} className='flex items-center gap-2 text-lg border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white active:scale-95 cursor-pointer transition-all duration-300'>Login
                    <img src={assets.arrow_icon} alt="Login Icon" />
                </button>}

        </div>
    )
}

export default Navbar