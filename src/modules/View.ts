export default class View {
  el: HTMLElement
  constructor() {
    this.el = document.createElement('div')
  }

  insert() {
    document.querySelector<HTMLDivElement>('#app')!.appendChild(this.el)
  }

  render(props?: any) {}
}
