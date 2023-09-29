/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema
      .createTable('groups', function(table) {
        table.increments('group_id').primary();
        table.string('group_name').notNullable();
      })
      .createTable('group_messages', function(table) {
        table.increments('message_id').primary();
        table.integer('sender_id').unsigned().notNullable();
        table.integer('group_id').unsigned().notNullable();
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.text('message_content');
        table.foreign('sender_id').references('user_id').inTable('users');
        table.foreign('group_id').references('group_id').inTable('groups');
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function(knex) {
    return knex.schema
      .dropTableIfExists('group_messages')
      .dropTableIfExists('groups');
  };
  