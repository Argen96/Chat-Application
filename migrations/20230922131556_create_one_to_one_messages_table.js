export const up  = function(knex) {
    console.log('Creating one_on_one_messages table...'); // Add this line
    return knex.schema.createTable('one_on_one_messages', function(table) {
      table.increments('message_id').primary();
      table.integer('sender_id').unsigned().notNullable();
      table.integer('recipient_id').unsigned().notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.text('message_content');
      table.foreign('sender_id').references('user_id').inTable('users');
      table.foreign('recipient_id').references('user_id').inTable('users');
    });
  };
  
  export const down  = function(knex) {
    return knex.schema.dropTableIfExists('one_on_one_messages');
  };
  