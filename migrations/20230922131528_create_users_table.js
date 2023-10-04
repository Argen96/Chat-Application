/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('user_id').primary();
    table.string('first_name').notNullable();
    table.string('password_hash').nullable();
    table.string('email').notNullable().unique();
    table.string('last_name').notNullable();
    table.string('google_id').nullable();
    table.string('email_token').nullable();
    table.timestamp('registration_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
