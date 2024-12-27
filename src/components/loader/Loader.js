import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Loader.scss';

const Loader = () => {
    return (
        <div className="loader-container">
            <FontAwesomeIcon icon="fa-solid fa-circle-notch" className="fa-spin" />
        </div>
    );
};

export default Loader;