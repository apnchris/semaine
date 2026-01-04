import {EarthGlobeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const linkCreditsType = defineField({
  title: 'Credits',
  name: 'linkCredits',
  type: 'object',
  icon: EarthGlobeIcon,
  components: {
    annotation: (props) => (
      <span>
        <EarthGlobeIcon
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
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'portableTextSimple',
    }),
  ],
})
