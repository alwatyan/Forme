import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// The Siena brand is now spelled Sienna, so its stored value changes with it.
const columns = [
  ['products', 'brand'],
  ['categories', 'brand'],
  ['homepage_blocks_hero', 'logo'],
  ['homepage_blocks_hero', 'link_brand'],
  ['homepage_blocks_products', 'brand'],
  ['homepage_blocks_statement', 'link_brand'],
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, column] of columns) {
    await db.run(
      sql.raw(`UPDATE \`${table}\` SET \`${column}\` = 'sienna' WHERE \`${column}\` = 'siena';`),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, column] of columns) {
    await db.run(
      sql.raw(`UPDATE \`${table}\` SET \`${column}\` = 'siena' WHERE \`${column}\` = 'sienna';`),
    )
  }
}
