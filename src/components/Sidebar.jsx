import { FaHome } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineDesignServices } from "react-icons/md";
import { GoPeople } from "react-icons/go";

function Sidebar() {
  return (
    <div className='h-screen w-1/4 bg-[#EB6B9D] py-4 text-white flex flex-col'>
      <div className='flex px-9'>
        <img src='/public/assets/images/logoupride.svg' />
        <img src='/public/assets/images/textlogo.svg' />
      </div>
      <ul className='mt-4'>
        <li className='flex gap-7 items-center py-5 s-active px-9'>
          <FaHome />
          <span>Home</span>
        </li>
        <li className='flex gap-7 items-center py-5 px-9'>
          <GiTakeMyMoney />
          <span>My Earning</span>
        </li>
        <li className='flex gap-7 items-center py-5 px-9'>
          <MdOutlineDesignServices />
          <span>My Services</span>
        </li>
        <li className='flex gap-7 items-center py-5 px-9'>
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
