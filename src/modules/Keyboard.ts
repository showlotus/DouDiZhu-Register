import Input from './Input'
import View from './View'
import '@/style/Keyboard.less'

export default class Keyboard extends View {
  inputInstance: Input
  constructor(inputInstance: Input) {
    super()
    this.el.className = 'keyboard-wrap'
    this.inputInstance = inputInstance
    this.init()
  }

  init() {
    this.el.innerHTML = /* html */ `
      <!-- line 1 -->
      <div class="row row-1">
        <div class="btn btn-default btn-special" data-value="D">D</div>
        <div class="btn btn-default" data-value="A">A</div>
        <div class="btn btn-default" data-value="2">2</div>
        <div class="btn btn-default" data-value="3">3</div>
        <div class="btn btn-default btn-special btn-word" type="reset">重置</div>
      </div>

      <!-- line 2 -->
      <div class="row row-1">
        <div class="btn btn-default btn-special" data-value="T" >T</div>
        <div class="btn btn-default" data-value="4">4</div>
        <div class="btn btn-default" data-value="5">5</div>
        <div class="btn btn-default" data-value="6">6</div>
        <div class="btn btn-default btn-special btn-word" type="revocation">撤销</div>
      </div>

      <!-- line 3 -->
      <div class="row row-1">
        <div class="btn btn-default btn-special" data-value="F">F</div>
        <div class="btn btn-default" data-value="7">7</div>
        <div class="btn btn-default" data-value="8">8</div>
        <div class="btn btn-default" data-value="9">9</div>
        <div class="btn btn-default btn-special" type="backspace">
          <svg
            style="width: 60%; height: 60%"
            t="1710227809603"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1456"
            width="128"
            height="128"
          >
            <path
              d="M856.2 890.5H402.4c-55.3-0.1-108-23.4-145.4-64.2L23 571c-30.7-33.4-30.7-84.8 0-118.2l233.9-255.1c37.3-40.8 90.1-64.1 145.4-64.2h453.8c92.7 0.2 167.8 75.4 167.8 168.1v420.7c0.1 92.8-75 168-167.7 168.2zM402.6 184.9c-41 0-80 17.2-107.8 47.4L60.9 487.6c-12.8 13.7-12.8 34.9 0 48.6l233.7 255.3c27.7 30.2 66.8 47.4 107.8 47.4h454c64.4-0.1 116.5-52.4 116.5-116.8V301.6c0-64.4-52.2-116.6-116.5-116.8H402.6z m323.7 471c-6.8 0-13.4-2.7-18.2-7.5l-100-100.2L508 648.4c-9.9 10.1-26.1 10.2-36.2 0.3-10.1-9.9-10.2-26.1-0.3-36.2l0.4-0.4 100-100.2-100-100.2c-10.1-9.9-10.3-26.1-0.4-36.2 9.9-10.1 26.1-10.3 36.2-0.4l0.4 0.4 100 100.2 100-100.2c10-10 26.2-10 36.2 0 10 10 10 26.2 0 36.2l-100 100.2 100.2 100.2c10 10 10 26.3-0.1 36.3-4.8 4.8-11.3 7.5-18.1 7.5z"
              p-id="1457"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <!-- line 4 -->
      <div class="row row-2">
        <div class="btn btn-large btn-special btn-word" type="complete">补全</div>
        <div class="center">
          <!-- line 4-1  -->
          <div class="row">
            <div class="btn btn-mini" data-value="10">10</div>
            <div class="btn btn-mini" data-value="J">J</div>
            <div class="btn btn-mini" data-value="Q">Q</div>
            <div class="btn btn-mini" data-value="K">K</div>
          </div>

          <!-- line 4-2  -->
          <div class="row">
            <div class="btn btn-mini" data-value=">">&gt;</div>
            <div class="btn btn-mini" data-value="<">&lt;</div>
            <div class="btn btn-mini" data-value="-">-</div>
            <div class="btn btn-mini" data-value=",">,</div>
          </div>
        </div>

        <div class="btn btn-large btn-special btn-word" type="send">发送</div>
      </div>
    `
    this.insert()
    this.initEvent()
    this.preventDoubleClickScale()
  }

  initEvent() {
    this.el.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('touchstart', () => {
        btn.classList.toggle('active')
      })
      btn.addEventListener('touchend', () => {
        btn.classList.toggle('active')
        if (btn.hasAttribute('data-value')) {
          this.inputInstance.updateValue(
            this.inputInstance.getValue() + btn.getAttribute('data-value'),
          )
          this.inputInstance.dispatchEvent(new Event('input'))
        } else {
          const type = btn.getAttribute('type') as string
          const ops = {
            reset() {
              this.inputInstance.handleReset()
            },
            revocation() {
              this.inputInstance.handleRevocation()
            },
            backspace() {
              this.inputInstance.updateValue(this.inputInstance.getValue().slice(0, -1))
              this.dispatchInputEvent()
            },
            complete() {
              this.dispatchKeydownEvent('ArrowUp')
            },
            send() {
              this.dispatchKeydownEvent('Enter')
            },
          } as any
          ops[type] && ops[type].call(this)
        }
      })
    })
  }

  dispatchKeydownEvent(key: string) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key,
    })
    this.inputInstance.dispatchEvent(event)
  }

  dispatchInputEvent() {
    const event = new Event('input')
    this.inputInstance.dispatchEvent(event)
  }

  preventDoubleClickScale() {
    let lastTouchEndTime = Date.now()
    document.documentElement.addEventListener(
      'touchend',
      e => {
        const now = Date.now()
        if (now - lastTouchEndTime <= 500) {
          e.preventDefault()
        }
        lastTouchEndTime = now
      },
      false,
    )
  }
}
