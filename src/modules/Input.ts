import Store from './Store'
import '../style/input.css'
import View from './View'
import { parser } from '../utils/parser'
import { mergeObjNumberValue } from '../utils/mergeObjNumberValue'
import { suggester } from '../utils/suggester'

export default class Input extends View {
  storeInstance: Store
  suggestionText: string
  constructor(storeInstance: Store) {
    super()
    this.storeInstance = storeInstance
    this.suggestionText = ''
    this.init()
  }

  init() {
    this.el.className = 'input-wrap'
    this.el.innerHTML = `
      <div class="input-container" data-prev-command="">
        <input type="text" class="inner-input" placeholder="" disabled />
        <input type="text" class="outter-input" value="" />
      </div>
      <button class="cancel-btn">撤销</button>
      <button class="reset-btn">重置</button>
    `
    this.insert()
    this.render()
  }

  initOutterInput() {
    const outterInput = this.querySelector('.outter-input') as HTMLInputElement
    outterInput?.addEventListener('input', this.handleInputEvent)
    outterInput?.addEventListener('keydown', this.handleKeydownEvent)
  }

  initCancelBtn() {
    this.querySelector('.cancel-btn')?.addEventListener('click', () => {
      const outterInput = this.querySelector('.outter-input') as HTMLInputElement
      if (outterInput.value) {
        outterInput.value = ''
        return
      }
      const latestCommand = this.storeInstance.revocation()
      this.showSuggestion(latestCommand)
    })
  }

  initResetBtn() {
    this.querySelector('.reset-btn')?.addEventListener('click', () => {
      this.storeInstance.reset()
    })
  }

  handleInputEvent = (e: Event) => {
    const target = e.target as HTMLInputElement
    target.value = target.value.toUpperCase()
    this.genSuggestion(target.value)
  }

  handleKeydownEvent = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      const target = e.target as HTMLInputElement
      if (this.suggestionText) {
        target.value = this.suggestionText
      }
      e.preventDefault()
    } else if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      if (!target.value) {
        return
      }

      this.parseToken(target.value)
      target.value = ''
    } else if (e.key === ' ') {
      e.preventDefault()
    }
  }

  parseToken(token: string) {
    token = this.formatToken(token)
    const tokens = token.split(',')

    let data = {} as any
    tokens.forEach(str => {
      for (const { validate, generate } of Object.values(parser)) {
        if (validate(str)) {
          data = mergeObjNumberValue(data, generate(str))
        }
      }
    })

    this.storeInstance.update(data, token)
    this.updatePrevCommand()
    this.showSuggestion('')
  }

  formatToken(token: string) {
    return token.replace(/[^0123456789JQKA,\-DTF><]/g, '')
  }

  genSuggestion(token: string) {
    if (token !== this.formatToken(token)) {
      this.showSuggestion('')
      return
    }

    const suggestion = suggester(token, this.storeInstance)
    this.showSuggestion(suggestion)
  }

  showSuggestion(text: string) {
    this.suggestionText = text
    this.querySelector('.inner-input')!.setAttribute('placeholder', text)
  }

  updatePrevCommand() {
    const latestRecord = this.storeInstance.getLastestRecord()
    this.querySelector('.input-container')?.setAttribute(
      'data-prev-command',
      `上一次输入：${latestRecord?.[1] || ''}`,
    )
  }

  querySelector(selector: string) {
    return this.el.querySelector(selector)
  }

  render() {
    this.initOutterInput()
    this.initCancelBtn()
    this.initResetBtn()
  }
}
