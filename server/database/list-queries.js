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
    const results = await knex('lists').insert(payload).returning('*');

    return results[0];
}

async function get(id, filters) {
    // get all the tasks from todo table
    
    const results = await knex('lists').where({id, ...filters});
    return results[0];
}

async function update(id, properties) {
    const results = await knex('lists').where({id}).update({...properties}).returning('*');

    return results[0];
}

module.exports = {
    all,
    create,
    get,
    update
}