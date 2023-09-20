import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { FaSearch, FaPlus } from "react-icons/fa";

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
      <div className='px-8 py-4 shadow text-white flex gap-4'>
        <div className='border shadow rounded-3xl py-1 pr-2 pl-4 flex items-center w-max'>
          <input
            type='text'
            placeholder='Search booking'
            value={searchQuery}
            onChange={handleSearchChange}
            className='text-black focus:outline-none'
          />
          <div className='bg-[#FF5757] p flex justify-center items-center p-2 rounded-full'>
            <FaSearch />
          </div>
        </div>
        <div className='border shadow rounded-3xl py-1 px-6 flex items-center w-max bg-[#FF5757]'>
          <FaPlus className='mr-4' />
          <span>New Booking</span>
        </div>
        <div className='border shadow rounded-3xl py-1 px-2 flex items-center ml-auto gap-2 w-40 '>
          <div className='h-full aspect-square border rounded-full overflow-hidden'></div>
          <span className='text-black text-sm whitespace-nowrap'>Hello Name!</span>
        </div>
      </div>
      <div className='py-9 px-11 w-5/6'>
        <div className='flex gap-6'>
          <h2 className='text-black text-2xl'>View Bookings</h2>
          <img src='/public/assets/images/bookings.svg' alt='Bookings' />
          <div className='h-9 aspect-square ml-auto bg-[#d9d9d9]'></div>
        </div>
        <ul className='flex gap-12 mt-8 border-b mb-6'>
          <li className={`${selectedTab === "active" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("active")}>
            <span className='text-gray-600'>Active ({activeBookings.length})</span>
          </li>
          <li className={`${selectedTab === "completed" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("completed")}>
            <span className='text-gray-600'>Completed ({completedBookings.length})</span>
          </li>
          <li className={`${selectedTab === "cancelled" ? "t-active" : ""} cursor-pointer`} onClick={() => handleTabClick("cancelled")}>
            <span className='text-gray-600'>Cancelled ({cancelledBookings.length})</span>
          </li>
          <li className='ml-auto'>
            <span className='text-xs font-light text-gray-500'>Page {currentPage}</span>
          </li>
        </ul>
        <div className='overflow-auto max-h-96'>
          <table className='border w-full rounded-2xl overflow-hidden h-full'>
            <thead>
              <tr className='bg-gray-200 shadow'>
                <th className='text-sm py-2 text-start px-6'>Name</th>
                <th className='text-sm py-2 text-start px-6'>Date</th>
                <th className='text-sm py-2 text-start px-6'>Package Details</th>
                <th className='text-sm py-2 text-start px-6'>Payment mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrentBooking.map((booking, index) => (
                <tr key={index} className='font-light'>
                  <td className='text-sm py-3  px-6 flex items-center gap-2 w-[200px] overflow-auto'>
                    <div className='h-7 aspect-square border rounded-full overflow-hidden'>
                      <img src={booking.workshopImage} alt={booking.workshopTitle} />
                    </div>
                    <span className='text-black text-sm whitespace-nowrap'>{booking.clientName}</span>
                  </td>
                  <td className='text-sm py-3 px-6 w-[200px]'>{format(new Date(booking.bookingEpochTime), "MMM dd, yyyy HH:mm")}</td>
                  <td className='text-sm py-3 px-6 w-[200px]'>{booking.packageTitle}</td>
                  <td className='text-sm py-3 px-6 w-[200px]'>
                    <span className={`${booking.offlineBooking ? "bg-[#FFCA28]" : "bg-[#35DBA2]"} text-white p-0.5 px-3 rounded-xl`}>
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
