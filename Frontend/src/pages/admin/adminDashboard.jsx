import Navigation from '../../components/admin/Navigation';
import Footer from '../../components/admin/Footer';
import EditBooking from '../../components/user/EditBooking';
import BookingList from '../../components/user/BookingList';
import ManageCars from '../../pages/admin/manage-cars';
import CarsList from '../../components/admin/CarList.jsx';
import AddCar  from '../../components/admin/AddCar';
import '../../styles/style.css';

function AdminDashboard() {
  return (
    <div type="admin-dashboard" className="admin-dashboard dashboard">
      <Navigation />

      <div className="admin-header">
        <h1 className="title">Admin Dashboard</h1>
        <h2 className="subtitle">Welcome, Admin!</h2>
      </div>

      <div className="admin-container">
        <div className="card">
          <BookingList />
        </div>

        <div className="card">
          <EditBooking />
        </div>

        <div className="card card-grid card-grid-2 card-grid-full">
          <div className="">
            <div className="">
              <div className="">
                <ManageCars />
              </div>
            </div>
          </div>
        </div>

        <div className="card card-grid">
          <div className="panel-light"> <CarsList /></div>
          <div className="panel-light"> <AddCar /></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default AdminDashboard;