import rawIconData from './icons.json'
import { addCollection, type IconifyJSON } from '@iconify/vue'

const iconData = rawIconData as unknown as IconifyJSON

export function initIconify() {
  addCollection(iconData)
}
