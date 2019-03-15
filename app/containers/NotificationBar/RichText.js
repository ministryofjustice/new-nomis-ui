import React from 'react'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Paragraph from './RichText.styles'

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <strong>{text}</strong>,
    [MARKS.ITALIC]: text => <em>{text}</em>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
    [INLINES.HYPERLINK]: (node, children) => (
      // Update to @govuk-react/link when out of Alpha
      <a className="link" href={node.data.uri}>
        {children}
      </a>
    ),
  },
}

const RichText = ({ content }) => documentToReactComponents(content, options)

export default RichText
