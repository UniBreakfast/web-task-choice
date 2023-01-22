export { loadStored }

import cfg from '../config.js'

function loadStored() {
  const userTaskCats = JSON.parse(localStorage[cfg.localStoragePrefix + 'userTaskCats'] || '[]')

  let lang = localStorage[cfg.localStoragePrefix + 'lang']

  if (!lang || !langDict[lang]) lang = cfg.defaultLang
  
  return {lang, userData: {categories: userTaskCats}}
}
