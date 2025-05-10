const knex = require("./connection.js");

async function all(filters) {
    const { deleted, status, listId, assignedTo, order, title} = filters;
    console.log({title});
    return knex('todos').where({
        ...(order && { order }),
        ...(deleted && { deleted }),
        ...(status && { status }),
        ...(listId && { listId }),
        ...(assignedTo && { assignedTo })
    }).modify((queryBuilder) => {
        if(title) queryBuilder.whereLike('title', `%${title}%`)
    });
}

async function get(id) {
    const results = await knex('todos').where({ id });
    return results[0];
}

async function create(payload) {
    const results = await knex('todos').insert(payload).returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('todos').where({ id }).update({ ...properties }).returning('*');
    return results[0];
}

// delete is a reserved keyword
async function del(id) {
    const results = await knex('todos').where({ id }).del().returning('*');
    return results[0];
}

async function clear() {
    return knex('todos').del().returning('*');
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    clear
}