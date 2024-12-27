import './Bookings.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import propertyService from '../../../services/propertyService';
import { differenceInDays, endOfDay, format, startOfDay } from 'date-fns';
import { Alert, Button, Modal } from 'react-bootstrap';
import CustomToast from '../../../components/toast/Toast';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';

const GuestBookings = () => {
    const { user } = useAuth();
    const [myBookings, setMyBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState({});
    const [showPropertyBookForm, setShowPropertyBookForm] = useState(false);
    const [bookingData, setBookingData] = useState({});
    const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');
    const [showFillFormError, setShowFillFormError] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index);


    const fetchGuestBookings = useCallback(async () => {
        try {
            if (!user) {
                return;
            }
            const bookings = await propertyService.getGuestBookings(user._id);
            if (bookings.data.success) {
                const bookingsData = bookings.data.bookings.reduce((acc, booking) => {
                    const propertyBooking = {
                        _id: booking._id,
                        propertyId: booking.property._id,
                        location: booking.property.location.city,
                        propertyName: booking.property.name,
                        propertyTypeName: booking.property.propertyType.name,
                        propertyType: booking.property.propertyType._id,
                        startDate: format(booking.startDate, 'yyyy-MM-dd'),
                        endDate: format(booking.endDate, 'yyyy-MM-dd'),
                        totalPrice: booking.totalPrice,
                        price: booking.property.price,
                        guestCount: booking.guestCount,
                        isExtended: booking.extended,
                        status: booking.status === 'confirmed' ? 'Booked' : booking.status === 'rejected' ? 'Rejected' : 'In Progress'
                    }
                    acc.push(propertyBooking);
                    return acc;
                }, []);

                setMyBookings(bookingsData);
            }
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            const message = error.response ? error.response.data.message : 'Something went wrong';
            setToastMessage(message);
        }
    }, [user]);

    useEffect(() => {


        fetchGuestBookings();
    }, [user, fetchGuestBookings]);



    const onExtendBooking = (booking, action) => {
        setSelectedBooking(booking);
        setSelectedAction(action);
        if (action === 'cancel') {
            setShowPropertyBookForm(true);
            setShowBookingConfirmation(true);
            return;
        }
        setShowBookingConfirmation(false);
        setBookingData({
            property: booking.propertyId,
            location: booking.location,
            propertyName: booking.propertyName,
            startDate: new Date(booking.endDate),
            endDate: null,
            dateRange: [new Date(booking.endDate), null],
            bookingId: booking._id,
            currentPrice: booking.totalPrice,
            newPrice: 0,
            totalPrice: 0,
            price: booking.price,
            guestCount: booking.guestCount,
            cardName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: ''
        });
        setShowPropertyBookForm(true);
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
        if (!bookingData.dateRange[0] || !bookingData.dateRange[1]) {
            setShowFillFormError(true);
            return;
        }
        setShowFillFormError(false);
        setShowBookingConfirmation(true);
    }

    const bookPropertyOnConfirm = async () => {

        const payload = {
            propertyId: selectedBooking.propertyId,
            startDate: startOfDay(bookingData.startDate),
            newEndDate: endOfDay(bookingData.endDate),
            guestCount: bookingData.guestCount,
            guestId: user._id,
            extraAmount: selectedBooking.price * differenceInDays(bookingData.endDate, bookingData.startDate),
            bookingId: selectedBooking._id,
            extended: true,
            cardName: bookingData.cardName,
            cardNumber: bookingData.cardNumber,
            cvv: bookingData.cvv,
            expiryMonth: bookingData.expiryMonth,
            expiryYear: bookingData.expiryYear
        };
        try {
            const response = await propertyService.extendBooking(payload);
            if (response.data.success) {
                handleClose();
            }
            setShowToast(true);
            setToastType('success');
            setToastMessage(response.data.message);
            fetchGuestBookings();
            handleClose();
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            setToastMessage(error.response.data.message);
        }

    };

    const handleCancelBooking = async () => {
        const payload = {
            bookingId: selectedBooking._id,
        };
        try {
            const response = await propertyService.cancelBooking(payload);
            if (response.data.success) {
                handleClose();
            }
            setShowToast(true);
            setToastType('success');
            setToastMessage(response.data.message);
            fetchGuestBookings();
            handleClose();
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            setToastMessage(error.response.data.message);
        };
    }

    const handleClose = () => {
        setShowPropertyBookForm(false);
        setBookingData({});
        setShowBookingConfirmation(false);
        setSelectedBooking({});
        setShowFillFormError(false);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };
    return (
        <div className="guest-bookings">
            <CustomToast show={showToast} message={toastMessage} onClose={handleCloseToast} type={toastType}></CustomToast>

            <h1>My Bookings</h1>
            <Modal show={showPropertyBookForm} onHide={handleClose} className="register-dialog property-booking-dialog" backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedAction === 'extend' ? 'Extend Stay' : 'Cancel Booking'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showBookingConfirmation ?
                        <form className="user property-book-form" onSubmit={handleSubmit}>
                            <div className="form-group row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <DatePicker name="dateRange"
                                        className='form-control form-control-user'
                                        selectsRange={true}
                                        minDate={bookingData.startDate}
                                        startDate={bookingData.startDate}
                                        endDate={bookingData.endDate}
                                        placeholderText="Check in & Check out"
                                        onChange={(e) => handleChange({ target: { name: 'dateRange', value: e } })}
                                    />
                                </div>
                            </div>


                        </form> :
                        <div className='booking-confirmation'>
                            {selectedAction === 'extend' ? (<>
                                <div className='booking-confirmation'>
                                    <div className='order-payment'>
                                        <p className='order-total'> ${selectedBooking.price * differenceInDays(bookingData.endDate, bookingData.startDate)} </p>
                                        {selectedBooking.details ? <p className='order-details'> {selectedBooking.details} </p> : ''}
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
                                        <div><p className='label'>Property:</p><p> {selectedBooking.propertyName}</p></div>
                                        <div><p className='label'>Location: </p><p>{selectedBooking.location}</p></div>
                                        <div><p className='label'>Type: </p><p>{selectedBooking.propertyTypeName}</p></div>
                                        <div><p className='label'>Check in: </p><p>{bookingData.startDate?.toDateString()}</p></div>
                                        <div><p className='label'>Check out: </p><p>{bookingData.endDate?.toDateString()}</p></div>
                                        <div><p className='label'>Guests: </p><p>{bookingData.guestCount}</p></div>
                                        <div><p className='label'>No of Days:</p><p>{differenceInDays(bookingData.endDate, bookingData.startDate)}</p></div>
                                        <div><p className='label'>Per Day:</p><p>${selectedBooking.price}</p></div>
                                    </div>
                                </div>
                            </>) : (<>
                                <p>Are you sure want to cancel booking...?</p>
                            </>)
                            }

                        </div>
                    }

                    {showFillFormError && <div className="alert alert-danger">Please fill all the fields</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {selectedAction === 'extend' ? <Button variant="primary" onClick={handleSubmit}>
                        {showBookingConfirmation ? 'Book' : 'Proceed'}
                    </Button> : <Button variant="primary" onClick={handleCancelBooking}>
                        Cancel Booking
                    </Button>}
                </Modal.Footer>
            </Modal>
            <div className="bookings row">
                {
                    myBookings.length ? myBookings.map((booking, index) => {
                        return (
                            <div key={index} className="col-xl-4 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-3">
                                                <div className="h5 font-weight-bold text-primary text-uppercase mb-1">
                                                    {booking.propertyName} </div>
                                                <div className='row'>
                                                    <div className="col-md-6 text-xs mb-0 font-weight-bold text-gray-800">Property Type:{booking.propertyTypeName} </div>
                                                    <div className="col-md-6 text-xs mb-0 font-weight-bold text-gray-800">Location:{booking.location} </div>
                                                    <div className="col-md-6 text-xs mb-0 font-weight-bold text-gray-800">Check In:{booking.startDate} </div>
                                                    <div className="col-md-6 text-xs mb-0 font-weight-bold text-gray-800">Check Out:{booking.endDate} </div>
                                                    <div className="col-md-6 text-xs mb-0 font-weight-bold text-gray-800">Price:{booking.totalPrice} </div>
                                                    {booking.isExtended ? <div className="text-xs col-md-6 mb-0 font-weight-bold text-gray-800">Extended </div> : ''}
                                                </div>

                                            </div>

                                            <p className='mb-0 p-0'>{booking.status}</p>
                                        </div>

                                        {booking.status === 'Booked' ?
                                            <div className="card-actions mt-3">
                                                <Button variant="outline-warning mr-2" className="action-btn" onClick={(e) => onExtendBooking(booking, 'extend')}>Extend</Button>
                                                <Button variant="outline-danger mr-2" className="action-btn" onClick={(e) => onExtendBooking(booking, 'cancel')}>Cancel</Button>
                                            </div> : ''}
                                    </div>
                                </div>
                            </div>

                        )
                    }) : <Alert key="warning" variant="warning">
                        You have no bookings, please book a property!
                    </Alert>
                }
            </div>
        </div>
    )
};

export default GuestBookings;