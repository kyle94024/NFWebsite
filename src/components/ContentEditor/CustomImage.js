// CustomImage.js
import { Image } from '@tiptap/extension-image'

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: element => {
          const srcValue = element.getAttribute('src')
          // Allow data: URIs, http, https, or / (relative)
          if (
            srcValue?.startsWith('data:') ||
            srcValue?.startsWith('http') ||
            srcValue?.startsWith('/')  
          ) {
            return srcValue
          }
          return null
        },
        renderHTML: attributes => {
          if (!attributes.src) {
            return {}
          }
          return {
            src: attributes.src,
          }
        },
      },
    }
  },
})
