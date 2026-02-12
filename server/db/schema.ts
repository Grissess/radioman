import { sqliteTable, integer, text, index, uniqueIndex, customType } from 'drizzle-orm/sqlite-core'

const jsDate = customType<{ data: Date, driverData: number }>({
  dataType() {
    return 'real'
  },
  toDriver(value) {
    return value.getTime()
  },
  fromDriver(value) {
    return new Date(value)
  },
})

export const radios = sqliteTable('radios', {
  id: integer().primaryKey({autoIncrement: true}),
  identifier: text().notNull(),
}, (table) => [
  uniqueIndex('radios_identifier').on(table.identifier),
])

export const people = sqliteTable('people', {
  id: integer().primaryKey({autoIncrement: true}),
  dispName: text().notNull(),
  realName: text().notNull(),
  phone: text(),
  email: text(),
  discord: text(),
}, (table) => [
  index('people_dispName').on(table.dispName),
  index('people_realName').on(table.realName),
])


export const movement = sqliteTable('movement', {
  id: integer().primaryKey({autoIncrement: true}),
  at: jsDate(),
  kind: text().notNull(),
  radio: integer().notNull().references(() => radios.id, {onDelete: 'restrict', onUpdate: 'cascade'}),
  auditor: integer().notNull().references(() => people.id, {onDelete: 'restrict', onUpdate: 'cascade'}),
  possessor: integer().references(() => people.id, {onDelete: 'restrict', onUpdate: 'cascade'}),
}, (table) => [
  index('movement_at').on(table.at),
  index('movement_radio').on(table.radio),
  index('movement_auditor').on(table.auditor),
  index('movement.possessor').on(table.possessor),
])

export const comments = sqliteTable('comments', {
  id: integer().primaryKey({autoIncrement: true}),
  at: jsDate(),
  moveId: integer().notNull().references(() => movement.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
  commenter: integer().notNull().references(() => people.id, {onDelete: 'restrict', onUpdate: 'cascade'}),
  comment: text().notNull(),
}, (table) => [
  index('comments_moveId').on(table.moveId),
])
