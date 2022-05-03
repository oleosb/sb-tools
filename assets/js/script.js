let root = document.querySelector(':root')
let theme = document.querySelector('.theme-container img')
let menuToggle = document.querySelector('.menu-toggle')
let navbar = document.querySelector('.navbar')
let sbLogo = document.querySelector('.logo')
let socialM = document.querySelectorAll('.social-media img')

menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('close')
        menuToggle.classList.toggle('open')
        navbar.classList.toggle('show')
})

theme.addEventListener('click', () => {
        theme.classList.toggle('light')
        theme.classList.toggle('dark')

        if (theme.classList.contains('light')) {
                root.style.setProperty('--primary-color', '#001f3f')
                root.style.setProperty('--secondary-color', '#fff')
                theme.src = 'assets/imgs/dark-mode.svg'
                theme.style.filter = 'invert(9%) sepia(40%) saturate(4463%) hue-rotate(194deg) brightness(86%) contrast(103%)'
                sbLogo.src = 'assets/imgs/logoblue.png'
                socialM.forEach(img => img.style.filter = 'invert(10%) sepia(20%) saturate(6775%) hue-rotate(192deg) brightness(92%) contrast(102%)')
        }
        
        if (theme.classList.contains('dark')) {
                root.style.setProperty('--primary-color', '#fff')
                root.style.setProperty('--secondary-color', '#252525')
                theme.src = 'assets/imgs/light-mode.svg'
                theme.style.filter = 'invert(100%)'
                sbLogo.src = 'assets/imgs/logogreyscale.png'
                socialM.forEach(img => img.style.filter = 'invert(99%) sepia(83%) saturate(107%) hue-rotate(317deg) brightness(115%) contrast(106%)')
        }
})

sbLogo.addEventListener('click', () => location.reload())