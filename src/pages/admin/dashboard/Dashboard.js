import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Dashboard.scss';
import propertyService from '../../../services/propertyService';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Alert, Button } from 'react-bootstrap';
import CustomToast from '../../../components/toast/Toast';


const AdminDashboard = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');
   
    const [stats, setStats] = useState({
        earnings: 0,
        propertys: 0,
        bookings: 0,
        guests: 0,
        managers: 0

    });

    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const fetchConfirmedBookings = async () => {
        try {
            const bookings = await propertyService.getAllConfirmedBookings();
            if (bookings.data.success) {
                const bookingsData = bookings.data.bookings.reduce((acc, booking) => {
                    const propertyBooking = {
                        _id: booking._id,
                        propertyId: booking.property._id,
                        propertyName: booking.property.name,
                        propertyTypeName: booking.property.propertyType.name,
                        propertyType: booking.property.propertyType._id,
                        location: booking.property.location.city,
                        totalPrice: booking.totalPrice,
                        commission: booking.commission,
                        propertyEarnings: booking.propertyEarnings,
                    }
                    acc.push(propertyBooking);
                    return acc;
                }, []);

                setConfirmedBookings(bookingsData);
            }
        } catch (error) {
            console.log(error, 'error');
        };

    };
    const fetchStats = async () => {
        try {


            const adminStats = await propertyService.getAdminStats();
            setStats({
                earnings: adminStats.data.earnings,
                properties: adminStats.data.properties,
                bookings: adminStats.data.bookings,
                guests: adminStats.data.guests,
                managers: adminStats.data.managers
            });
        } catch (error) {
            console.log(error, 'error');
        }
    };

    const transferEarning = async (booking) => {
        try {
            const response = await propertyService.transferEarnings({ propertyId: booking.propertyId, propertyEarnings: booking.propertyEarnings, adminEarnings: booking.commission, bookingId: booking._id });
            if (response.data.success) {
                fetchConfirmedBookings();
                fetchStats();
                setShowToast(true);
                setToastType('success');
                setToastMessage(response.data.message);
            }
        } catch (error) {
            console.log(error, 'error');
        }

    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    useEffect(() => {

        fetchStats();

        fetchConfirmedBookings();
    }, []);

    return (
        <div className="manager-dashboard">
            <CustomToast show={showToast} message={toastMessage} onClose={handleCloseToast} type={toastType}></CustomToast>

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
            </div>
            <div className="row">

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Earnings </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">${stats.earnings}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-dollar-sign" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        No of Properties </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.properties}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-hotel" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Confirmed Bookings
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.bookings}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-calendar-days" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        No of Users</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800 users-stats">
                                        <span>Guests: {stats.guests} </span>
                                        <span>Managers: {stats.managers}</span>    
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-users" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Booking Earnings</h6>
                </div>
                <div className="card-body">
                    {confirmedBookings.length ? <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>Booking</th>
                                <th>Property</th>
                                <th>Location</th>
                                <th>Property Type</th>
                                <th>Total</th>
                                <th>Property Earning</th>
                                <th>Admin Earning</th>
                                <th>Transfer Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                confirmedBookings.map((booking, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{booking.propertyName}</td>
                                            <td>{booking.location}</td>
                                            <td>{booking.propertyTypeName}</td>
                                            <td>{booking.totalPrice}</td>
                                            <td>{booking.propertyEarnings}</td>
                                            <td>{booking.commission}</td>
                                            <td>
                                                <Button variant="outline-warning mr-2" className="action-btn" onClick={(e) => transferEarning(booking)}>Confirm</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table> : <Alert key="warning" variant="warning">
                        No Bookings Found
                    </Alert>}
                </div>
            </div>


        </div>
    );
};

export default AdminDashboard;