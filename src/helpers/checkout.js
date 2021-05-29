import { isInSelectedCountry } from "./map";
import { getFloat, isDefined, isDefinedAndNotVoid } from "./utils";

export const getOrderToWrite = (order, user, informations, productCart, date, objectDiscount, selectedCatalog, condition, settings) => {
    return {
        ...order,
        user: isDefined(user) ? user['@id'] : null,
        deliveryDate: date,
        metas: informations,
        catalog: selectedCatalog['@id'],
        appliedCondition: isDefined(condition) ? condition['@id'] : null,
        promotion: isDefined(objectDiscount) ? objectDiscount['@id'] : null,
        items: productCart.map(item => ({
            ...item, 
            product: item.product['@id'],
            variation: isDefined(item.variation) ? item.variation['@id'] : null,
            size: isDefined(item.size) ? item.size['@id'] : null,
            orderedQty: getFloat(item.orderedQty),
            price: getFloat(item.price),
            unit: item.unit,
            taxRate: !settings.subjectToTaxes ? 0 : item.product.tax.catalogTaxes.find(catalogTax => catalogTax.catalog.id === selectedCatalog.id).percent,
            isAdjourned: false,
            isPrepared: false
        })),
        isRemains: false,
        status: !isDefined(order.status) ? "WAITING" : order.status
    };
};

export const getPreparedOrder = order => {
    const { user, metas, catalog, appliedCondition, promotion, items } = order;
    return {
        ...order,
        user: isDefined(user) ? (typeof user === 'object' ? user['@id'] : user) : null,
        metas: isDefined(metas) ? (typeof metas === 'object' ? metas['@id'] : metas) : null,
        catalog: isDefined(catalog) ? (typeof catalog === 'object' ? catalog['@id'] : catalog) : null,
        appliedCondition: isDefined(appliedCondition) ? (typeof appliedCondition === 'object' ? appliedCondition['@id'] : appliedCondition) : null,
        promotion: isDefined(promotion) ? (typeof promotion === 'object' ? promotion['@id'] : promotion) : null,
        items: items.map(item => ({
            ...item, 
            product: isDefined(item.product) ? (typeof item.product === 'object' ? item.product['@id'] : item.product) : null,
            variation: isDefined(item.variation) ? (typeof item.variation === 'object' ? item.variation['@id'] : item.variation) : null,
            size: isDefined(item.size) ? (typeof item.size === 'object' ? item.size['@id'] : item.size) : null,
            preparedQty: getFloat(item.preparedQty),
            isAdjourned: item.isAdjourned,
            isPrepared: true
        })),
        isRemains: false,
        status: "PREPARED"
    };
}

export const validateForm = (user, informations, catalog, condition, relaypoints) => {
    let errors = {};
    let isCatalogError = false;
    let notDeliverableAddress = false;
    if (!isValidName(user.name))
        errors['name'] = "Le nom n'est pas renseigné."
    if (!isValidEmail(user.email))
        errors['email'] = "L'adresse email est invalide ou non renseignée."
    if (!isValidPhoneNumber(informations.phone))
        errors['phone'] = "Le numéro de téléphone est invalide ou non renseigné."
    if (!isValidAddress(informations, catalog, condition, relaypoints))
        errors['address'] = "L'adresse n'est pas valide."
    else if (!isValidCatalog(catalog, informations)) {
        errors['address'] = "Adresse non disponible depuis le catalogue sélectionné."
        isCatalogError = true;
    } else if (!isDeliverable(catalog, condition)) {
        errors['address'] = "Pas de livraison à domicile à cette adresse."
        notDeliverableAddress = true;
    }
    return errors;
}

export const isValidName = name => {
    return name.length > 0;
}

export const isValidEmail = email => {
    const pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    return isDefinedAndNotVoid(email.match(pattern));
}

export const isValidPhoneNumber = phoneNumber => {
    const pattern1 = /^(?:(?:\+|00)33|(?:\+|00)262|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/g;
    const pattern = /^(?:(?:\+|00)33|(?:\+|00)262|0)[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/g;
    return isDefinedAndNotVoid(phoneNumber.match(pattern));
}

export const isValidAddress = (informations, catalog, condition, relaypoints) => {
    const zipPattern = /^(?:[0-9]\d|9[0-8])\d{3}$/g;
    if ( isDefinedAndNotVoid(informations.zipcode.match(zipPattern)) ) {
        const { city, address, position } = informations;
        const initialPosition = isDefined(catalog) && isDefinedAndNotVoid(catalog.center) ? catalog.center : [0, 0];
        return city.length > 0 && address.length > 0 && (!isSamePosition(position, initialPosition) || isRelaypoint(condition, relaypoints));
    }
    return false;
}

export const isValidCatalog = (catalog, informations) => {
    const { position } = informations;
    return isInSelectedCountry(position[0], position[1], catalog);
};

const isDeliverable = (catalog, condition) => {
    return isDefined(catalog) && (catalog.needsParcel || (!catalog.needsParcel && isDefined(condition)));
};

const isSamePosition = (position1, position2) => JSON.stringify(position1) === JSON.stringify(position2);

const isRelaypoint = (condition, relaypoints) => {
    if (!isDefined(condition) || !isDefinedAndNotVoid(relaypoints)) {
        return false;
    }
    const selectedRelaypoint = relaypoints.find(relaypoint => relaypoint.conditions.find(c => c.id === condition.id) !== undefined);
    return isDefined(selectedRelaypoint);
}