export { prepUI }

import { makeTabs } from './tabs.js'
import { t } from './lang.js'

function prepUI(lang) {
    const tabManager = makeTabs(t('Categories'), t('Random choice'))
}
