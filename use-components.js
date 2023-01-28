const components = {}
const hungryRE = /\{(\w+)\}/g

class UseComponents extends HTMLElement {
  connectedCallback() {
    if (this.parentElement != document.head) {
      return document.head.append(this)
    }

    new MutationObserver(async () => {
      await Promise.all(handleComponentsLoad(this))
      this.hidden = false
    }).observe(this, { childList: true })
  }
}

customElements.define("use-components", UseComponents)

document.addEventListener('DOMContentLoaded', placeComponents)

function handleComponentsLoad(htmlImport) {
  return Array.prototype.map.call(
    htmlImport.children,
    iframe => new Promise((resolve, reject) => {
      iframe.addEventListener('load', async () => {
        components[iframe.innerText] = [...iframe.contentDocument.body.childNodes]

        placeComponents()

        iframe.innerText = ''
        iframe.contentDocument.documentElement.remove()

        resolve()
      }, { once: true })

      iframe.onerror = reject
    })
  )
}

function placeComponents() {
  const names = Object.keys(components)
  const placeholders = names.flatMap(name => [...document.getElementsByTagName(name)])

  for (const ph of placeholders) {
    const clonedNodes = components[ph.localName].map(part => part.cloneNode(true))
    const {elements, nodes} = getHungry(clonedNodes)

    ph.replaceWith(...clonedNodes)

    for (const el of elements) fill(el).attributesWith(ph.dataset)
    for (const node of nodes) fill(node).textWith(ph.dataset)
  }

  if (placeholders.length) placeComponents()
}

function getHungry(clonedNodes) {
  const allNodes = clonedNodes.flatMap(getAllNodes)
  const elements = []
  const nodes = []

  for (const node of allNodes) {
    if (node.nodeType == 1) {
      const attributes = []

      for (const attr of node.attributes) {
        const [...matches] = attr.value?.matchAll(hungryRE) || []
        if (matches.length) attributes.push({matches, attr})
      }

      if (attributes.length) elements.push({attributes, node})
    } 
    else {
      const [...matches] = node.nodeValue?.matchAll(hungryRE) || []
      if (matches.length) nodes.push({matches, node})
    }
  }

  return {elements, nodes}
}

function fill(item) {
  return {
    attributesWith(dataset) {
      const {attributes, node} = item

      for (const {matches, attr} of attributes) {
        for (const [substr, name] of matches) {
          attr.value = attr.value.replaceAll(substr, dataset[name] || '')
        }
        
        if (!attr.value) node.removeAttribute(attr.name)
      }
    },

    textWith(dataset) {
      const {matches, node} = item
      for (const [substr, name] of matches) {
        node.nodeValue = node.nodeValue.replaceAll(substr, dataset[name] || '')
      }
    },
  }
}

function getAllNodes(node) {
  const nodes = [node]

  for (const child of node.childNodes) nodes.push(...getAllNodes(child))

  return nodes
}
