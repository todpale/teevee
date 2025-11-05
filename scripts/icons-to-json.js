import { dirname } from 'path'
import { promises as fs } from 'fs'
import {
  runSVGO,
  cleanupSVG,
  parseColors,
  isEmptyColor,
  importDirectory
} from '@iconify/tools'

// File to save icon set to
const TARGET_FILE = 'src/assets/icons/icons.json'
const SOURCE_SVG_DIR = 'src/assets/icons/svg'

// Prefix to use for icon set
const prefix = 'tv'

// Expected icon size. Used in validating icons, remove if you don't need to validate icons
const expectedSize = 24

// Icon set information
const info = {
  name: 'teevee Icons',
  height: 24
};

// Import icons
(async function () {
  // Import icons
  const iconSet = await importDirectory(SOURCE_SVG_DIR, { prefix })

  // Set info
  iconSet.info = info

  // Validate, clean up, fix palette and optimize
  await iconSet.forEach((name, type) => {
    if (type !== 'icon') {
      return
    }

    // Get SVG instance for parsing
    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    // Check icon size
    const viewBox = svg.viewBox
    if (viewBox.width !== expectedSize || viewBox.height !== expectedSize) {
      console.error(
        `Icon ${name} has invalid dimensions: ${viewBox.width} x ${viewBox.height}`
      )
      iconSet.remove(name)
      return
    }

    // Clean up and optimize icons
    try {
      // Clean up icon code
      cleanupSVG(svg)

      // Replace color with currentColor, add if missing
      parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor'
        }
      })

      // Optimise
      runSVGO(svg)
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon from SVG instance
    iconSet.fromSVG(name, svg)
  })
  console.log(`Imported ${iconSet.count()} icons`)

  // Export to IconifyJSON, convert to string
  const output = JSON.stringify(iconSet.export(), null, '\t')

  // Create directory for output if missing
  const dir = dirname(TARGET_FILE)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err) {
    console.error('Directory creation error: ', err)
  }

  // Save to file
  await fs.writeFile(TARGET_FILE, output, 'utf8')

  console.log(`Saved ${TARGET_FILE} (${output.length} bytes)`)
})().catch((err) => {
  console.error(err)
})
