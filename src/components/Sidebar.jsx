import { FaHome } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineDesignServices } from "react-icons/md";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { useState } from "react";
import MainLogo from "../assets/images/logoupride.svg";
import TextLogo from "../assets/images/textlogo.svg";
import SidebarCollapse from "../assets/images/sidebarcollapse.svg";

function Sidebar() {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className='h-screen w-1/4 bg-gradient-to-b from-[#EB6B9D] to-[#FF5757B2] py-4 text-white flex-col hidden lg:flex'>
      <div className='flex px-9'>
        <img src={MainLogo} />
        <img src={TextLogo} />
      </div>

      <div className='w-full text-black px-9 mt-12 mb-5'>
        <div className='bg-white shadow p-3 rounded-2xl'>
          <div className='flex items-center gap-3 '>
            <img src={SidebarCollapse} alt='sidebar collapse' />
            <span>Rajarajeshwari Nagar</span>
            {collapse ? (
              <AiFillCaretUp className='text-[#EB6B9D] ml-auto' onClick={() => setCollapse(p => !p)} />
            ) : (
              <AiFillCaretDown className='text-[#EB6B9D] ml-auto' onClick={() => setCollapse(p => !p)} />
            )}
          </div>
          {!collapse && (
            <div>
              <div className='border-b flex justify-between py-2'>
                <span className='px-6 text-light text-xs text-gray-400'>Branch 2</span>
                <input type='radio' className='accent-[#EB6B9D]' />
              </div>
              <div className='flex justify-between py-2'>
                <span className='px-6 text-light text-xs text-gray-400'>Branch 3</span>
                <input type='radio' className='accent-[#EB6B9D]' />
              </div>
            </div>
          )}
        </div>
      </div>

      <ul className='mt-4'>
        <li className='flex gap-7 items-center py-4 s-active px-9 text-xl cursor-pointer'>
          <FaHome />
          <span>Home</span>
        </li>
        <li className='flex gap-7 items-center py-4 px-9 text-xl cursor-pointer'>
          <GiTakeMyMoney />
          <span>My Earning</span>
        </li>
        <li className='flex gap-7 items-center py-4 px-9 text-xl cursor-pointer'>
          <MdOutlineDesignServices />
          <span>My Services</span>
        </li>
        <li className='flex gap-7 items-center py-4 px-9 text-xl cursor-pointer'>
          <GoPeople />
          <span>My Assets</span>
        </li>
      </ul>
      <div className='px-9 mt-auto'>
        <div className='bg-[#D9D9D9] h-36'></div>
      </div>
    </div>
  );
}

export default Sidebar;
