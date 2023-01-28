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
    const nodes = components[ph.localName].map(part => part.cloneNode(true))

    ph.replaceWith(...nodes)

    for (const node of getHungryNodesOf(nodes)) fill(node).with(ph.dataset)
  }

  if (placeholders.length) placeComponents()
}

function getHungryNodesOf(nodes) {
  const hungryNodes = []
  
  nodes = nodes.flatMap(getAllNodes)

  for (const node of nodes) {
    const [...matches] = node.nodeValue?.matchAll(hungryRE) || []
    if (matches.length) hungryNodes.push({matches, node})
  }

  return hungryNodes
}

function fill({matches, node}) {
  return {
    with(dataset) {
      for (const [substr, name] of matches) {
        node.nodeValue = node.nodeValue.replaceAll(substr, dataset[name] || '')
      }
    }
  }
}

function getAllNodes(node) {
  const nodes = [node]

  for (const child of node.childNodes) nodes.push(...getAllNodes(child))

  return nodes
}
