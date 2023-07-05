class Slider {
  constructor({
    bannerWrapperSelector= '.banner',
    bannerContentSelector = '#banner-content',
    slideIndicatorsSelector = '#slide-indicators',
    slideControlsSelector = '.slider-controls',
    slideSelector = '.slide',
    indicatorSelector = '.slide-indicator',
    intervalTime = 4000
  } = {}) {
    this.bannerContent = document.querySelector(bannerContentSelector);
    this.bannerWrapper = document.querySelector(bannerWrapperSelector);
    this.slideIndicators = document.querySelector(slideIndicatorsSelector);
    this.sliderControls = document.querySelector(slideControlsSelector);
    this.slides = document.querySelectorAll(slideSelector);
    this.indicators = document.querySelectorAll(indicatorSelector);
    this.interval = intervalTime;
    this.intervalID = null;

    this.slideIndicators.addEventListener('click', (event) => {
      if(event.target.type === 'button') this.captionHandler(event)
    });

    this.sliderControls.addEventListener('click', (event) => {
      if(event.target.type === 'button') this.controlsHandler(event)
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
      this.indicators[currentIndex].setAttribute('aria-selected', true);
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

  controlsHandler(event) {
    let newSlideIndex;
    const indicators = Array.from(this.slideIndicators.children)

    indicators.forEach((indicator, index, array) => {
      if(indicator.getAttribute('aria-selected') === 'true') {
        const value = event.target.value;
        const slidesCount = array.length - 1;

        if(value === 'next') newSlideIndex = index === slidesCount ? 0 : index + 1;
        else if(value === 'prev') newSlideIndex = index === 0 ? slidesCount : index - 1;
      }
    });

    if(newSlideIndex !== undefined && newSlideIndex !== null && newSlideIndex !== NaN)
      indicators[newSlideIndex]?.click();
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
        indicator.setAttribute('aria-selected', false);
      };
    }
  }
}

const slider = new Slider();
slider.startSlideshow();
