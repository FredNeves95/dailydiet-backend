import { randomUUID } from 'crypto'
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(randomUUID())
    table.text('user_name').notNullable()
    table.text('user_email').unique().notNullable()
    table.text('user_phone')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(randomUUID())
    table.text('meal_name').notNullable()
    table.text('meal_description').notNullable()
    table.dateTime('meal_date').notNullable()
    table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now())
    table.uuid('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('meals')
}
