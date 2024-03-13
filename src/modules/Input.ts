import Store from './Store'
import '@/style/Input.less'
import View from './View'
import { parser } from '@/utils/parser'
import { mergeObjNumberValue } from '@/utils/mergeObjNumberValue'
import { suggester } from '@/utils/suggester'
import { isMobile } from '@/utils/isMobile'

export default class Input extends View {
  storeInstance: Store
  suggestionText: string
  maxlength: number
  timer: any
  constructor(storeInstance: Store) {
    super()
    this.storeInstance = storeInstance
    this.suggestionText = ''
    this.maxlength = 15
    this.timer = null
    this.init()
  }

  init() {
    this.el.className = 'input-wrap'
    this.el.innerHTML = /* html */ `
      <div class="input-container" data-prev-command="" data-value=" ">
        <input type="text" class="inner-input" placeholder="" disabled />
        <input type="text" class="outter-input" value="" />
      </div>
    `
    if (isMobile()) {
      this.el.classList.add('is-mobile')
      this.el.querySelector('.outter-input')?.setAttribute('readonly', 'readonly')
    } else {
      this.el.innerHTML += /* html */ `
        <button class="cancel-btn">撤销</button>
        <button class="reset-btn">重置</button>
      `
    }

    this.insert()
    this.render()
  }

  getValue() {
    return (this.querySelector('.outter-input') as HTMLInputElement).value
  }

  updateValue(val: string) {
    val = val.slice(0, this.maxlength)
    const target = this.querySelector('.outter-input') as HTMLInputElement
    target.value = val
    this.querySelector('.input-container')?.setAttribute('data-value', val)
  }

  dispatchEvent(e: Event) {
    this.querySelector('.outter-input')!.dispatchEvent(e)
  }

  initOutterInput() {
    const outterInput = this.querySelector('.outter-input') as HTMLInputElement
    outterInput?.addEventListener('input', this.handleInputEvent)
    outterInput?.addEventListener('keydown', this.handleKeydownEvent)
  }

  initCancelBtn() {
    this.querySelector('.cancel-btn')?.addEventListener('click', this.handleRevocation)
  }

  initResetBtn() {
    this.querySelector('.reset-btn')?.addEventListener('click', this.handleReset)
  }

  handleReset = () => {
    this.storeInstance.reset()
    this.updateValue('')
    this.dispatchEvent(new Event('input'))
  }

  handleRevocation = () => {
    if (this.getValue()) {
      this.updateValue('')
      return
    }
    const latestCommand = this.storeInstance.revocation()
    this.showSuggestion(latestCommand)
  }

  handleInputEvent = (e: Event) => {
    const target = e.target as HTMLInputElement
    this.updateValue(target.value.toUpperCase())
    this.genSuggestion(target.value)
    this.handleInputting()
  }

  handleInputting() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.querySelector('.input-container')?.classList.add('inputting')
    this.timer = setTimeout(() => {
      this.querySelector('.input-container')?.classList.remove('inputting')
    }, 300)
  }

  handleKeydownEvent = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      if (this.suggestionText) {
        this.updateValue(this.suggestionText)
      }
      e.preventDefault()
    } else if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      if (!target.value) {
        return
      }

      this.parseToken(target.value)
      this.updateValue('')
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
