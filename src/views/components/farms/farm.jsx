import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import FarmActions from 'src/services/FarmActions';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormGroup, CInput, CInvalidFeedback, CLabel, CRow, CTextarea, CSwitch, CInputGroup, CInputGroupAppend, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { getDateFrom, isDefined, getNumericOrNull } from 'src/helpers/utils';
import { getWeekDays } from 'src/helpers/days';
import AddressPanel from 'src/components/farmPages/AddressPanel';

const initialPosition = [-21.329519, 55.471617];
const initialInformations = { name: '', address: '', address2: '', zipcode: '', city: '', position: initialPosition, description: ''};

const Farm = ({ match, history }) => {

    const { id = "new" } = match.params;
    const [editing, setEditing] = useState(false);
    const defaultErrors = {name:"", address: "", address2: "", zipcode: "", city: "", position: "", description: ""};
    const [farm, setFarm] = useState(initialInformations);
    const [errors, setErrors] = useState(defaultErrors);

    useEffect(() => {
        fetchFarms(id);
    }, []);

    useEffect(() => fetchFarms(id), [id]);

    const onInformationsChange = (newFarm) => setFarm(newFarm);
    const handleChange = ({ currentTarget }) => setFarm({...farm, [currentTarget.name]: currentTarget.value});

    const onUpdatePosition = (newFarm) => {
        setFarm(farm => {
            return {...newFarm, address2: farm.address2};
        });
    };

    const fetchFarms = id => {
        if (id !== "new") {
            setEditing(true);
            FarmActions.find(id)
                .then( response => setFarm(response))
                .catch(error => {
                    console.log(error);
                    // TODO : Notification flash d'une erreur
                    history.replace("/components/farms");
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = !editing ? FarmActions.create(farm) : FarmActions.update(id, farm);
        request.then(response => {
                    setErrors(defaultErrors);
                    //TODO : Flash notification de succès
                    history.replace("/components/farms");
                })
               .catch( ({ response }) => {
                   if (response) {
                       const { violations } = response.data;
                       if (violations) {
                           const apiErrors = {};
                           violations.forEach(({propertyPath, message}) => {
                               apiErrors[propertyPath] = message;
                           });
                           setErrors(apiErrors);
                       }
                       //TODO : Flash notification d'erreur
                   }
               });
    };

    return (
        <CRow>
            <CCol xs="12" sm="12">
                <CCard>
                    <CCardHeader>
                        <h3>Créer une ferme de minage</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={ handleSubmit }>
                            <CRow>
                                <CCol xs="12" sm="12" md="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="name">Nom</CLabel>
                                        <CInput
                                            id="name"
                                            name="name"
                                            value={ farm.name }
                                            onChange={ handleChange }
                                            placeholder="Nom de la ferme"
                                            invalid={ errors.name.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.name }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                                {/* <CCol xs="12" sm="12" md="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="name">Ville</CLabel>
                                        <CInput
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={ farm.city }
                                            onChange={ onPhoneChange }
                                            placeholder="Ville"
                                            invalid={ errors.city.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.city }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol> */}
                            </CRow>
                            <CRow>
                                <h4 className="ml-3 mt-3">Adresse</h4>
                            </CRow>
                            <AddressPanel informations={ farm } onInformationsChange={ onInformationsChange } onPositionChange={ onUpdatePosition } errors={ errors }/>
                            <CRow className="mt-0 mb-3">
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="textarea-input">Informations sur le point relais</CLabel>
                                    <CTextarea name="description" id="description" rows="5" placeholder="horaires..." onChange={ handleChange } value={ farm.description }/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <Link to="/components/farms" className="btn btn-link">Retour à la liste</Link>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
    );
}
 
export default Farm;