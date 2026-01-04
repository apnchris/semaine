import {UserIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {personFields} from './personFields'

export const tasteMaker = defineType({
  name: 'tasteMaker',
  title: 'Taste Maker',
  icon: UserIcon,
  type: 'document',
  fields: personFields,
  preview: {
    select: {
      name: 'name',
      title: 'title',
      picture: 'picture',
    },
    prepare(selection) {
      return {
        title: `${selection.name}`,
        subtitle: 'Taste Maker',
        media: selection.picture,
      }
    },
  },
})
