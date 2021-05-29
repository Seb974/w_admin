import React from 'react';
import LocationMarker from './tools/LocationMarker';
import LocationPopup from './tools/LocationPopup';
import LocationTooltip from './tools/LocationTooltip';

const LocationTools = ({ informations, locationTooltip, locationPopup, setLocationTooltip, setLocationPopup, setViewport, onClear }) => {
    return (
        <>
            <LocationMarker
                position={ informations.position } 
                informations={ informations } 
                setTooltip={ setLocationTooltip } 
                setPopup={ setLocationPopup }
            />
            <LocationTooltip 
                location={ locationTooltip }
            />
            <LocationPopup
                location={ locationPopup } 
                setViewport={ setViewport } 
                setPopup={ setLocationPopup } 
                onClear={ onClear } 
            />
        </>
    );
}
 
export default LocationTools;