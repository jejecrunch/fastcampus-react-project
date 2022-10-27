export class Keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #inputGroupEl;
  #inputEl;
  #keyboardEl;

  #keyPress = false;
  #mouseDown = false;
  #shift = false;

  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  #assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener(
      "change",
      this.#onChangeFont.bind(this)
    );
    this.#inputEl.addEventListener("input", this.#onInput);
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
  }

  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
    this.#inputEl.style.fontFamily = event.target.value;
  }

  #onInput(event) {
    event.target.value = event.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }

  #onKeyDown(event) {
    if (this.#mouseDown) return;
    this.#keyPress = true;

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.#shift = true;
    }

    this.#inputGroupEl.classList.toggle(
      "error",
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(event.code)
    );

    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.add("active");
  }

  #onKeyUp(event) {
    if (this.#mouseDown) return;
    this.#keyPress = false;

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.#shift = false;
    }

    const keyEl = event.target.querySelector(`[data-code=${event.code}]`);
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;

    this.#onTyping(isActive, val);
  }

  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#mouseDown = true;

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.#shift = true;
    }
    event.target.closest("div.key")?.classList.add("active");
  }

  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#mouseDown = false;
    const keyEl = event.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.#shift = false;
    }

    this.#onTyping(isActive, val);
  }

  #onTyping(isActive, val) {
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      if (this.#shift) this.#inputEl.value += val.toUpperCase();
      else this.#inputEl.value += val;
    }
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }
}
