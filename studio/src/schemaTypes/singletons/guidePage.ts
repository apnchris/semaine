import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const guidePage = defineType({
  name: 'guidePage',
  title: 'Guide',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{type: 'picksModule'}, {type: 'gridGuide'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Guide',
      }
    },
  },
})
