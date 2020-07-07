exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id').primary();
  table.string('firstName').notNullable();
  table.string('lastName').notNullable();
  table.string('avatar').defaultTo("");
  table.string('email').defaultTo("");
  table.string('phoneNumber').defaultTo("");
  table.string('password').defaultTo("");
  table.string('city').defaultTo("");
  table.text('describe').defaultTo("");
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTableIfExists('users');
