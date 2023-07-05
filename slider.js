class Slider {
  constructor({
    bannerWrapperSelector= '.banner',
    bannerContentSelector = '#banner-content',
    slideIndicatorsSelector = '#slide-indicators',
    slideSelector = '.slide',
    indicatorSelector = '.slide-indicator',
    intervalTime = 4000
  } = {}) {
    this.bannerContent = document.querySelector(bannerContentSelector);
    this.bannerWrapper = document.querySelector(bannerWrapperSelector);
    this.slideIndicators = document.querySelector(slideIndicatorsSelector);
    this.slides = document.querySelectorAll(slideSelector);
    this.indicators = document.querySelectorAll(indicatorSelector);
    this.interval = intervalTime;
    this.intervalID = null;

    this.slideIndicators.addEventListener('click', (event) => {
      if(event.target.type === 'button') this.captionHandler(event)
    });
  }

  startSlideshow(startIndex = 0) {
    this.bannerWrapper.style = `--duration: ${this.interval / 1000}s`;

    if (this.intervalID) clearInterval(this.intervalID);

    let currentIndex = startIndex;

    this.intervalID = setInterval(() => {
      this.dropActiveSlides(currentIndex);

      currentIndex = (currentIndex + 1) % this.slides.length;

      this.slides[currentIndex].classList.add("active");
      this.indicators[currentIndex].classList.add("active");
    }, this.interval);
  }

  captionHandler(event) {
    const button = event.target;

    this.dropActiveSlides();

    this.slides[button.value].classList.add('active')
    button.classList.add('active');
    button.setAttribute('aria-selected', true);

    this.startSlideshow(button.value);
  }

  dropActiveSlides(index) {
    if(index) {
      this.slides[index].classList.remove("active");
      this.indicators[index].classList.remove("active");
      this.indicators[index].setAttribute('aria-selected', false);
    } else {
      for(let slide of this.slides) slide.classList.remove('active');

      for(let indicator of this.indicators) {
        indicator.classList.remove('active')
        indicator.setAttribute('aria-selected', true);
      };
    }
  }
}

const slider = new Slider();
slider.startSlideshow();
