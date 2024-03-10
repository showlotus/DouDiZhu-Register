import View from './View'

export type JokerType = 'JOKER' | 'joker'

export type CardType =
  | JokerType
  | '2'
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'

export type StoreData = Map<CardType, number>

export type RecordData = Record<CardType, number>

export default class Store {
  #subs: View[]
  #data: StoreData
  #records: [RecordData, string][]
  constructor(...subs: View[]) {
    this.#subs = subs
    this.#data = new Map() as StoreData
    this.#records = [] as [RecordData, string][]
    this.init()
    this.notify()
  }

  init() {
    const data = [
      ['JOKER', 1],
      ['joker', 1],
      ['2', 4],
      ['A', 4],
      ['K', 4],
      ['Q', 4],
      ['J', 4],
      ['10', 4],
      ['9', 4],
      ['8', 4],
      ['7', 4],
      ['6', 4],
      ['5', 4],
      ['4', 4],
      ['3', 4],
    ] as [CardType, number][]
    const map = new Map() as StoreData
    data.forEach(([key, val]) => {
      map.set(key, val)
    })
    this.#data = map
  }

  update(data: RecordData, command: string) {
    const keys = Object.keys(data) as CardType[]
    keys.forEach(key => {
      data[key] = Math.min(data[key], this.#data.get(key)!)
      this.#data.set(key, this.#data.get(key)! - data[key])
    })
    this.#records.push([data, command])
    this.notify()
  }

  notify() {
    this.#subs.forEach(sub =>
      sub.render({
        data: this.#data,
        history: this.#records,
      }),
    )
  }

  revocation() {
    const [latestModifyData, latestCommand] = (this.#records.pop() || []) as [RecordData, string]
    if (!latestModifyData || !Object.keys(latestModifyData).length) {
      return ''
    }

    const keys = Object.keys(latestModifyData) as CardType[]
    keys.forEach(key => {
      this.#data.set(key, this.#data.get(key)! + latestModifyData[key]!)
    })
    this.notify()
    return latestCommand
  }

  getData() {
    return this.#data as Readonly<StoreData>
  }

  getRecords() {
    return this.#records as Readonly<[RecordData, string][]>
  }

  getLastestRecord() {
    return this.#records.length ? this.#records[this.#records.length - 1] : null
  }

  reset() {
    this.init()
    this.#records = []
    this.notify()
  }
}
