const knex = require('./connection.js');

async function all(filters) {
    // list name, owner, deleted
    const { name, owner, deleted }= filters;
    return knex('lists').where({
        ...(owner && { owner }),
        ...(deleted && { deleted })
    }).modify((queryBuilder) => {
        if(name) queryBuilder.whereLike('name', `%${name}`)
    })
}

async function create(payload) {
    const results = await knex('users').insert(payload).returning('*');

    return results[0];
}

async function get(id) {
    // get all the tasks from todo table
    
    const results = await knex('users').where({id});
    return results[0];
}

async function update(id, properties) {
    const results = await knex('users').where({id}).update({...properties}).returning('*');

    return results[0];
}

module.exports = {
    all,
    create,
    get,
    update
}