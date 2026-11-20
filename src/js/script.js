// Hamburger menu
const hamburger = document.querySelector('.nav__hamburger')
const navLinksContainer = document.querySelector('.nav__links')
const navLinks = document.querySelectorAll('.nav__links-link')
const body = document.querySelector('body')
const shadow = document.querySelector('.nav__shadow')
const navLinksDesktop = document.querySelectorAll('.nav__links-link-desktop')

// Faq
const faqItems = document.querySelectorAll('.faq__container')

// Year
const year = document.querySelector('.footer-bottom__box-year')


// ==========================================
// FUNKCJE PODSTAWOWE
// ==========================================

const hamburgerMenu = () => {
    navLinksContainer.classList.toggle('show-menu')
    body.classList.toggle('stop-scrolling')
    shadow.classList.toggle('show-shadow')
}

const handleFaq = e => {
    const faqBox = e.target.closest('.faq-mini-container')
    const faqBoxText = faqBox.querySelector('.faq__box-text')
    const faqBoxIcon = faqBox.querySelector('.faq__box-icon')

    faqBoxText.classList.toggle('show')
    faqBoxIcon.setAttribute('src', '../../dist/img/minus.png')

    if (!faqBoxText.classList.contains('show')) {
        faqBoxIcon.setAttribute('src', '../../dist/img/plus-icon-faq.png')
    }
}

const currentYear = () => {
    if (year) {
        year.textContent = new Date().getFullYear()
    }
}

// Inicjalizacja roku
currentYear()

// Nasłuchiwacze zdarzeń dla podstawowych elementów
if (hamburger) hamburger.addEventListener('click', hamburgerMenu)
if (shadow) shadow.addEventListener('click', hamburgerMenu)
navLinks.forEach(el => el.addEventListener('click', hamburgerMenu))
faqItems.forEach(el => el.addEventListener('click', handleFaq))


// ==========================================
// OBSŁUGA CENNIKA (Z dynamicznym nagłówkiem)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const switchButtons = document.querySelectorAll('.price__container-type-choice');
    const priceContainers = document.querySelectorAll('.price__container-price');
    const heading = document.getElementById('price-heading');

    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Zdejmujemy klasę 'active' ze wszystkich przycisków
            switchButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2. Ukrywamy wszystkie kontenery z cennikami
            priceContainers.forEach(container => {
                container.classList.remove('active');
                container.style.display = 'none';
            });

            // 3. Aktywujemy kliknięty przycisk
            button.classList.add('active');
            
            // 4. Pokazujemy odpowiedni cennik i zmieniamy tekst nagłówka
            const targetId = button.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId);
            
            if (targetContainer) {
                targetContainer.classList.add('active');
                targetContainer.style.display = ''; 

                // Logika zmiany tekstu w h2 (ZAKTUALIZOWANA O 4 KATEGORIE)
                if (heading) {
                    if (targetId === 'meble-cennik') {
                        heading.textContent = 'Tapicerka meblowa - cennik';
                    } else if (targetId === 'auto-cennik') {
                        heading.textContent = 'Tapicerka samochodowa - cennik';
                    } else if (targetId === 'sprzatanie-cennik') {
                        heading.textContent = 'Usługi sprzątania - cennik';
                    } else if (targetId === 'cisnienie-cennik') {
                        heading.textContent = 'Mycie ciśnieniowe - cennik';
                    }
                }
            }
        });
    });
});


// ==========================================
// OBSŁUGA SUWAKÓW PRZED/PO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.ba-slider')

    sliders.forEach(slider => {
        const imageWrapper = slider.querySelector('.ba-slider__image-wrapper')
        const imageAfter = imageWrapper.querySelector('img')
        const handle = slider.querySelector('.ba-slider__handle')

        let isDragging = false

        function setAfterImageWidth() {
            const sliderWidth = slider.offsetWidth
            if (imageAfter) imageAfter.style.width = `${sliderWidth}px`
        }

        setAfterImageWidth()
        window.addEventListener('resize', setAfterImageWidth)

        function moveSlider(xPosition) {
            const sliderRect = slider.getBoundingClientRect()
            let newPosition = ((xPosition - sliderRect.left) / sliderRect.width) * 100
            newPosition = Math.max(0, Math.min(100, newPosition))

            handle.style.left = `${newPosition}%`
            imageWrapper.style.width = `${newPosition}%`
        }

        // Myszka
        slider.addEventListener('mousedown', e => {
            isDragging = true
            e.preventDefault()
        })
        window.addEventListener('mouseup', () => isDragging = false)
        window.addEventListener('mousemove', e => {
            if (isDragging) moveSlider(e.clientX)
        })

        // Dotyk
        slider.addEventListener('touchstart', e => {
            isDragging = true
            // W zależności od potrzeb, zostaw e.preventDefault() lub je usuń
        }, { passive: true })
        window.addEventListener('touchend', () => isDragging = false)
        window.addEventListener('touchmove', e => {
            if (isDragging) moveSlider(e.touches[0].clientX)
        }, { passive: true })
    })
})


// ==========================================
// KARUZELA OPINII
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.reviews__container')
    if (!container) return

    const wrapper = container.querySelector('.reviews__wrapper')
    const dots = Array.from(container.querySelectorAll('.reviews__dot-box-dot'))
    const btnPrev = document.querySelector('.reviews__nav--prev')
    const btnNext = document.querySelector('.reviews__nav--next')

    const ORIGINAL_SLIDES = Array.from(wrapper.children).map(n => n.cloneNode(true))

    function getVisibleCount() {
        return window.innerWidth >= 1440 ? 2 : 1
    }

    function getSourceSlides() {
        const V = getVisibleCount()
        if (V === 1) return ORIGINAL_SLIDES.slice(0, 3)
        return ORIGINAL_SLIDES.slice()
    }

    let SRC_SLIDES = []
    let REAL_COUNT = 0
    let slides = []
    let index = 1 
    let isDragging = false
    let startX = 0, currentX = 0
    let isAnimating = false

    function stepPx() {
        const styles = getComputedStyle(wrapper)
        const gap = parseInt(styles.gap, 10) || 0
        return container.offsetWidth + gap
    }

    function setTranslateInstant() {
        wrapper.style.transition = 'none'
        wrapper.style.transform = `translateX(${-index * stepPx()}px)`
        wrapper.offsetHeight 
    }

    function _snap() {
        wrapper.style.transition = 'transform 0.4s ease'
        wrapper.style.transform = `translateX(${-index * stepPx()}px)`
    }

    function snap() {
        isAnimating = true
        _snap()
    }

    function forceUnlockAnimation() {
        if (!isAnimating) return
        wrapper.style.transition = 'none'
        wrapper.style.transform = `translateX(${-index * stepPx()}px)`
        wrapper.offsetHeight 
        isAnimating = false
    }

    function pages() {
        const V = getVisibleCount()
        return Math.ceil(REAL_COUNT / V)
    }

    function updateDots() {
        const p = pages()
        if(p === 0) return // Zabezpieczenie przed błędem jeśli brak slajdów
        const page = (index - 1 + p) % p 
        dots.forEach((d, i) => d.classList.toggle('active', i === page))
    }

    function rebuild() {
        const V = getVisibleCount()
        SRC_SLIDES = getSourceSlides()
        REAL_COUNT = SRC_SLIDES.length

        if (REAL_COUNT > 0 && REAL_COUNT < V) {
            const need = V - REAL_COUNT
            for (let i = 0; i < need; i++) {
                SRC_SLIDES.push(SRC_SLIDES[i % REAL_COUNT].cloneNode(true))
            }
            REAL_COUNT = SRC_SLIDES.length
        }

        wrapper.innerHTML = ''

        SRC_SLIDES.forEach(n => wrapper.appendChild(n.cloneNode(true)))

        for (let i = 0; i < V; i++) {
            const src = SRC_SLIDES[REAL_COUNT - V + i].cloneNode(true)
            wrapper.insertBefore(src, wrapper.firstChild)
        }

        for (let i = 0; i < V; i++) {
            const src = SRC_SLIDES[i].cloneNode(true)
            wrapper.appendChild(src)
        }

        slides = Array.from(wrapper.children)
        index = 1 
        setTranslateInstant()
        updateDots()
    }

    function nextPage() {
        index += 1
        snap()
    }

    function prevPage() {
        index -= 1
        snap()
    }

    function getX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX
    }

    function onStart(e) {
        if (isAnyExpanded()) pauseAutoplay()
        isDragging = true
        startX = currentX = getX(e)
        wrapper.style.transition = 'none'
    }

    function onMove(e) {
        if (!isDragging) return
        currentX = getX(e)
        const dx = currentX - startX
        wrapper.style.transform = `translateX(${-index * stepPx() + dx}px)`
    }

    function onEnd() {
        if (!isDragging) return
        isDragging = false

        const dx = currentX - startX
        const moved = Math.abs(dx) / stepPx()
        if (moved > 0.5) index += dx < 0 ? 1 : -1

        snap()
        if (!isAnyExpanded()) resumeAutoplay()
    }

    wrapper.addEventListener('touchstart', onStart, { passive: true })
    wrapper.addEventListener('touchmove', onMove, { passive: true })
    wrapper.addEventListener('touchend', onEnd)

    wrapper.addEventListener('mousedown', onStart)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)

    wrapper.addEventListener('transitionend', () => {
        isAnimating = false
        const p = pages()
        if (index >= p + 1) {
            index -= p 
            setTranslateInstant()
        }
        if (index <= 0) {
            index += p 
            setTranslateInstant()
        }
        updateDots()
    })

    let autoplayTimer = null
    const AUTO_MS = 10000 

    function startAutoplay() {
        if (autoplayTimer || isAnyExpanded()) return
        autoplayTimer = setInterval(nextPage, AUTO_MS)
    }

    function pauseAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer)
            autoplayTimer = null
        }
    }

    function resumeAutoplay() {
        startAutoplay()
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseAutoplay()
        else resumeAutoplay()
    })

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            pauseAutoplay()
            index = 1 + i 
            snap()
            if (!isAnyExpanded()) resumeAutoplay()
        })
    })

    function collapseAllExpanded() {
        const expanded = document.querySelectorAll('.reviews__box.is-expanded')
        expanded.forEach(box => {
            box.classList.remove('is-expanded')
            const btn = box.querySelector('.reviews__box-show-more')
            if (btn) btn.textContent = 'Pokaż więcej'
        })
    }

    if (btnNext) {
        btnNext.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            forceUnlockAnimation()
            collapseAllExpanded()
            pauseAutoplay()
            nextPage()
            if (!isAnyExpanded()) resumeAutoplay()
        })
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            forceUnlockAnimation()
            collapseAllExpanded()
            pauseAutoplay()
            prevPage()
            if (!isAnyExpanded()) resumeAutoplay()
        })
    }

    let lastV = getVisibleCount()
    rebuild()
    startAutoplay()

    window.addEventListener('resize', () => {
        const nowV = getVisibleCount()
        if (nowV !== lastV) {
            lastV = nowV
            rebuild()
        } else {
            setTranslateInstant()
            updateDots()
        }
    })

    const boxes = Array.from(document.querySelectorAll('.reviews__box'))
    boxes.forEach(box => {
        const btn = box.querySelector('.reviews__box-show-more')
        const text = box.querySelector('.reviews__box-text')
        if (!btn || !text) return

        btn.addEventListener('click', e => {
            e.preventDefault()
            const expanded = box.classList.toggle('is-expanded')
            btn.textContent = expanded ? 'Pokaż mniej' : 'Pokaż więcej'
            if (expanded) pauseAutoplay()
            else if (!isAnyExpanded()) resumeAutoplay()
        })
    })

    function isAnyExpanded() {
        return document.querySelector('.reviews__box.is-expanded') !== null
    }
})