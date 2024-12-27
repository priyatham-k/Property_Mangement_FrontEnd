import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Register.scss';
import authService from '../../../services/authService';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import CustomToast from '../../../components/toast/Toast';


const Register = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');
    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Guest'
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm({
            ...registerForm,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await authService.register(registerForm);
            if (response.data.success) {
                setRegisterForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'Guest'
                });
                setShowToast(true);
                setToastType('success');
                setToastMessage(response.data.message);
            }
        } catch (error) {
            console.log(error)
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
                                    <div className="col-lg-4 d-none d-lg-block bg-login-image">
                                        <FontAwesomeIcon icon="fa-solid fa-hotel" className="property-icon" />
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">P.M.S!</h1>
                                            </div>
                                            <form className="user">
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <input type="text" className="form-control form-control-user"
                                                            id="firstName" name="firstName"
                                                            placeholder="Enter First Name..."
                                                            value={registerForm.firstName}
                                                            onChange={handleChange}
                                                            required />
                                                    </div>
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <input type="text" className="form-control form-control-user"
                                                            id="lastName" name="lastName"
                                                            placeholder="Enter last Name..."
                                                            value={registerForm.lastName}
                                                            onChange={handleChange}
                                                            required />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <input type="email" className="form-control form-control-user"
                                                            id="exampleInputEmail" name="email"
                                                            placeholder="Enter Email Address..."
                                                            value={registerForm.email}
                                                            onChange={handleChange}
                                                            required />
                                                    </div>
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <input type="password" className="form-control form-control-user" name="password"
                                                            id="exampleInputPassword" placeholder="Password" value={registerForm.password} onChange={handleChange}
                                                            required />
                                                    </div>

                                                </div>
                                                <div className="form-group">
                                                    <Form.Select value={registerForm.guest} name="role" className="form-control" onChange={handleChange}>
                                                        <option value='1' disabled>Select Role</option>
                                                        <option value='Guest'>Guest</option>
                                                        <option value='Manager'>Manager</option>


                                                    </Form.Select>
                                                </div>

                                                <a href="index.html" className="btn btn-primary btn-user btn-block" onClick={handleRegister}>
                                                    Register
                                                </a>
                                            </form>
                                            <hr />

                                            <div className="text-center">
                                                <NavLink to="/login" className="small">Login!</NavLink>
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

export default Register;