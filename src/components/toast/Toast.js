import './Toast.scss';
import { Toast, ToastContainer } from 'react-bootstrap';

const CustomToast = ({ show, message, onClose, type }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} bg={type || 'primary'} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body className='text-white'>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
