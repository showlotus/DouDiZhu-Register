import './style/index.css'
import Store from '@/modules/Store'
import Card from '@/modules/Card'
import HistoryRecord from '@/modules/HistoryRecord'
import Input from '@/modules/Input'
import Keyboard from '@/modules/Keyboard'
import { isMobile } from '@/utils/isMobile'

const card = new Card()
const record = new HistoryRecord()
const store = new Store(card, record)
const input = new Input(store)

if (isMobile()) {
  new Keyboard(input)
}
