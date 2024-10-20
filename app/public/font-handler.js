async function handleFonts() {
  // Add preconnect links
  const preconnectLinks = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: '/variables.css' }
  ]

  preconnectLinks.forEach((link) => {
    const linkElement = document.createElement('link')
    linkElement.rel = link.rel
    linkElement.href = link.href
    if (link.crossorigin) linkElement.crossorigin = link.crossorigin
    document.head.appendChild(linkElement)
  })

  // Fetch and parse variables.css
  const response = await fetch('/variables.css')
  const cssText = await response.text()
  const cssVariables = parseCSSVariables(cssText)

  // Handle custom fonts
  const fontBody = cssVariables['--font-body'] || 'system-ui'
  const fontHeading = cssVariables['--font-heading'] || 'system-ui'

  if (fontBody !== 'system-ui') {
    const linkBody = document.createElement('link')
    linkBody.rel = 'stylesheet'
    linkBody.href = `https://fonts.googleapis.com/css2?family=${fontBody
      .replace(/['"]+/g, '')
      .replace(' ', '+')}&display=swap`
    document.head.appendChild(linkBody)
  }

  if (fontHeading !== 'system-ui') {
    const linkHeading = document.createElement('link')
    linkHeading.rel = 'stylesheet'
    linkHeading.href = `https://fonts.googleapis.com/css2?family=${fontHeading
      .replace(/['"]+/g, '')
      .replace(' ', '+')}&display=swap`
    document.head.appendChild(linkHeading)
  }
}

function parseCSSVariables(cssText) {
  const variables = {}
  const regex = /--([^:]+):\s*([^;]+);/g
  let match

  while ((match = regex.exec(cssText)) !== null) {
    const [, name, value] = match
    variables[`--${name.trim()}`] = value.trim()
  }

  return variables
}

handleFonts()
