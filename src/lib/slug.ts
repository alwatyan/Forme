import type { FieldHook, TextField } from 'payload'

export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/** A unique slug that is generated from `sourceField` when left empty. */
export function slugField(sourceField = 'name'): TextField {
  const formatSlug: FieldHook = ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[sourceField]
    if (typeof source === 'string' && source.trim()) {
      return slugify(source) || Math.random().toString(36).slice(2, 10)
    }
    return value
  }

  return {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Used in the web address. Leave empty to generate it from the name.',
    },
    hooks: { beforeValidate: [formatSlug] },
  }
}
