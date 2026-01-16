import {Box, Card, Flex, Text} from '@sanity/ui'

interface ProductModulePreviewProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export default function ProductModulePreview({title, subtitle, imageUrl}: ProductModulePreviewProps) {
  return (
    <Card padding={3}>
      <Flex align="center" gap={3}>
        {imageUrl && (
          <Box style={{width: '50px', height: '50px', flexShrink: 0}}>
            <img
              src={imageUrl}
              alt={title || 'Product'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Box>
        )}
        <Box flex={1}>
          <Text size={1} weight="medium">
            {title || 'No product selected'}
          </Text>
          {subtitle && (
            <Text size={1} muted>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Card>
  )
}
