import {TextIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const linkTitle = defineField({
  title: 'Title',
  name: 'linkTitle',
  type: 'object',
  icon: TextIcon,
  components: {
    annotation: (props) => (
      <span>
        <TextIcon
          style={{
            marginLeft: '0.05em',
            marginRight: '0.1em',
            width: '0.75em',
          }}
        />
        {props.renderDefault(props)}
      </span>
    ),
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
