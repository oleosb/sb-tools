let hrsD = document.querySelector('.timer-display .hrs')
let minsD = document.querySelector('.timer-display .mins')
let secsD = document.querySelector('.timer-display .secs')
let tensD = document.querySelector('.timer-display .tens')

let clockSet = document.querySelector('.clockSettings-container')

let hrsInpt = document.querySelector('.inpt-hrs')
let minsInpt = document.querySelector('.inpt-mins')
let secsInpt = document.querySelector('.inpt-secs')
let inputs = document.querySelectorAll('.inpt-container > input')
let warning = document.querySelector('.warning')

let hrs = 0
let mins = 0
let secs = 0
let tens = 0

let clockInterval
let tensInterval

let startBtn = document.querySelector('.action-btns .start')
let resetBtn = document.querySelector('.action-btns .reset')
let pauseBtn = document.querySelector('.action-btns .pause')
let editBtn = document.querySelector('.action-btns .edit')
let okBtn = document.querySelector('.clockSettings-container .ok')

let prev = document.querySelectorAll('.prev')
let next = document.querySelectorAll('.next')

let mousedown = false

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

/**ABRE MENU CONFIGURACOES*/
editBtn.addEventListener('click', () => openSettings())

function openSettings() {
        clockSet.classList.add('show')
        startBtn.style.opacity = '0'
        editBtn.style.opacity = '0'
}

/**BOTÃO OK SETA DISPLAY */
okBtn.addEventListener('click', () => {
        if (isValid()) {
                localStorage.setItem('horas', JSON.stringify(hrsInpt.value))
                localStorage.setItem('minutos', JSON.stringify(minsInpt.value))
                localStorage.setItem('segundos', JSON.stringify(secsInpt.value))

                closeSettings()
                setDisplay()
        }
})

function setDisplay() {
        hrs = JSON.parse(localStorage.getItem('horas'))
        mins = JSON.parse(localStorage.getItem('minutos'))
        secs = JSON.parse(localStorage.getItem('segundos'))
        tens = 99

        hrsD.innerHTML = twoDigits(hrsInpt.value)
        minsD.innerHTML = twoDigits(minsInpt.value)
        secsD.innerHTML = twoDigits(secsInpt.value)
        tensD.innerHTML = twoDigits(0)
}

/**VERIFICA SE CAMPOS SÃO VÁLIDOS */
function isValid() {
        let invalid = false

        inputs.forEach(input => {
                if (input.value < 0 || input.value > 59) {
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

/**INICIA RELOGIO */
startBtn.addEventListener('click', () => {
        if ((tensD.innerHTML == 0) && (secsD.innerHTML == 0) && (minsD.innerHTML == 0) && (hrsD.innerHTML == 0)) {
                resetClock()
        } else {
                btnToggle()
                clockInterval = setInterval(() => displayTimer(), 1000)
                tensInterval = setInterval(() => decTens(), 10)
        }
})

/**PAUSA RELOGIO */
pauseBtn.addEventListener('click', () => {
        btnToggle()
        clearInterval(clockInterval)
        clearInterval(tensInterval)
})

/**CHAMA FUNCAO RESET*/
resetBtn.addEventListener('click', () => {
        resetClock()
})

function closeSettings() {
        clockSet.classList.remove('show')
        startBtn.style.opacity = '1'
        editBtn.style.opacity = '1'
}

/**FORMATA INPUTS */
function appendCounter(value) {
        if (value > 59) {
                return '00'
        } else if (value < 0) {
                return '59'
        }

        if (value < 10) {
                return `0${value}`
        } else {
                return value
        }      
}

/**TOGGLE BOTOES */
function btnToggle() {
        startBtn.classList.toggle('show')
        editBtn.classList.toggle('show')
        resetBtn.classList.toggle('show')
        pauseBtn.classList.toggle('show')
}

/**FUNCAO RELOGIO */
function displayTimer() {
        tens = 99

        secs--

        if (secs < 0) {
                secs = 59
                mins--
        }

        if (mins < 0) {
                mins = 59
                hrs--
        }

        hrsD.innerHTML = twoDigits(hrs)
        minsD.innerHTML = twoDigits(mins)
        secsD.innerHTML = twoDigits(secs)

        if ((secsD.innerHTML <= 5 && secsD.innerHTML > 0) && (minsD.innerHTML == 0) && (hrsD.innerHTML == 0)) {
                beep.pause()
                beep.currentTime = 0
                beep.play()
        }

        if ((secsD.innerHTML == 0) && (minsD.innerHTML == 0) && (hrsD.innerHTML == 0)){
                beep.pause()
                beep.currentTime = 0
                beep2.play()
                setTimeout(() => resetClock(), 1000)
        }
}

function decTens() {
        tens--
        tensD.innerHTML = twoDigits(tens)
}

/**FORMATA 2 CASAS */
function twoDigits(value) {
        return ('0' + value).slice(-2)
}

/**FUNCAO RESETA RELOGIO */
function resetClock() {
        btnToggle()
        clearInterval(clockInterval)
        clearInterval(tensInterval)
        setDisplay()
}

/**DISPARA MOUSEDOWN E INCREMENTA OU DECREMENTA INPUTS */
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
