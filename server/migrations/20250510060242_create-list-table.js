/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('lists', function(table) {
      table.string('id');
      table.string('name');
      table.string('owner');
      table.foreign('owner').references('id').inTable('users');
      table.boolean('deleted').defaultTo(false);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('lists');
  };
  