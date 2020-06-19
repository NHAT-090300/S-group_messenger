exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id').primary();
  table.string('firstName');
  table.string('lastName');
  table.string('avatar');
  table.string('email');
  table.string('phoneNumber');
  table.string('password');
  table.string('city');
  table.text('describe');
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTableIfExists('users');
