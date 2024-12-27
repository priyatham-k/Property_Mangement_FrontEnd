import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Properties.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import propertyService from '../../../services/propertyService';
import { Alert, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Form from 'react-bootstrap/Form';
import { differenceInDays, endOfDay, startOfDay } from 'date-fns';
import CustomToast from '../../../components/toast/Toast';


const GuestProperties = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [showFillFormError, setShowFillFormError] = useState(false);
    const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');

    const months = Array.from({ length: 12 }, (_, index) => index + 1); 
    const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index);

    const [bookingData, setBookingData] = useState({
        dateRange: [null, null],
        guestCount: '',
        propertyId: '',
        startDate: null,
        endDate: null,
        cardName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });


    const [showPropertyBookForm, setShowPropertyBookForm] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState({});

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const propertiesResponse = await propertyService.getProperties();
                propertiesResponse.data.properties.forEach((property) => {
                    property.propertyTypeName = property.propertyType.name;
                    property.propertyType = property.propertyType._id;

                });
                setProperties(propertiesResponse.data.properties);
            } catch {
                console.log('Error fetching properties');
            }

        };

        fetchProperties();
    }, []);

    const onBookProperty = (property, e) => {
        setShowPropertyBookForm(true);
        setSelectedProperty(property);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dateRange') {
            const [startDate, endDate] = value;
            setBookingData({
                ...bookingData,
                startDate,
                endDate,
                dateRange: value
            });
        } else {
            setBookingData({
                ...bookingData,
                [name]: value
            });
        }
    };

    const handleClose = () => {
        setShowPropertyBookForm(false);
        setBookingData({
            dateRange: [null, null],
            guestCount: '',
            propertyId: '',
            startDate: null,
            endDate: null,
            expiryMonth: '',
            expiryYear: '',
            cardName: '',
            cardNumber: '',
            cvv: ''
        });
        setShowBookingConfirmation(false);
        setSelectedProperty({});
        setShowFillFormError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (showBookingConfirmation) {
            if (!bookingData.cardNumber || !bookingData.cardName || !bookingData.cvv || !bookingData.expiryMonth || !bookingData.expiryYear) {
                setShowFillFormError(true);
                return;
            }
            setShowFillFormError(false);
            bookPropertyOnConfirm();
            return;
        }
        if (!bookingData.dateRange[0] || !bookingData.dateRange[1] || !bookingData.guestCount) {
            setShowFillFormError(true);
            return;

        }
        setShowFillFormError(false);
        setShowBookingConfirmation(true);
    }

    const bookPropertyOnConfirm = async () => {
        const payload = {
            propertyId: selectedProperty._id,
            startDate: startOfDay(bookingData.startDate),
            endDate: endOfDay(bookingData.endDate),
            guestCount: bookingData.guestCount,
            guestId: user._id,
            totalPrice: selectedProperty.price * differenceInDays(bookingData.endDate, bookingData.startDate),
            cardName: bookingData.cardName,
            cardNumber: bookingData.cardNumber,
            expiryMonth: bookingData.expiryMonth,
            expiryYear: bookingData.expiryYear,
        };
        try {
            const response = await propertyService.bookProperty(payload);
            if (response.data.success) {
                handleClose();
            }
            setShowToast(true);
            setToastType('success');
            setToastMessage(response.data.message);
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            setToastMessage(error.response.data.message);
        }

    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <div className="guest-properties">
            <CustomToast show={showToast} message={toastMessage} onClose={handleCloseToast} type={toastType}></CustomToast>

            <div className="guest-property-list">
                <div className="row">
                    {
                        properties.length ? properties.map((property, index) => (
                            <div key={index} className="col-xl-4 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col-auto mr-3">
                                                <FontAwesomeIcon icon="fa-solid fa-hotel" className="text-gray-300 property-icon fa-2x" />
                                            </div>
                                            <div className="col property-details">
                                                <div className="h5 font-weight-bold text-primary text-uppercase mb-1">
                                                    {property.name}</div>
                                                <div className="text-s mb-0 font-weight-bold text-gray-800 d-flex align-items-center justify-content-between">
                                                    <div>Property Type: {property.propertyTypeName} </div>
                                                    <div>Location: {property.location.city} </div>
                                                </div>
                                                {property.details ? <div className="text-s mb-0 font-weight-bold text-gray-800 mt-2">{property.details} </div> : ''}
                                            </div>


                                        </div>
                                        <div className="card-actions mt-3">
                                            <Button variant="outline-warning mr-2" className="action-btn" onClick={(e) => onBookProperty(property, e)}>Book</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <Alert key="warning" variant="warning">
                            No properties added, please stay tuned!
                        </Alert>
                    }

                </div>
            </div>

            <Modal show={showPropertyBookForm} onHide={handleClose} className="register-dialog property-booking-dialog" backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Book {selectedProperty.propertyTypeName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showBookingConfirmation ?
                        <form className="user property-book-form" onSubmit={handleSubmit}>
                            <div className="form-group row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <DatePicker name="dateRange"
                                        className='form-control form-control-user'
                                        selectsRange={true}
                                        minDate={new Date()}
                                        startDate={bookingData.startDate}
                                        endDate={bookingData.endDate}
                                        placeholderText="Check in & Check out"
                                        onChange={(e) => handleChange({ target: { name: 'dateRange', value: e } })}
                                    />
                                </div>
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <Form.Select value={bookingData.guestCount} onChange={handleChange} name="guestCount" className="form-control">
                                        <option value='' disabled># of guests</option>
                                        {
                                            [1, 2].map((i, j) => {
                                                return <option key={i} value={i}>{i}</option>
                                            })
                                        }
                                    </Form.Select>
                                </div>
                            </div>

                        </form> : <div className='booking-confirmation'>
                            <div className='order-payment'>
                                <p className='order-total'> ${selectedProperty.price * differenceInDays(bookingData.endDate, bookingData.startDate)} </p>
                                {selectedProperty.details ? <p className='order-details'> {selectedProperty.details} </p> : ''}
                                <p className='payment-title'> Payement Card Details: </p>
                                <form className="user property-book-payment-details" onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user" id="cardName"
                                                placeholder="Card Name" name="cardName" maxLength='100'
                                                value={bookingData.cardName} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="cardNumber"
                                                placeholder="Card Number" name="cardNumber" maxLength='16'
                                                value={bookingData.cardNumber} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <div className='row'>
                                                <div className='col-sm-6'>
                                                    <Form.Select value={bookingData.expiryMonth} onChange={handleChange} name="expiryMonth" className="form-control">
                                                        <option value='' disabled>MM</option>
                                                        {
                                                            months.map((i, j) => {
                                                                return <option key={i} value={i}>{i}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                </div>

                                                <div className='col-sm-6'>
                                                    <Form.Select value={bookingData.expiryYear} onChange={handleChange} name="expiryYear" className="form-control">
                                                        <option value='' disabled>YYY</option>
                                                        {
                                                            years.map((i, j) => {
                                                                return <option key={i} value={i}>{i}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                </div>
                                            </div>
                                            
                                            
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="cvv"
                                                placeholder="CVV" name="cvv" maxLength='3'
                                                value={bookingData.cvv} onChange={handleChange} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='order-recap'>
                                <div><p className='label'>Property:</p><p> {selectedProperty.name}</p></div>
                                <div><p className='label'>Location: </p><p>{selectedProperty.location.city}</p></div>
                                <div><p className='label'>Type: </p><p>{selectedProperty.propertyTypeName}</p></div>
                                <div><p className='label'>Check in: </p><p>{bookingData.startDate?.toDateString()}</p></div>
                                <div><p className='label'>Check out: </p><p>{bookingData.endDate?.toDateString()}</p></div>
                                <div><p className='label'>Guests: </p><p>{bookingData.guestCount}</p></div>
                                <div><p className='label'>No of Days:</p><p>{differenceInDays(bookingData.endDate, bookingData.startDate)}</p></div>
                                <div><p className='label'>Per Day:</p><p>${selectedProperty.price}</p></div>
                            </div>
                        </div>
                    }

                    {showFillFormError && <div className="alert alert-danger">Please fill all the fields</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {showBookingConfirmation ? 'Book' : 'Proceed'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default GuestProperties;