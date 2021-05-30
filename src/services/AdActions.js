import api from 'src/config/api';

function findAll() {
    return api
        .get('/api/ads')
        .then(response => response.data['hydra:member']);
}

function deleteAd(id) {
    return api
        .delete('/api/ads/' + id);
}

function find(id) {
    return api.get('/api/ads/' + id)
                .then(response => response.data);
}

function update(id, ad) {
    return api.put('/api/ads/' + id, ad);
}

function create(ad) {
    return api.post('/api/ads', ad);
}


export default {
    findAll,
    delete: deleteAd,
    find,
    update,
    create
}