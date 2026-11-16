import * as migration_20261018_115606_initial from './20261018_115606_initial'
import * as migration_20261116_160056_vercel_blob from './20261116_160056_vercel_blob'
import * as migration_20261116_171819_product_subtitle from './20261116_171819_product_subtitle'

export const migrations = [
  {
    up: migration_20261018_115606_initial.up,
    down: migration_20261018_115606_initial.down,
    name: '20261018_115606_initial',
  },
  {
    up: migration_20261116_160056_vercel_blob.up,
    down: migration_20261116_160056_vercel_blob.down,
    name: '20261116_160056_vercel_blob',
  },
  {
    up: migration_20261116_171819_product_subtitle.up,
    down: migration_20261116_171819_product_subtitle.down,
    name: '20261116_171819_product_subtitle',
  },
]
