let hrsD = document.querySelector('.crono-display .hrs')
let minsD = document.querySelector('.crono-display .mins')
let secsD = document.querySelector('.crono-display .secs')
let tensD = document.querySelector('.crono-display .tens')
let display = document.querySelector('.crono-display .display')

let hrs = 0
let mins = 0
let secs = 0
let tens = 0

let turnHrs = 0
let turnMins = 0
let turnSecs = 0
let turnTens = 1

let clockInterval
let turnInterval

let turnObj = []
let turnIdx = 1

let startBtn = document.querySelector('.action-btns .start')
let resetBtn = document.querySelector('.action-btns .reset')
let pauseBtn = document.querySelector('.action-btns .pause')
let turnBtn = document.querySelector('.action-btns .volta')

let turnContainer = document.querySelector('.turn-container')

/**INICIA RELOGIO */
startBtn.addEventListener('click', () => {
        btnToggle()
        clockInterval = setInterval(() => displayTimer(), 10)
})

/**PAUSA RELOGIO */
pauseBtn.addEventListener('click', () => {
        btnToggle()
        clearInterval(clockInterval)
        clearInterval(turnInterval)
})

/**CHAMA FUNCAO RESET*/
resetBtn.addEventListener('click', () => {
        resetClock()
})

/**MARCA VOLTA */
turnBtn.addEventListener('click', () => {
        turnContainer.style.opacity = '1'

        turnObj.push({
                idx: appendIf(turnIdx),
                currentTurn: `${appendIf(turnHrs)}:${appendIf(turnMins)}:${appendIf(turnSecs)}:${appendIf(turnTens)}`,
                totalTime: `${appendIf(hrs)}:${appendIf(mins)}:${appendIf(secs)}:${appendIf(tens)}`
        })

        clearInterval(turnInterval)
        turnToZero()

        turnIdx++

        turnContainer.innerHTML = ''
        
        for (let i = turnObj.length; i > 0; i--){
                if (turnObj[i - 1].idx == 1) {
                        turnContainer.innerHTML += `
                        <div class="turn">
                                <div class="turn-idx">${turnObj[i - 1].idx}.</div>
                                <div class="turn-current">${turnObj[i - 1].totalTime}</div>
                                <div class="turn-total">${turnObj[i - 1].totalTime}</div>
                        </div>`
                } else {
                        turnContainer.innerHTML += `
                        <div class="turn">
                                <div class="turn-idx">${turnObj[i - 1].idx}.</div>
                                <div class="turn-current">${turnObj[i - 1].currentTurn}</div>
                                <div class="turn-total">${turnObj[i - 1].totalTime}</div>
                        </div>`
                }
        }

        turnInterval = setInterval(() => turnTimer(), 10)
})

/**TOGGLE BOTOES */
function btnToggle() {
        startBtn.classList.toggle('show')
        resetBtn.classList.toggle('show')
        pauseBtn.classList.toggle('show')
        turnBtn.classList.toggle('show')
}

/**FUNCAO RELOGIO */
function displayTimer() {
        tens++

        if (tens > 99) {
                tens = 0
                secs++
        }

        if (secs > 59) {
                secs = 0
                mins++
        }

        if (mins > 59) {
                mins = 0
                hrs++
        }

        hrsD.innerHTML = appendIf(hrs)
        minsD.innerHTML = appendIf(mins)
        secsD.innerHTML = appendIf(secs)
        tensD.innerHTML = appendIf(tens)
}

/**FUNCAO RELOGIO VOLTA */
function turnTimer() {
        turnTens++

        if (turnTens > 99) {
                turnTens = 1
                turnSecs++
        }

        if (turnSecs > 59) {
                turnSecs = 0
                turnMins++
        }

        if (turnMins > 59) {
                turnMins = 0
                turnHrs++
        }
}

/**FORMATA 2 CASAS */
function appendIf(x) {
        if (x < 10) {
                return `0${x}`
        } else {
                return x
        }
}

/**FORMATA RELOGIO */
function appendDisplay() {
        hrsD.innerHTML = appendIf(hrs)
        minsD.innerHTML = appendIf(mins)
        secsD.innerHTML = appendIf(secs)
        tensD.innerHTML = appendIf(tens)
}

/**RESETA RELOGIO */
function resetClock() {
        clearInterval(clockInterval)
        clearInterval(turnInterval)

        hrs = 0
        mins = 0
        secs = 0
        tens = 0

        appendDisplay()

       turnToZero()

        turnIdx = 1
        turnObj= []
        turnContainer.innerHTML = ''
        turnContainer.style.opacity = '0'
}

/**RESETA VOLTA */
function turnToZero() {
        turnTens = 0
        turnSecs = 0
        turnMins = 0
        turnHrs = 0
}