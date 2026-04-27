import { assets } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'

const Header = () => {
    const { userdata } = useAppContext()
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />
            <h1 className='flex items-center gap-3 text-3xl md:text-xl font-medium mb-2'>Aeyoo,{userdata ? userdata.name : "Brother"}.
                <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
            </h1>
            <h2 className='text-5xl md:text-3xl font-semibold mb-4'>Welcome to my portal</h2>
            <p className='mb-8 max-w-md'>Lets just start our journey together. lets beat'em all.</p>


            <button className='bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 cursor-pointer hover:scale-110 transition-ease duration-300'>Get Started</button>
        </div>
    )
}

export default Header