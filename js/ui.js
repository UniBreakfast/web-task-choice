export { prepUI }

import { makeTabs } from './tabs.js'
import { t, switchLang } from './lang.js'

function prepUI(lang) {
    switchLang(lang)
    
    const tabManager = makeTabs(t('Categories'), t('Random_choice'))

    document.body.append(tabManager)
}
