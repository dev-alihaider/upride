import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { FaSearch, FaPlus, FaHome } from "react-icons/fa";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import ViewBooking from "../assets/images/bookings.svg";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineDesignServices } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import MainLogo from "../assets/images/logoupride.svg";
import TextLogo from "../assets/images/textlogo.svg";
import SidebarCollapse from "../assets/images/sidebarcollapse.svg";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const itemsPerPage = 10; // Number of items per page
  const [currentBookings, setCurrentBooking] = useState([]);
  const [filteredCurrentBooking, setFilteredCurrentBooking] = useState([]);
  const [isMenu, setIsMenu] = useState(false);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://upride-internships-default-rtdb.firebaseio.com/.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const onlineBookings = data.online_bookings || {};
        const offlineBookings = data.offline_bookings || {};

        const onlineBookingsArray = Object.values(onlineBookings);
        const active = onlineBookingsArray.filter(booking => booking.bookingStatus === "SUCCESS");
        const completed = onlineBookingsArray.filter(booking => booking.bookingStatus === "COMPLETED");
        const cancelled = onlineBookingsArray.filter(booking => booking.bookingStatus === "CANCELLED");

        const allActiveBookings = [...active, ...Object.values(offlineBookings)];
        allActiveBookings.sort((a, b) => a.bookingEpochTime - b.bookingEpochTime);

        completed.sort((a, b) => a.bookingEpochTime - b.bookingEpochTime);
        cancelled.sort((a, b) => a.bookingEpochTime - b.bookingEpochTime);

        setBookings(allActiveBookings);
        setActiveBookings(active);
        setCompletedBookings(completed);
        setCancelledBookings(cancelled);
        setCurrentBooking(active.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = tab => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const getFilteredBookings = () => {
    switch (selectedTab) {
      case "active":
        return activeBookings;
      case "completed":
        return completedBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return [];
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const current = useMemo(() => getFilteredBookings().slice(indexOfFirstItem, indexOfLastItem), [indexOfLastItem, indexOfFirstItem]);

  useEffect(() => {
    setCurrentBooking(current);
    setFilteredCurrentBooking(current);
  }, [current]);

  const totalPages = Math.ceil(getFilteredBookings().length / itemsPerPage);

  const renderPaginationControls = () => (
    <div className='pagination-controls flex justify-center items-center gap-6 pt-2'>
      <button onClick={() => setCurrentPage(prevPage => prevPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? "font-bold" : ""}>
          {index + 1}
        </button>
      ))}
      <button onClick={() => setCurrentPage(prevPage => prevPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );

  // Handle search input change
  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  // Filter bookings based on search query
  useEffect(() => {
    const filtered = currentBookings.filter(booking => booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredCurrentBooking(filtered);
  }, [searchQuery, selectedTab, bookings, current]);

  return (
    <>
      <div className='px-8 py-4 shadow text-white flex gap-2 md:gap-4 items-center'>
        <div className='text-black text-3xl block lg:hidden cursor-pointer' onClick={() => setIsMenu(true)}>
          <RxHamburgerMenu />
        </div>
        <div className='border shadow rounded-3xl py-1 pr-2 ml-auto md:ml-0 pl-4 flex items-center w-max cursor-pointer'>
          <input
            type='text'
            placeholder='Search booking'
            value={searchQuery}
            onChange={handleSearchChange}
            className='text-black focus:outline-none placeholder:text-[#0000002B] placeholder:text-lg  md:w-[250px]'
          />
          <div className='bg-gradient-to-r from-[#FB8085] to-[#FF5757] md:from-[#FF5757] md:to-[#FF575700] flex justify-center items-center p-2 rounded-full'>
            <FaSearch />
          </div>
        </div>
        <div className='border shadow rounded-3xl p-3 md:py-2 md:px-6 items-center w-max bg-gradient-to-r from-[#FB8085] to-[#FF5757] flex cursor-pointer'>
          <FaPlus className='md:mr-4' />
          <span className='hidden md:block'>New Booking</span>
        </div>
        <div className='border border-[#0000001A] shadow rounded-3xl py-1 px-2 items-center ml-auto gap-2 w-40 hidden lg:flex '>
          <div className='h-[30px] aspect-square border rounded-full overflow-hidden'></div>
          <span className='text-black text-sm whitespace-nowrap'>Hello Name!</span>
        </div>
      </div>
      <div className='p-2 md:py-9 md:px-11 w-full lg:w-5/6 overflow-hidden'>
        {isMenu && (
          <div className='absolute h-full w-full right-0 top-0 bg-[#000000cc] z-10'>
            <div className='h-screen w-3/4 bg-gradient-to-b from-[#EB6B9D] to-[#EB6B9D] py-4 text-white flex-col relative'>
              <div className='flex px-9'>
                <img src={MainLogo} />
                <img src={TextLogo} />
              </div>
              <div className='absolute right-[-50px] bg-white p-2 rounded-full top-6 text-black cursor-pointer' onClick={() => setIsMenu(false)}>
                <RxCross2 />
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
            </div>
          </div>
        )}

        <div className='flex gap-6 p-3 md:p-0'>
          <h2 className='text-[#000000D9] text-2xl'>View Bookings</h2>
          <img src={ViewBooking} alt='Bookings' />
          <div className='h-9 aspect-square ml-auto bg-[#d9d9d9]'></div>
        </div>
        <ul className='flex justify-between sm:justify-normal sm:gap-12 mt-8 border-b mb-6'>
          <li className={`${selectedTab === "active" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("active")}>
            <span className='text-gray-600 p-3 block'>Active</span>
          </li>
          <li className={`${selectedTab === "completed" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("completed")}>
            <span className='text-gray-600 p-3 block'>Completed </span>
          </li>
          <li className={`${selectedTab === "cancelled" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("cancelled")}>
            <span className='text-gray-600 p-3 block'>Cancelled </span>
          </li>
          <li className='ml-auto hidden md:block'>
            <span className='text-xs font-light text-gray-500'>Page {currentPage}</span>
          </li>
        </ul>
        <div className='overflow-auto'>
          <table className='rounded-xl block min-w-[800px] overflow-auto'>
            <thead className='block w-full'>
              <tr className='bg-[#D9D9D94D] shadow flex'>
                <th className='text-xs py-2 font-semibold px-6 grow'>Name</th>
                <th className='text-xs py-2 font-semibold  px-6 grow'>Date</th>
                <th className='text-xs py-2 font-semibold px-6 grow'>Package Details</th>
                <th className='text-xs py-2 font-semibold px-6 grow'>Payment mode</th>
              </tr>
            </thead>
            <tbody className='block border-x overflow-auto max-h-96'>
              {filteredCurrentBooking.map((booking, index) => (
                <tr key={index} className='font-light flex'>
                  <td className='text-sm py-3  px-6 flex items-center gap-2 w-[200px] overflow-auto grow'>
                    <div className='h-7 aspect-square border rounded-full overflow-hidden'>
                      <img src={booking.workshopImage} alt={booking.workshopTitle} />
                    </div>
                    <strong className='text-black text-xm whitespace-nowrap'>{booking.clientName}</strong>
                  </td>
                  <td className='text-xs py-3 px-6 w-[200px] grow'>{format(new Date(booking.bookingEpochTime), "MMM dd, yyyy HH:mm")}</td>
                  <td className='text-xs py-3 px-6 w-[200px] grow'>{booking.packageTitle}</td>
                  <td className='text-xs py-3 px-6 w-[200px] grow'>
                    <span
                      className={`${
                        booking.offlineBooking ? "bg-[#FFCA28]" : "bg-[#35DBA2]"
                      } text-white p-0.5 px-3 rounded-xl w-full block whitespace-nowrap text-center`}>
                      {booking.paymentMode.split("_").join(" ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPaginationControls()}
      </div>
    </>
  );
}

export default Bookings;
