import React, { useContext, useEffect, useState } from 'react';
import { FlyToInterpolator } from 'react-map-gl';
import AuthContext from '../../../../contexts/AuthContext';
import Geocoder from 'react-map-gl-geocoder';
import { multilanguage } from "redux-multilanguage";
import { isDefined } from '../../../../helpers/utils';

const SearchBar = ({ mapRef, containerRef, informations, setLocationPopup, setViewport, updatePosition, strings }) => {

    const { country } = useContext(AuthContext);

    const searchParams = { 
        mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_TOKEN, 
        countries: country, 
        language: "fr", 
        minLength: 6, 
        marker: false,
        limit: 5,
        types: "address, postcode"
    };

    const onResult = ({ result }) => {
        setLocationPopup(undefined);
        const { center, place_name, context } = result;
        const postcode = context.find(data => data.id.includes("postcode"));
        const city = context.find(data => data.id.includes("place"));
        const suggestion = {
            latlng: {lat: center[1], lng: center[0]}, 
            value: place_name, 
            postcodes: [isDefined(postcode) ? postcode.text : ""], 
            city: isDefined(city) ? city.text : ""
        };
        const view = {
            latitude: center[1],
            longitude: center[0],
            zoom: 17,
            transitionDuration: 1800,
            transitionInterpolator: new FlyToInterpolator()
        };
        setViewport(view);
        updatePosition(suggestion);
    }

    return !isDefined(informations) || !isDefined(informations.address) ? <></> : (
        <Geocoder 
            mapRef={ mapRef } 
            containerRef={ containerRef } 
            onResult={ onResult } 
            inputValue={ "" } 
            placeholder={ informations.address.length > 0 ? informations.address : strings['address'] } 
            {...searchParams}
        />
    );
}
 
export default multilanguage(SearchBar);