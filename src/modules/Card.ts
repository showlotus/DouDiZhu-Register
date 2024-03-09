import { CardType, StoreData, JokerType } from './Store'
import View from './View'
import JokerM from '../img/joker-m.svg'
import JokerS from '../img/joker-s.svg'
import '../style/card.css'

export default class Card extends View {
  constructor() {
    super()
    this.init()
  }

  init() {
    this.el.className = 'card-wrap'
    this.insert()
  }

  renderCard(key: CardType, nums: number) {
    if (key.toLocaleLowerCase() === 'joker') {
      return this.renderJoker(key as JokerType, nums)
    } else {
      return this.renderNums(key, nums)
    }
  }

  renderJoker(key: JokerType, nums: number) {
    const imgSrc = key === 'JOKER' ? JokerM : JokerS
    return `
      <div class="card-item joker">
        <div class="card-text"><img src=${imgSrc} alt="${key}" /></div>
        <span class="card-num">${nums}</span>
      </div>
    `
  }

  renderNums(key: CardType, nums: number) {
    if (key === '10') {
      return `
        <div class="card-item double-char">
          <div class="card-text"><span>${key}</span></div>
          <span class="card-num">${nums}</span>
        </div>
      `
    } else {
      return `
        <div class="card-item">
          <div class="card-text">${key}</div>
          <span class="card-num">${nums}</span>
        </div>
      `
    }
  }

  renderElement(data: StoreData) {
    return [...data.entries()].map(([key, nums]) => this.renderCard(key, nums)).join('\n')
  }

  render(props: any) {
    const data = props.data as StoreData
    this.el.innerHTML = this.renderElement(data)
  }
}
