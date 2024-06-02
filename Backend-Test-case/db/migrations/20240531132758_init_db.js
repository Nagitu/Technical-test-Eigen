/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('books', function(table) {
            table.string('code').notNullable().unique().primary();
            table.string('title').notNullable();
            table.string('author').notNullable();
            table.integer('stock').notNullable();
        }),
        knex.schema.createTable('members', function(table) {
            table.string('code').notNullable().unique().primary();
            table.string('name').notNullable();
            table.date('warningDate')
        }),
        knex.schema.createTable('borrows', function(table){
            table.increments('id').notNullable().primary();
            table.string('memberCode').unsigned().notNullable();
            table.string('bookCode').unsigned().notNullable();
            table.foreign('memberCode').references('members.code').onDelete('CASCADE');
            table.foreign('bookCode').references('books.code').onDelete('CASCADE');
            table.date('borrowedDate').notNullable();
            table.date('returnedDate').nullable();
            table.boolean('returned').defaultTo(false);
        })
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('borrows'),
        knex.schema.dropTable('members'),
        knex.schema.dropTable('books'),
    ]);
};
