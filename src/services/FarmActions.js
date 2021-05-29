import api from 'src/config/api';

function findAll() {
    return api
        .get('/api/farms')
        .then(response => response.data['hydra:member']);
}

function deleteFarm(id) {
    return api
        .delete('/api/farms/' + id);
}

function find(id) {
    return api.get('/api/farms/' + id)
                .then(response => response.data);
}

function update(id, user) {
    return api.put('/api/farms/' + id, user);
}

function create(user) {
    return api.post('/api/farms', user);
}

export default {
    findAll,
    delete: deleteFarm,
    find,
    update,
    create
}