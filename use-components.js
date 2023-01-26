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

function handleComponentsLoad(htmlImport) {
  console.log(htmlImport.children.length);
  return Array.prototype.map.call(
    htmlImport.children,
    iframe => new Promise((resolve, reject) => {
      iframe.addEventListener('load', async () => {
        const placeholders = document.getElementsByTagName(iframe.id)
        const componentParts = [...iframe.contentDocument.body.children]
        
        placeholders[0].replaceWith(...componentParts)

        while (placeholders.length) {
          placeholders[0].replaceWith(...componentParts.map(part => part.cloneNode(true)))
        }

        iframe.removeAttribute('id')
        iframe.contentDocument.documentElement.remove()

        resolve()
      }, { once: true })

      iframe.onerror = reject
    })
  )
}
