export { translate as t, switchLang }

import cfg from '../config.js'
import dict from './dictionary.js'

const { defaultLang } = cfg

let lang = defaultLang

function switchLang(newLang) {
  lang = newLang
}

function translate(uniqueStr) {
  return dict[uniqueStr]?.[lang] || dict[uniqueStr]?.[defaultLang] || uniqueStr
}
