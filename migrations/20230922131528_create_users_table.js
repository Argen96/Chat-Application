/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('user_id').primary();
      table.string('username').notNullable();
      table.string('password_hash').notNullable();
      table.string('email').notNullable().unique();
      table.string('full_name');
      table.timestamp('registration_date').defaultTo(knex.fn.now());
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };
  