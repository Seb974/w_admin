import React, { useContext, useEffect, useState } from 'react';
import { Popup } from 'react-map-gl';
import AuthContext from '../../../../../contexts/AuthContext';
import { isDefined } from '../../../../../helpers/utils';

const LocationTooltip = ({ location }) => {

    const { selectedCatalog } = useContext(AuthContext);

    return !isDefined(location) || JSON.stringify(location.position) === JSON.stringify(selectedCatalog.center) ? <></> : (
        <Popup latitude={location.position[0]} longitude={location.position[1]} offsetLeft={10} offsetTop={-35}>
            <div className="text-center">
                <h4 className="mb-0">Votre adresse</h4>
                <p className="mb-0 mt-0">{ location.address }</p>
                <small className="mt-0">(cliquez pour supprimer)</small>
            </div>
        </Popup>
    );
}

export default LocationTooltip;