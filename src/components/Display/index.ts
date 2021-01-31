export default class Display {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public renderText = (textToRender: string): void => {
    if (this.element.innerHTML !== textToRender) {
      this.element.innerHTML = textToRender;
    }
  };

  public clearText = (): void => {
    if (this.element.innerHTML) {
      this.element.innerHTML = "";
    }
  };
}
