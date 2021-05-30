import React, { useEffect, useState } from 'react';
// import ProductsContext from '../../contexts/ProductsContext';
import MercureHub from '../../components/Mercure/MercureHub';
import AuthContext from '../../contexts/AuthContext';
import AuthActions from '../../services/AuthActions';
// import ProductActions from 'src/services/ProductActions';
// import DeliveryContext from 'src/contexts/DeliveryContext';
// import ContainerActions from 'src/services/ContainerActions';
// import CatalogActions from 'src/services/CatalogActions';
// import CategoryActions from 'src/services/CategoryActions';
// import RelaypointActions from 'src/services/RelaypointActions';
// import ContainerContext from 'src/contexts/ContainerContext';
import { isDefined, isDefinedAndNotVoid } from 'src/helpers/utils';
import FarmActions from 'src/services/FarmActions';
import FarmContext from 'src/contexts/FarmContext';

const DataProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthActions.isAuthenticated());
    const [currentUser, setCurrentUser] = useState(AuthActions.getCurrentUser());
    const [settings, setSettings] = useState(null);
    const [eventSource, setEventSource] = useState({});
    const [farms, setFarms] = useState([]);

    useEffect(() => {
        AuthActions.setErrorHandler(setCurrentUser, setIsAuthenticated);
        FarmActions
            .findAll()
            .then(response => setFarms(response));
    },[]);

    useEffect(() => {
        setCurrentUser(AuthActions.getCurrentUser());
        console.log(currentUser);
    }, [isAuthenticated]);


    return (
        <AuthContext.Provider value={ {isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, eventSource, setEventSource, settings, setSettings} }>
        <FarmContext.Provider value={ {farms, setFarms} }>
            {/* <MercureHub> */}
                { children }
            {/* </MercureHub> */}
        </FarmContext.Provider>
        </AuthContext.Provider>
    );
}
 
export default DataProvider;