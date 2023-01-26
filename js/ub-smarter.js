const { defineProperty, getOwnPropertyDescriptor } = Object
let proto

proto = Element.prototype

defineProperty(proto, '_append', getOwnPropertyDescriptor(proto, 'append'))
proto.append = smartAppend

function smartAppend(...nodes) {
  this._append(...nodes.map(
    node => node instanceof Node || typeof node == 'string' || !node?.el ? node : node.el
  ))
}
