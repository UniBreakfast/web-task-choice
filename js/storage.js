export { loadStored }

const {localStoragePrefix} = cfg; import cfg from '../config.js'

function loadStored() {
  return {lang: 'en', userData: ''}
}
