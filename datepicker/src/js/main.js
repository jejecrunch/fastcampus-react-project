class DatePicker {
  monthData = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // 오늘
  #today = new Date();

  // 달력 날짜
  #calendarDate = {
    data: this.#today,
    year: this.#today.getFullYear(),
    month: this.#today.getMonth(),
    date: this.#today.getDate(),
  };

  // 선택한 날짜
  #selectedDate = {
    ...this.#calendarDate,
  };

  constructor() {
    // 캘린더 날짜 초기화
    this.initCalendarDate();
    // 요소 가져오고 이벤트 등록
    this.assignElement();
    this.addEvent();

    // 초기화한 날짜로 세팅
    this.setDateInput();
  }

  // 캘린더 날짜 초기화
  initCalendarDate() {
    const date = this.#today.getDate();
    const month = this.#today.getMonth();
    const year = this.#today.getFullYear();

    this.#calendarDate = {
      data: this.#today,
      date,
      month,
      year,
    };
  }

  // date input 내용 변경
  setDateInput() {
    this.dateInputEl.textContent = this.formatDate(this.#selectedDate.data);
    this.dateInputEl.dataset.value - this.#selectedDate.data;
  }
  // 날짜 데이터 포매팅
  formatDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) date = `0${date}`;

    let month = dateData.getMonth() + 1;
    if (month < 10) month = `0${month}`;

    let year = dateData.getFullYear();

    return `${year}/${month}/${date}`;
  }

  // 요소 연결
  assignElement() {
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input");
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.calendarEl.querySelector("#month");
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    this.calendarDatesEl = this.calendarEl.querySelector("#dates");
  }

  // 이벤트 등록
  addEvent() {
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener("click", this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener("click", this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      "click",
      this.onClickSelectDate.bind(this)
    );
  }

  // 날짜 선택할 때의 이벤트 함수
  onClickSelectDate(event) {
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      this.#selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: eventTarget.dataset.date,
      };

      this.calendarDatesEl
        .querySelector(".selected")
        ?.classList.remove("selected");

      eventTarget.classList.add("selected");
      if (this.calendarEl.classList.contains("active"))
        this.calendarEl.classList.remove("active");
      this.setDateInput();
    }
  }

  // 이전달로 넘어가는 함수
  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.year--;
      this.#calendarDate.month = 11;
    }
    this.updateMonth();
    this.updateDates();
  }

  // 다음달로 넘어가는 함수
  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.year++;
      this.#calendarDate.month = 0;
    }
    this.updateMonth();
    this.updateDates();
  }

  // 달력 열기 함수
  toggleCalendar() {
    if (this.calendarEl.classList.contains("active")) {
      this.#calendarDate = { ...this.#selectedDate };
    }
    this.calendarEl.classList.toggle("active");
    this.updateMonth();
    this.updateDates();
  }

  // 달력 조작 시 월이 바뀌는 함수
  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  // 달력 조작 시 날짜 바뀌는 함수
  updateDates() {
    this.calendarDatesEl.innerHTML = "";
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0
    ).getDate();
    const fragment = new DocumentFragment();
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");
      dateEl.textContent = i + 1;
      dateEl.dataset.date = i + 1;
      fragment.appendChild(dateEl);
    }
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragment);
    this.colorSaturday();
    this.colorSunday();
    this.markToday();
    this.markSelectedDate();
  }

  // 선택한 날짜 칠하기
  markSelectedDate() {
    if (
      this.#selectedDate.year === this.#calendarDate.year &&
      this.#selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.#selectedDate.date}']`)
        .classList.add("selected");
    }
  }

  // 오늘 칠하기
  markToday() {
    if (
      this.#today.getFullYear() === this.#calendarDate.year &&
      this.#today.getMonth() === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.#today.getDate()}']`)
        .classList.add("today");
    }
  }

  // 토요일 글자색 변경
  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = `blue`;
    }
  }

  // 일요일 글자색 변경
  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1
          ).getDay()) %
        7
      })`
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = `red`;
    }
  }
}

new DatePicker();
