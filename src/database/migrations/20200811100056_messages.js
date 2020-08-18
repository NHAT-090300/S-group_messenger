
exports.up = (knex) => knex.schema.createTable('messages', (table)=> {
    table.increments('id');
    table.integer('senderID').references('id').inTable('users');
    table.integer('receiverID').references('id').inTable('users');
    table.string('message').notNullable();
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
});
exports.down = (knex) => knex.schema.dropTableIfExists('messages');
