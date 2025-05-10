const knex = require("./connection.js");

async function all(filters) {
    const { role, status } = filters;
    // filter role and status
    return knex('users').where({
        ...(role && { role }),
        ...(status && { status })
    });
    
}

async function create(payload) {
    const results = await knex('users').insert(payload).returning('*');

    return results[0];
}

async function clear() {
    return knex['users'].del().returning('*');
}

async function get(id) {
    const results = await knex('users').where({ id });

    return results[0];
}

async function patch(id, properties) {
    const results = await knex('users').where({ id }).update({...properties}).returning('*');

    return results[0];
}


module.exports = {
    clear,
    create,
    all,
    get,
    patch
}