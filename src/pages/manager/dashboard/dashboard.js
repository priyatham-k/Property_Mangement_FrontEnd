import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './dashboard.scss';
import propertyService from '../../../services/propertyService';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        earnings: 0,
        confirmed: 0,
        process: 0,
        rejected: 0
    });

    useEffect(() => {
        const fetchManagerStats = async () => {
            try {
                const stats = await propertyService.getManagerStats(user.propertyId);
                if (stats.data.success) {
                    setStats({
                        earnings: stats.data.earnings,
                        ...stats.data.counts
                    });
                }
            } catch (error) {
                console.log(error);
            }
            
        };
        if (user.propertyId) {
            
            fetchManagerStats();
        }
    }, [user]);
    return (
        <div className="manager-dashboard">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
            </div>
            <div className="row">

            <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Property
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{user.propertyName}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-hotel" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                        Confirmed Bookings </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.confirmed}</div>
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
                                        Cancelled Bookings</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.cancelled}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon="fa-solid fa-plane-slash" className='fa-2x text-gray-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ManagerDashboard;