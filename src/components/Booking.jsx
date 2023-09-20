import Bookings from "./Bookings";
import Navbar from "./Navbar";

function Booking() {
  return (
    <div className='h-screen overflow-auto grow'>
      <Navbar />
      <Bookings />
    </div>
  );
}

export default Booking;
