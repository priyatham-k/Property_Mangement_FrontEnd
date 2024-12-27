import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Properties.scss';
import Form from 'react-bootstrap/Form';
import propertyService from "../../../services/propertyService";
import { Alert } from "react-bootstrap";
import CustomToast from "../../../components/toast/Toast";
import authService from "../../../services/authService";

const Properties = () => {
    
    useEffect(() => {
        const fetchPropertyTypesAndLocations = async () => {
            try {

                const propertyTypesResponse = await propertyService.getPropertyTypes();
                const locationsResponse = await propertyService.getLocations();
                setPropertyTypes(propertyTypesResponse.data.propertyTypes);
                setLocations(locationsResponse.data.locations);
            } catch (error) {
                console.log(error, 'error');
            }
        };

        const fetchProperties = async () => {
            try {

                const propertiesResponse = await propertyService.getProperties();
                propertiesResponse.data.properties.forEach((property) => {
                    property.propertyTypeName = property.propertyType.name;
                    property.propertyType = property.propertyType._id;

                });
                setProperties(propertiesResponse.data.properties);
            } catch (error) {
                console.log(error, 'error');
            }
        };

        const getManagers = async () => {
            try {
                const managers = await authService.getManagers();
                setManagers(managers.data.managers);
            } catch (error) {
                console.log(error, 'error');
            }
        }

        fetchPropertyTypesAndLocations();
        fetchProperties();
        getManagers();

    }, []);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [properties, setProperties] = useState([]);
    const [showPropertyRegister, setShowPropertyRegister] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('primary');
    const [managers, setManagers] = useState([]);

    const handleClose = () => {
        setShowPropertyRegister(false)
        setShowDeleteConfirmation(false);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
        }
        let response;
        console.log(payload, ">>>");
        try {
            if (formData._id) {
                response = await propertyService.updateProperty(payload);
            } else {
                response = await propertyService.addProperty(payload);
            }

            if (response.data.success) {
                handleClose();
                const propertiesResponse = await propertyService.getProperties();
                propertiesResponse.data.properties.forEach((property) => {
                    property.propertyTypeName = property.propertyType.name;
                    property.propertyType = property.propertyType._id;

                });
                setProperties(propertiesResponse.data.properties);
                setShowToast(true);
                setToastType('success');
                setToastMessage(response.data.message);
            }
        } catch (error) {
            setShowToast(true);
            setToastType('danger');
            const message = error.response ? error.response.data.message : 'Something went wrong';
            setToastMessage(message);
        }

    };

    const onPropertyFormOpen = (property, e) => {
        e.preventDefault();
        if (property) {
            setFormData({
                name: property.name,
                location: property.location._id,
                address: property.address,
                _id: property._id,
                isEdit: true,
                propertyType: property.propertyType,
                details: property.details,
                price: property.price,
                manager: property.manager
            });
        } else {
            setFormData({
                name: '',
                location: '',
                address: '',
                _id: '',
                manager: '',
                propertyType: '',
                details: '',
                price: '',
            });
        }

        setShowPropertyRegister(true);
    };

    const deleteConfirmation = (property, e) => {
        e.preventDefault();
        setSelectedPropertyId(property._id);
        setShowDeleteConfirmation(true);
    };

    const deleteProperty = async (e) => {
        e.preventDefault();
        try {

            const response = await propertyService.deleteProperty(selectedPropertyId);
            if (response.data.success) {
                setShowDeleteConfirmation(false);
                const propertiesResponse = await propertyService.getProperties();
                propertiesResponse.data.properties.forEach((property) => {
                    property.propertyTypeName = property.propertyType.name;
                    property.propertyType = property.propertyType._id;

                });
                setProperties(propertiesResponse.data.properties);
                setShowToast(true);
                setToastType('success');
                setToastMessage(response.data.message);
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
        <div className="admin-properties">
            <CustomToast show={showToast} message={toastMessage} onClose={handleCloseToast} type={toastType}></CustomToast>

            <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Properties</h1>
                <Button className="btn btn-success btn-circle" onClick={(e) => onPropertyFormOpen(undefined, e)}>
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </Button>
            </div>

            <Modal show={showDeleteConfirmation} onHide={handleClose} className="register-dialog property-register-dialog" backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are you sure want to delete property?</h4>
                    <p>All the information related to property will be lost</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteProperty}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPropertyRegister} onHide={handleClose} className="register-dialog property-register-dialog" backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Register Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="user property-register-form" onSubmit={handleSubmit}>
                        <div className="form-group">

                            <input type="text" className="form-control form-control-user" id="name"
                                placeholder="Property Name" name="name" value={formData.name} onChange={handleChange} maxLength='100' />
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <input type="text" className="form-control form-control-user" id="address"
                                    placeholder="Address" name="address" maxLength='100'
                                    value={formData.address} onChange={handleChange} />
                                <p className="text-xs ml-2 mb-0 mt-1">Max Characters: 100</p>
                            </div>
                            <div className="col-sm-6">
                                <Form.Select value={formData.location} onChange={handleChange} name="location" className="form-control">
                                    <option value='' disabled>Location</option>
                                    {
                                        locations.map((i, j) => {
                                            return <option key={i._id} value={i._id}>{i.city}</option>
                                        })
                                    }
                                </Form.Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6">
                                <Form.Select value={formData.propertyType} onChange={handleChange} name="propertyType" className="form-control">
                                    <option value='' disabled>Property Type</option>
                                    {
                                        propertyTypes.map((i, j) => {
                                            return <option key={i._id} value={i._id}>{i.name}</option>
                                        })
                                    }
                                </Form.Select>
                            </div>
                            <div className="col-sm-6">
                                <input type="text" className="form-control form-control-user" name="price"
                                    id="propertyPrice" value={formData.price} placeholder="Price" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6">
                                <Form.Select value={formData.manager} onChange={handleChange} name="manager" className="form-control">
                                    <option value='' disabled>Select Manager</option>
                                    {
                                        managers.map((i, j) => {
                                            return <option key={i._id} value={i._id}>{i.name}</option>
                                        })
                                    }
                                </Form.Select>
                            </div>

                        </div>
                        <div className="form-group">
                        <textarea type="text" className="form-control form-control-user" id="details"
                                    placeholder="Details" name="details" value={formData.details} onChange={handleChange} maxLength='100' />
                                <p className="text-xs ml-2 mb-0 mt-1">Max Characters: 100</p>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {formData.isEdit ? 'Edit Property' : 'Add Property'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="row">
                {
                    properties.length ? properties.map((property, index) => (
                        <div key={index} className="col-xl-4 col-md-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-auto mr-3">
                                            <FontAwesomeIcon icon="fa-solid fa-hotel" className="text-gray-300 property-icon" />
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
                                        <Button variant="outline-warning mr-2" className="action-btn" onClick={(e) => onPropertyFormOpen(property, e)}>Edit</Button>
                                        <Button variant="outline-danger" className="action-btn" onClick={(e) => deleteConfirmation(property, e)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <Alert key="warning" variant="warning">
                        No properties added, please add a property!
                    </Alert>
                }

            </div>
        </div>
    );
};

export default Properties;