const components = {}

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
        components[iframe.innerText] = [...iframe.contentDocument.body.children]

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
    ph.replaceWith(...components[ph.localName].map(part => part.cloneNode(true)))
  }

  if (placeholders.length) placeComponents()
}
