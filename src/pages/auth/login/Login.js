import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Login.scss';
import authService from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CustomToast from '../../../components/toast/Toast';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(email, password);
            if (response.data.success) {
                login(response.data.user);
            }
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            const message = error.response ? error.response.data.message : 'Something went wrong';
            setToastMessage(message);
        }

    };

    const handleCloseToast = () => {
        setShowToast(false);
    };
    return (
        <div className="bg-gradient-primary app-content login-container">
            <CustomToast show={showToast} message={toastMessage} onClose={handleCloseToast} type={toastType}></CustomToast>

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image">
                                        <FontAwesomeIcon icon="fa-solid fa-hotel" className="property-icon" />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">P.M.S!</h1>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    <input type="email" className="form-control form-control-user"
                                                        id="exampleInputEmail" aria-describedby="emailHelp"
                                                        placeholder="Enter Email Address..."
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="password" className="form-control form-control-user"
                                                        id="exampleInputPassword" placeholder="Password" value={password}
                                                        onChange={(e) => setPassword(e.target.value)} required />
                                                </div>

                                                <a href="index.html" className="btn btn-primary btn-user btn-block" onClick={handleLogin}>
                                                    Login
                                                </a>
                                            </form>
                                            <hr />

                                            <div className="text-center">
                                                <NavLink to="/register" className="small">Create an Account!</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;