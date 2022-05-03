let title = document.querySelector('.doctitle')

let clockSet = document.querySelector('.clockSettings-container')

let startBtn = document.querySelector('.action-btns .start')
let resetBtn = document.querySelector('.action-btns .reset')
let pauseBtn = document.querySelector('.action-btns .pause')
let editBtn = document.querySelector('.action-btns .edit')
let okBtn = document.querySelector('.clockSettings-container .ok')

let prev = document.querySelectorAll('.prev')
let next = document.querySelectorAll('.next')

let pomo_inpt = document.querySelector('.pomo-inpt')
let smallP_inpt = document.querySelector('.smallP-inpt')
let longP_inpt = document.querySelector('.longP-inpt')
let untilP_inpt = document.querySelector('.untilP-inpt')
let session_inpt = document.querySelector('.session-inpt')
let inputs = document.querySelectorAll('.inpt-container > input')
let warning = document.querySelector('.warning')

let currentDisplay = document.querySelector('.current-display')
let currentMin = document.querySelector('.current-mins')
let currentSecs = document.querySelector('.current-secs')
let nextDisplay = document.querySelector('.next-display')
let sessionDisplay = document.querySelector('.session-display')
let sessionCurrent = document.querySelector('.session-current')
let sessionTotal = document.querySelector('.session-total')

let currentSession = 0
sessionCurrent.innerHTML = currentSession
sessionTotal.innerHTML = session_inpt.value
let uLongPause = 0

let min_pomo = 0
let seg_pomo = 0
let min_small = 0
let seg_small = 0
let min_long = 0
let seg_long = 0
let seg_total = 0
let min_total = 0

let totalPomo = 0
let totalSmall = 0
let totalNLong = 0
let totalLong = 0
let totalTime

let pomoRunning = false
let smallRunning = false
let longRunning = false

let pomoInterval
let smallInterval
let longInterval
let totalInterval

let beep = document.querySelector('.beep')
let beep2 = document.querySelector('.beep2')

onLoad()
function onLoad() {
        inputs.forEach(input => {
                if (localStorage.getItem(`${input.getAttribute('name')}`) == null) {
                        input.value = '00'
                } else {
                        input.value = JSON.parse(localStorage.getItem(`${input.getAttribute('name')}`))
                }
        })

        setDisplay()
}

editBtn.addEventListener('click', () => openSettings())

function openSettings() {
        clockSet.classList.add('show')
        startBtn.style.opacity = '0'
        editBtn.style.opacity = '0'
}

okBtn.addEventListener('click', () => {
        if (isValid()) {
                localStorage.setItem('pomodoro', JSON.stringify(pomo_inpt.value))
                localStorage.setItem('small_pause', JSON.stringify(smallP_inpt.value))
                localStorage.setItem('long_pause', JSON.stringify(longP_inpt.value))
                localStorage.setItem('untilL_pause', JSON.stringify(untilP_inpt.value))
                localStorage.setItem('sessions', JSON.stringify(session_inpt.value))

                closeSettings()
                setDisplay()
        }
})

function closeSettings() {
        clockSet.classList.remove('show')
        startBtn.style.opacity = '1'
        editBtn.style.opacity = '1'
}

function isValid() {
        let invalid = false

        inputs.forEach(input => {
                if (input.value < 1 || input.value > 59) {
                        invalid = true
                }
        })

        if (invalid) {
                warning.style.opacity = '1'
                warning.innerHTML = `*revise todos os campos`
                return false
        } else {
                warning.innerHTML = '&nbsp;'
                return true
        }
}

function setDisplay() {
        uLongPause = JSON.parse(localStorage.getItem('untilL_pause'))

        min_pomo = JSON.parse(localStorage.getItem('pomodoro')) - 1
        seg_pomo = 59
        min_small = JSON.parse(localStorage.getItem('small_pause')) - 1
        seg_small = 59
        min_long = JSON.parse(localStorage.getItem('long_pause')) - 1
        seg_long = 59

        currentMin.innerHTML = twoDigits(pomo_inpt.value)
        currentSecs.innerHTML = '00'
        sessionCurrent.innerHTML = twoDigits(currentSession)
        sessionTotal.innerHTML = twoDigits(session_inpt.value)
        nextD()
}

/**INICIA RELOGIO */
startBtn.addEventListener('click', () => {
        if (!isValid()) {
                resetClock()
        } else {
                btnToggle()

                if (!pomoRunning && !smallRunning && !longRunning) {
                        currentSession = twoDigits(1)
                        pomoRunning = true
                        pomoClock()
                        pomoInterval = setInterval(() => pomoClock(), 500)
                } else if (pomoRunning && !smallRunning && !longRunning) {
                        pomoRunning = true
                        pomoClock()
                        pomoInterval = setInterval(() => pomoClock(), 500)
                } else if (!pomoRunning && smallRunning && !longRunning) {
                        smallRunning = true
                        smallClock()
                        smallInterval = setInterval(() => smallClock(), 500)
                } else if (!pomoRunning && !smallRunning && longRunning) {
                        longRunning = true
                        longClock()
                        longInterval = setInterval(() => longClock(), 500)
                }
        }
})

/**TOGGLE BOTOES */
function btnToggle() {
        startBtn.classList.toggle('show')
        editBtn.classList.toggle('show')
        resetBtn.classList.toggle('show')
        pauseBtn.classList.toggle('show')
}

/**RESETA RELOGIO */
function resetClock() {
        clearInterval(pomoInterval)
        clearInterval(smallInterval)
        clearInterval(longInterval)
        pomoRunning = false
        smallRunning = false
        longRunning = false

        currentSession = twoDigits(0)

        title.innerHTML = `sbtools - pomodoro`
}

/**INTERVALO POMODORO */
function pomoClock() {
        title.innerHTML = `${twoDigits(min_pomo)}:${twoDigits(seg_pomo)} - pomodoro`
        currentMin.innerHTML = twoDigits(min_pomo)
        currentSecs.innerHTML = twoDigits(seg_pomo)
        sessionCurrent.innerHTML = twoDigits(currentSession)
        sessionTotal.innerHTML = twoDigits(JSON.parse(localStorage.getItem('sessions')))
        nextD()

        if (currentSession == JSON.parse(localStorage.getItem('sessions'))) {
                if (min_pomo == 0 && (seg_pomo <= 5 && seg_pomo > 0)) {
                        beep.pause()
                        beep.currentTime = 0
                        beep.play()
                }
        }

        if (seg_pomo != 0) {
                seg_pomo--
         } else if (min_pomo != 0 && seg_pomo == 0) {
                 seg_pomo = 59
                 min_pomo--
        } else if (min_pomo <= 0 && seg_pomo <= 0) {
                currentSession++
                uLongPause--
                
                if (currentSession == (Number(JSON.parse(localStorage.getItem('sessions'))) + 1)) {
                        beep.pause()
                        beep.currentTime = 0
                        beep2.play()

                        btnToggle()
                        resetClock()
                        setDisplay()
                } else {
                        clearInterval(pomoInterval)

                        pomoRunning = false

                        if (uLongPause == 0) {
                                uLongPause = JSON.parse(localStorage.getItem('untilL_pause'))
                                
                                longRunning = true
                                min_long = JSON.parse(localStorage.getItem('long_pause')) - 1
        seg_long = 59
                                longInterval = setInterval(() => longClock(), 500)
                        } else {
                                smallRunning = true
                                min_small = JSON.parse(localStorage.getItem('small_pause')) - 1
                                seg_small = 59
                                smallInterval = setInterval(() => smallClock(), 500)
                        }
                }
                
                
        }
}

/**INTERVALO PAUSA PEQUENA */
function smallClock() {
        title.innerHTML = `${twoDigits(min_small)}:${twoDigits(seg_small)} - pausa pequena`
        currentMin.innerHTML = twoDigits(min_small)
        currentSecs.innerHTML = twoDigits(seg_small)
        nextDisplay.innerHTML = `
                <div class="next-mins">${JSON.parse(localStorage.getItem('pomodoro'))}</div>
                <span>:</span>
                <div>00</div>
        `

        if (seg_small != 0) {
               seg_small--
        } else if (min_small != 0 && seg_small == 0) {
                seg_small = 59
                min_small--
        } else if (min_small <= 0 && seg_small <= 0) {                
                clearInterval(smallInterval)

                smallRunning = false
                pomoRunning = true
                min_pomo = JSON.parse(localStorage.getItem('pomodoro')) - 1
                seg_pomo = 59
                pomoInterval = setInterval(() => pomoClock(), 500);
        }
}

/**INTERVALO PAUSA LONGA */
function longClock() {
        title.innerHTML = `${twoDigits(min_long)}:${twoDigits(seg_long)} - pausa longa`
        currentMin.innerHTML = twoDigits(min_long)
        currentSecs.innerHTML = twoDigits(seg_long)
        nextDisplay.innerHTML = `
                <div class="next-mins">${JSON.parse(localStorage.getItem('pomodoro'))}</div>
                <span>:</span>
                <div>00</div>
        `

        if (seg_long != 0) {
               seg_long--
        } else if (min_long != 0 && seg_long == 0) {
                seg_long = 59
                min_long--
        } else if (min_long <= 0 && seg_long <= 0) {                
                clearInterval(longInterval)

                longRunning = false
                pomoRunning = true
                min_pomo = JSON.parse(localStorage.getItem('pomodoro')) - 1
                seg_pomo = 59
                pomoInterval = setInterval(() => pomoClock(), 500);
        }
}

/**PAUSA RELOGIO */
pauseBtn.addEventListener('click', () => {
        btnToggle()

        title.innerHTML = `${currentMin.innerHTML}:${currentSecs.innerHTML} - relógio pausado`

        if (pomoRunning) {
                pomoRunning = true
                clearInterval(pomoInterval)
        } else if (smallRunning) {
                smallRunning = true
                clearInterval(smallInterval)
        } else if (longRunning) {
                longRunning = true
                clearInterval(longInterval)
        }
})

/**RESETA RELOGIO */
resetBtn.addEventListener('click', () => {
        btnToggle()
        resetClock()
        setDisplay()
})

/**INCREMENTA OU DECREMENTA INPUTS */
document.body.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('prev')) {
                e.target.nextElementSibling.value--
                e.target.nextElementSibling.value = appendCounter(e.target.nextElementSibling.value)
        }
        
        if (e.target.classList.contains('next')) {
                e.target.previousElementSibling.value++
                e.target.previousElementSibling.value = appendCounter(e.target.previousElementSibling.value)
        }
})

/**ATUALIZA VALOR DE INPUTS */
inputs.forEach(input => {
        input.addEventListener('focus', () => input.value = '')

        input.addEventListener('blur', () => {
                if (input.value == '') {
                        input.value = '00'
                }
        })
})

/**FORMATA INPUTS */
function appendCounter(value) {
        if (value > 59) {
                return '00'
        } else if (value < 0) {
                return '59'
        }

        return twoDigits(value)
}

/**FORMATA 2 CASAS */
function twoDigits(value) {
        return ('0' + value).slice(-2)
}

function nextD() {
        if (sessionCurrent.innerHTML == sessionTotal.innerHTML) {
                nextDisplay.innerHTML = 'fim!'
        } else if (uLongPause == 1) {
                nextDisplay.innerHTML = `
                        <div class="next-mins">${JSON.parse(localStorage.getItem('long_pause'))}</div>
                        <span>:</span>
                        <div>00</div>
                `
        } else if(uLongPause != 1 && sessionCurrent.innerHTML !== sessionTotal.innerHTML) {
                nextDisplay.innerHTML = `
                        <div class="next-mins">${JSON.parse(localStorage.getItem('small_pause'))}</div>
                        <span>:</span>
                        <div>00</div>
                `
        }
}