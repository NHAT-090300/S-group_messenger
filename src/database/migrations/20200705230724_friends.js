exports.up = (knex) => knex.schema.createTable('friends', (table) => {
    table.increments('id');
    table.integer('userId').references('id').inTable('users');
    table.integer('firendId').references('id').inTable('users');
    table.string('message').notNullable();
    table.integer('receiver').references('id').inTable('users');
    table.integer('status').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  exports.down = (knex) => knex.schema.dropTableIfExists('firends');
