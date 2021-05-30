import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import FarmActions from 'src/services/FarmActions';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormGroup, CInput, CInvalidFeedback, CLabel, CRow, CTextarea, CSwitch, CInputGroup, CInputGroupAppend, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { getDateFrom, isDefined, getNumericOrNull, getInt, getFloat } from 'src/helpers/utils';
import { getWeekDays } from 'src/helpers/days';
import AddressPanel from 'src/components/farmPages/AddressPanel';
import Select from 'src/components/forms/Select';
import Image from 'src/components/forms/image';


const initialPosition = [-21.329519, 55.471617];
const initialInformations = { name: '', address: '', address2: '', zipcode: '', city: '', position: initialPosition, description: '', energy: 'SOLAIRE', beginAt: '', investmentCost: '', computer: '', power: '', dailyProfit: '', profitPercent: '', partPrice: '', image: null};

const Farm = ({ match, history }) => {

    const { id = "new" } = match.params;
    const [editing, setEditing] = useState(false);
    const defaultErrors = {name:"", address: "", address2: "", zipcode: "", city: "", position: "", description: "", energy: '', beginAt: '', investmentCost: '', computer: '', power: '', dailyProfit: '', profitPercent: '', partPrice: '', image: ''};
    const [farm, setFarm] = useState(initialInformations);
    const [errors, setErrors] = useState(defaultErrors);

    useEffect(() => {
        fetchFarms(id);
    }, []);

    useEffect(() => fetchFarms(id), [id]);

    // const onInformationsChange = (newFarm) => {
    //     setFarm(newFarm)
    // };
    const handleChange = ({ currentTarget }) => setFarm({...farm, [currentTarget.name]: currentTarget.value});

    const onUpdatePosition = ({position, address, zipcode, city}) => {
        setFarm({...farm, position, address, zipcode, city});
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
        const farmToWrite = getFarmToWrite();
        console.log(farmToWrite);
        if (farmToWrite.image && !farmToWrite.image.filePath) {
            console.log(farmToWrite.image);
            FarmActions.createImage(farmToWrite.image)
                       .then(image => {
                            writeFarm({...farmToWrite, picture: image});
                       });
        } else {
            writeFarm(farmToWrite);
        }
    };

    const writeFarm = farmToWrite => {
        const request = !editing ? FarmActions.create(farmToWrite) : FarmActions.update(id, farmToWrite);
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
    }

    const getFarmToWrite = () => {
        return {
            ...farm,
            beginAt: getInt(farm.beginAt),
            computer: getInt(farm.computer),
            dailyProfit: getFloat(farm.dailyProfit),
            investmentCost: getFloat(farm.investmentCost),
            partPrice: getFloat(farm.partPrice),
            power: getFloat(farm.power),
            profitPercent: parseFloat(getFloat(farm.profitPercent) / 100)
        };
    }

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
                                <CCol xs="12" sm="12" md="4">
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
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="investmentCost">Montant de l'investissement</CLabel>
                                        <CInput
                                            id="investmentCost"
                                            name="investmentCost"
                                            value={ farm.investmentCost }
                                            onChange={ handleChange }
                                            placeholder="Montant"
                                            invalid={ errors.investmentCost.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.investmentCost }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="beginAt">Année de démarrage</CLabel>
                                        <CInput
                                            id="beginAt"
                                            name="beginAt"
                                            type="number"
                                            value={ farm.beginAt }
                                            onChange={ handleChange }
                                            placeholder="Année"
                                            invalid={ errors.beginAt.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.beginAt }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <Image product={farm} setProduct={setFarm} />

                            <hr/>
                            <CRow className="mt-0 mb-3">
                                <CCol sm="12" md="4">
                                    <Select name="energy" id="energy" label="Energie utilisée" onChange={ handleChange } error={ errors.energy }>
                                        <option value="SOLAIRE">SOLAIRE</option>
                                        <option value="EOLIEN">EOLIEN</option>
                                        <option value="GEOTHERMIQUE">GEOTHERMIQUE</option>
                                        <option value="HYDRAULIQUE">HYDRAULIQUE</option>
                                    </Select>
                                </CCol>
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="power">Puissance</CLabel>
                                        <CInput
                                            id="power"
                                            name="power"
                                            value={ farm.power }
                                            onChange={ handleChange }
                                            placeholder="Puissance"
                                            invalid={ errors.power.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.power }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="computer">Nombre d'ordinateurs</CLabel>
                                        <CInput
                                            id="computer"
                                            name="computer"
                                            type="number"
                                            value={ farm.computer }
                                            onChange={ handleChange }
                                            placeholder="Ordinateurs"
                                            invalid={ errors.computer.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.computer }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            
                            <CRow className="mt-0 mb-3">
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="dailyProfit">Production journalière</CLabel>
                                        <CInput
                                            id="dailyProfit"
                                            name="dailyProfit"
                                            value={ farm.dailyProfit }
                                            onChange={ handleChange }
                                            placeholder="Production"
                                            invalid={ errors.dailyProfit.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.dailyProfit }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="profitPercent">Profit</CLabel>
                                        <CInputGroup>
                                            <CInput
                                                id="profitPercent"
                                                name="profitPercent"
                                                value={ farm.profitPercent }
                                                onChange={ handleChange }
                                                placeholder="Profit"
                                                invalid={ errors.profitPercent.length > 0 } 
                                            />
                                            <CInputGroupAppend>
                                                    <CInputGroupText>%</CInputGroupText>
                                            </CInputGroupAppend>
                                        </CInputGroup>
                                        <CInvalidFeedback>{ errors.profitPercent }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="12" sm="12" md="4">
                                    <CFormGroup>
                                        <CLabel htmlFor="partPrice">Valeur d'une part</CLabel>
                                        <CInput
                                            id="partPrice"
                                            name="partPrice"
                                            value={ farm.partPrice }
                                            onChange={ handleChange }
                                            placeholder="Valeur"
                                            invalid={ errors.partPrice.length > 0 } 
                                        />
                                        <CInvalidFeedback>{ errors.partPrice }</CInvalidFeedback>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <hr/>
                            <CRow>
                                <h4 className="ml-3 mt-3">Adresse</h4>
                            </CRow>
                            <AddressPanel informations={ farm } onInformationsChange={ setFarm } onPositionChange={ onUpdatePosition } errors={ errors }/>
                            <CRow className="mt-0 mb-3">
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="textarea-input">Description du projet</CLabel>
                                    <CTextarea name="description" id="description" rows="5" placeholder=" " onChange={ handleChange } value={ farm.description }/>
                                </CCol>
                            </CRow>
                            <CRow className="mt-4 d-flex justify-content-center">
                                <CButton type="submit" size="sm" color="success"><CIcon name="cil-save"/> Enregistrer</CButton>
                            </CRow>
                            
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <Link to="/components/farms" className="btn btn-link">Retour à la liste</Link>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

            // dailyProfit: '', profitPercent: '', partPrice: ''
    );
}
 
export default Farm;