import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import AdActions from 'src/services/AdActions';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormGroup, CInput, CInvalidFeedback, CLabel, CRow, CTextarea, CSwitch, CInputGroup, CInputGroupAppend, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { getDateFrom, isDefined, getNumericOrNull, getInt, getFloat } from 'src/helpers/utils';
import { getWeekDays } from 'src/helpers/days';
import AddressPanel from 'src/components/farmPages/AddressPanel';
import Select from 'src/components/forms/Select';
import Image from 'src/components/forms/image';
import FarmContext from 'src/contexts/FarmContext';

const Ad = ({ match, history }) => {

    const { id = "new" } = match.params;
    const { farms } = useContext(FarmContext);
    const [editing, setEditing] = useState(false);
    const defaultErrors = {farm: "", used: "", usageLimit: ""};
    const [ad, setAd] = useState({farm:farms[0]['@id'], used: 0, usageLimit: 50});
    const [errors, setErrors] = useState(defaultErrors);

    useEffect(() => {
        fetchAd(id);
    }, []);

    useEffect(() => fetchAd(id), [id]);

    const handleChange = ({ currentTarget }) => setAd({...ad, [currentTarget.name]: currentTarget.value});

    const fetchAd = id => {
        if (id !== "new") {
            setEditing(true);
            AdActions.find(id)
                .then( response => setAd(response))
                .catch(error => {
                    console.log(error);
                    // TODO : Notification flash d'une erreur
                    history.replace("/components/ads");
                });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const adToWrite = {...ad, farm: ad.farm}
        console.log(adToWrite);
        writeAd(adToWrite);
    };

    const writeAd = adToWrite => {
        const request = !editing ? AdActions.create(adToWrite) : AdActions.update(id, adToWrite);
        request.then(response => {
                    setErrors(defaultErrors);
                    //TODO : Flash notification de succès
                    history.replace("/components/ads");
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
    }

    // const getAdToWrite = () => {
    //     return {
    //         ...farm,
    //         beginAt: getInt(farm.beginAt),
    //         computer: getInt(farm.computer),
    //         dailyProfit: getFloat(farm.dailyProfit),
    //         investmentCost: getFloat(farm.investmentCost),
    //         partPrice: getFloat(farm.partPrice),
    //         power: getFloat(farm.power),
    //         profitPercent: parseFloat(getFloat(farm.profitPercent) / 100)
    //     };
    // }

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
                                <CCol sm="12" md="6">
                                    <Select name="farm" id="farm" label="Ferme cliente" value={ ad.farm } onChange={ handleChange } error={ errors.farm }>
                                        { farms.map(farm => <option key={farm.id} value={ farm['@id'] }>{ farm.name }</option>)}
                                    </Select>
                                </CCol>
                                <CCol xs="12" sm="12" md="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="usageLimit">Nombre d'utilisation max</CLabel>
                                        <CInput
                                            id="usageLimit"
                                            name="usageLimit"
                                            type="number"
                                            value={ ad.usageLimit }
                                            onChange={ handleChange }
                                            placeholder="Nombre d'utilisation maximal"
                                            invalid={ errors.usageLimit.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.usageLimit }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CRow className="mt-4 d-flex justify-content-center">
                                <CButton type="submit" size="sm" color="success"><CIcon name="cil-save"/> Enregistrer</CButton>
                            </CRow>
                            
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <Link to="/components/ads" className="btn btn-link">Retour à la liste</Link>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

            // dailyProfit: '', profitPercent: '', partPrice: ''
    );
}
 
export default Ad;