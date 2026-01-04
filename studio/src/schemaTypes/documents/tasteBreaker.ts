import {UserIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {personFields} from './personFields'

export const tasteBreaker = defineType({
  name: 'tasteBreaker',
  title: 'Taste Breaker',
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
        subtitle: 'Taste Breaker',
        media: selection.picture,
      }
    },
  },
})
