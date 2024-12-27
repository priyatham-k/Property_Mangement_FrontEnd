import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login/Login';
import AdminDashboard from '../pages/admin/dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/navbar/Navbar';
import SideBar from '../components/sidebar/Sidebar';
import Properties from '../pages/admin/properties/Properties';
import GuestProperties from '../pages/guest/properties/Properties';
import GuestBookings from '../pages/guest/bookings/Bookings';
import Loader from '../components/loader/Loader';
import ManagerDashboard from '../pages/manager/dashboard/dashboard';
import Register from '../pages/auth/register/Register';

const AppRoutes = () => {
    
    const { user, loaderCount } = useAuth();

    return (
        <div className={user ? 'authorized-pages' : 'global-pages'} id="wrapper">
            { loaderCount ? <Loader />:''}
            {
                user && <SideBar />
            }
            <div id="content-wrapper" className='d-flex flex-column'>
                {
                    user && <Navbar />
                }
                <div className={`h-100 ${user ? 'container-fluid' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace={true} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/admin/dashboard"
                            element={<PrivateRoute role="Admin"><AdminDashboard /></PrivateRoute>}
                        />
                        <Route
                            path="/admin/properties"
                            element={<PrivateRoute role="Admin"><Properties
                            /></PrivateRoute>}
                        />
                        <Route 
                            path="/manager/dashboard"
                            element={<PrivateRoute role="Manager"><ManagerDashboard
                            /></PrivateRoute>}
                        />
                        <Route
                            path="/guest/properties"
                            element={<PrivateRoute role="Guest"><GuestProperties
                            /></PrivateRoute>}
                        />
                        <Route
                            path="/guest/bookings"
                            element={<PrivateRoute role="Guest"><GuestBookings
                            /></PrivateRoute>}
                        />
                
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppRoutes;