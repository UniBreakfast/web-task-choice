import { loadStored } from './js/storage.js'
import { prepUI } from './js/ui.js'
import { loadData } from './js/data-loader.js'
import { include } from './js/data-integrator.js'
import { render } from './js/render.js'

const {lang, userData} = loadStored()

prepUI(lang)

loadData().then(include(userData)).then(render)
