import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSearch, FaPlus } from 'react-icons/fa';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://upride-internships-default-rtdb.firebaseio.com/.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const onlineBookings = data.online_bookings || {};
        const offlineBookings = data.offline_bookings || {};
        const onlineBookingsArray = Object.values(onlineBookings);
        const active = onlineBookingsArray.filter(
          (booking) => booking.bookingStatus === 'SUCCESS'
        );
        const completed = onlineBookingsArray.filter(
          (booking) => booking.bookingStatus === 'COMPLETED'
        );
        const cancelled = onlineBookingsArray.filter(
          (booking) => booking.bookingStatus === 'CANCELLED'
        );
        const allActiveBookings = [...active, ...Object.values(offlineBookings)];
        allActiveBookings.sort(
          (a, b) => a.bookingEpochTime - b.bookingEpochTime
        );
        completed.sort((a, b) => a.bookingEpochTime - b.bookingEpochTime);
        cancelled.sort((a, b) => a.bookingEpochTime - b.bookingEpochTime);
        setBookings(allActiveBookings);
        setActiveBookings(active);
        setCompletedBookings(completed);
        setCancelledBookings(cancelled);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const getFilteredBookings = () => {
    switch (selectedTab) {
      case 'active':
        return activeBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return [];
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = getFilteredBookings().slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    getFilteredBookings().length / itemsPerPage
  );

  const renderPaginationControls = () => (
    <div className='pagination-controls'>
      <button
        onClick={() =>
          setCurrentPage((prevPage) => prevPage - 1)
        }
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() =>
          setCurrentPage((prevPage) => prevPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter bookings based on search query
  useEffect(() => {
    const filtered = getFilteredBookings().filter((booking) =>
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchQuery, selectedTab, bookings]);

  return (
    <>
      <div className='px-8 py-4 shadow text-white flex gap-4'>
        <div className='border shadow rounded-3xl py-1 pr-2 pl-4 flex items-center w-max'>
          <input
            type='text'
            placeholder='Search booking'
            value={searchQuery}
            onChange={handleSearchChange}
            className='text-black'
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
      <div className='py-9 px-11 w-4/6'>
        <div className='flex gap-6'>
          <h2 className='text-black text-2xl'>View Bookings</h2>
          <img src='/public/assets/images/bookings.svg' alt='Bookings' />
        </div>
        <ul className='flex gap-12 mt-8 border-b mb-6'>
          <li
            className={selectedTab === 'active' ? 't-active' : ''}
            onClick={() => handleTabClick('active')}
          >
            <span className='text-gray-600'>
              Active ({activeBookings.length})
            </span>
          </li>
          <li
            className={selectedTab === 'completed' ? 't-active' : ''}
            onClick={() => handleTabClick('completed')}
          >
            <span className='text-gray-600'>
              Completed ({completedBookings.length})
            </span>
          </li>
          <li
            className={selectedTab === 'cancelled' ? 't-active' : ''}
            onClick={() => handleTabClick('cancelled')}
          >
            <span className='text-gray-600'>
              Cancelled ({cancelledBookings.length})
            </span>
          </li>
        </ul>
        <table className='border w-full rounded-2xl overflow-hidden'>
          <thead>
            <tr className='bg-gray-200 shadow'>
              <th className='text-sm py-2 text-center'>Name</th>
              <th className='text-sm py-2 text-center'>Date</th>
              <th className='text-sm py-2 text-center'>Package Details</th>
              <th className='text-sm py-2 text-center'>Payment mode</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index} className='font-light'>
                <td className='text-sm py-3 text-center flex items-center justify-center gap-2'>
                  <div className='h-7 aspect-square border rounded-full overflow-hidden'></div>
                  <span className='text-black text-sm whitespace-nowrap'>
                    {booking.clientName}
                  </span>
                </td>
                <td className='text-sm py-3 text-center'>
                  {format(new Date(booking.bookingEpochTime), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className='text-sm py-3 text-center'>
                  {booking.packageTitle}
                </td>
                <td className='text-sm py-3 text-center'>
                  {booking.bookingStatus}
                  <span
                    className={`bg-${booking.bookingStatus} text-white p-0.5 px-3 rounded-xl`}
                  >
                    {booking.paymentMode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPaginationControls()}
      </div>
    </>
  );
}

export default Bookings;
