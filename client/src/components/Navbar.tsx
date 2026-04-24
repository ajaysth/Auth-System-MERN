import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
const Navbar = () => {

    const navigate = useNavigate()
    return (
        <div className='w-full flex justify-between items-center p-6 md:p-4 absolute top-0'>
            <img src={assets.logo} alt="Logo" className='w-32 md:w-28' />

            <button onClick={() => navigate("/login")} className='flex items-center gap-2 text-lg border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white active:scale-95 cursor-pointer transition-all duration-300'>Login
                <img src={assets.arrow_icon} alt="Login Icon" />
            </button>
        </div>
    )
}

export default Navbar