import * as migration_20261018_115606_initial from './20261018_115606_initial'

export const migrations = [
  {
    up: migration_20261018_115606_initial.up,
    down: migration_20261018_115606_initial.down,
    name: '20261018_115606_initial',
  },
]
