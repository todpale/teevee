import { mkdirSync } from 'fs'
import { writeFileSync } from 'node:fs'
import { icons as lucide } from '@iconify-json/lucide'
import { getIcons, iconToSVG, parseIconSet } from '@iconify/utils'

const TARGET_DIR = 'src/assets/icons/svg'

/*
 * Object key is an icon from the set, object value is an actual icon
 */
const sets = {
  lucide: {
    'search': 'search',
    'arrow-big-left': 'arrow-back',
    'arrow-down-wide-narrow': 'sort-desc',
    'arrow-up-narrow-wide': 'sort-asc',
    'chevron-right': 'chevron-right',
    'chevron-left': 'chevron-left',
    'github': 'github',
    'arrow-up-down': 'sort'
  }
}

const getList = (iconSet) => {
  return Object.keys(sets[iconSet])
}

const exportSet = (iconSet) => {
  parseIconSet(iconSet, (name, data) => {
    if (!data) {
      return
    }

    const renderData = iconToSVG(data, { width: '24', height: '24' })
    const svgAttributes = {
      xmlns: 'http://www.w3.org/2000/svg',
      ...renderData.attributes
    }
    const attributesStr = Object.keys(svgAttributes)
      .map((attr) => `${attr}="${svgAttributes[attr]}"`)
      .join(' ')

    const svg = `<svg ${attributesStr}>${renderData.body}</svg>`

    const fileName = `${TARGET_DIR}/${sets[iconSet.prefix][name]}.svg`
    writeFileSync(fileName, svg, 'utf8')
    console.log('Written: ', fileName)
  })
}

mkdirSync(TARGET_DIR, { recursive: true })

const lucideIcons = getIcons(lucide, getList('lucide'))

exportSet(lucideIcons)
