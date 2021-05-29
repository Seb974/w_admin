import React from 'react';
import { Popup, FlyToInterpolator } from 'react-map-gl';
import { useToasts } from 'react-toast-notifications';
import { isDefined } from '../../../../../helpers/utils';
import AddressPanel from '../../../../forms/address/AddressPanel';

const LocationPopup = ({ location, setViewport, setPopup, onClear }) => {

    const { addToast } = useToasts();
    const initialPosition = AddressPanel.getInitialPosition();

    const onDeleteSelection = () => {
        setViewport({
            latitude: initialPosition[0],
            longitude: initialPosition[1],
            zoom: 9,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator(),
        });
        onClear();
        addToast("Adresse effacée", { appearance: "error", autoDismiss: true });
        setPopup(undefined);
    };

    return !isDefined(location) ? <></> : (
        <Popup latitude={location.position[0]} longitude={location.position[1]} offsetLeft={10} offsetTop={-35} closeOnClick={ false } onClose={() => setPopup(undefined)}>
            <div className="d-flex flex-column align-items-center">
                <h5 className="mb-0 mt-1">Votre adresse</h5>
                <button className="btn btn-warning" onClick={ onDeleteSelection }>Effacer mon adresse</button>
            </div>
        </Popup>
    );
}

export default LocationPopup;