import {PackageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const linkGroup = defineField({
  name: 'linkGroup',
  title: 'Link group',
  type: 'object',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}, {type: 'linkCredits'}],
    }),
  ],
})
