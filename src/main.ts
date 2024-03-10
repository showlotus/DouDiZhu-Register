import './style.css'
import Store from '@/modules/Store'
import Card from '@/modules/Card'
import HistoryRecord from '@/modules/HistoryRecord'
import Input from '@/modules/Input'

const card = new Card()
const record = new HistoryRecord()
const store = new Store(card, record)
new Input(store)
