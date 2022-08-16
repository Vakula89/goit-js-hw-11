import { Notify } from 'notiflix/build/notiflix-notify-aio'
import "notiflix/dist/notiflix-3.2.5.min.css"
import flatpickr from 'flatpickr'
//import { Ukrainian } from "flatpickr/dist/l10n/uk"
import "flatpickr/dist/flatpickr.min.css"
import { padStart } from 'lodash'


const startBtn = document.querySelector("[data-start]")
const valueElems = document.querySelectorAll(".field > .value")

const options = {
    //locale: Ukrainian,
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDateTime = selectedDates[0]
      if(!validateSelectedDate(selectedDateTime)){
        return
      }
      startBtn.removeAttribute("disabled")
    }
  }

const fp = flatpickr("#datetime-picker", options)

startBtn.setAttribute("disabled", "disabled")
startBtn.addEventListener("click", (ev) => {
    startBtn.setAttribute("disabled", "disabled")
    fp.input.setAttribute("disabled", "disabled")
    startTimer()
})

function getDiffMs(selectedDateTime){
    const currentDateTime = new Date()
    let diffMs = selectedDateTime.getTime() - currentDateTime.getTime()
    return diffMs;
}

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
  
    // Remaining days
    const days = Math.floor(ms / day)
    // Remaining hours
    const hours = Math.floor((ms % day) / hour)
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute)
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second)
  
    return { days, hours, minutes, seconds }
}

function addLeadingZero(value){
    return padStart(value, 2, '0')
}

function validateSelectedDate(selectedDateTime){
    let diffMs = getDiffMs(selectedDateTime)
    //less than 1 second
    if(diffMs < 1000 && !startBtn.getAttribute("ms")){
        Notify.failure('Please choose a date in the future')
        return false
    }
    startBtn.removeAttribute("disabled")
    return true
}

function startTimer(){
    let diffMs = getDiffMs(fp.selectedDates[0])

    if (!valueElems || !valueElems.length || valueElems.length < 4){
        return
    }
    if(diffMs <= 0){
        valueElems.forEach(el => el.textContent = '00')
        fp.input.removeAttribute("disabled")
        return
    }
    let { days, hours, minutes, seconds } = convertMs(diffMs)
    valueElems[0].textContent = addLeadingZero(days)
    valueElems[1].textContent = addLeadingZero(hours)
    valueElems[2].textContent = addLeadingZero(minutes)
    valueElems[3].textContent = addLeadingZero(seconds)

    return setTimeout(() => startTimer(),1000)
}