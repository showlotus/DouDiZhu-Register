export default class View {
  el: HTMLElement
  constructor() {
    this.el = document.createElement('div')
  }

  insert() {
    document.querySelector<HTMLDivElement>('#app')!.appendChild(this.el)
  }

  // @ts-expect-error
  render(props?: any) {}
}
