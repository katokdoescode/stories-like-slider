/**
 * Constructs a Slider object that enables automatic slideshow functionality.
 * @param {Object} obj - An object containing the CSS selectors for various elements used in the slideshow.
 * @param {string} obj.bannerWrapperSelector - The CSS selector for the banner wrapper element.
 * @param {string} obj.bannerContentSelector - The CSS selector for the banner content element.
 * @param {string} obj.slideIndicatorsSelector - The CSS selector for the slide indicator elements.
 * @param {string} obj.slideControlsSelector - The CSS selector for the slide control elements.
 * @param {string} obj.slideSelector - The CSS selector for the slide elements.
 * @param {string} obj.indicatorSelector - The CSS selector for the slide indicator elements.
 * @param {number} obj.intervalTime - The interval between slide transitions in milliseconds.
 */
class Slider {
  constructor({
    bannerWrapperSelector = '.banner',
    bannerContentSelector = '#banner-content',
    slideIndicatorsSelector = '#slide-indicators',
    slideControlsSelector = '.slider-controls',
    slideSelector = '.slide',
    activeSlideSelector = '.slide.active',
    indicatorSelector = '.slide-indicator',
    intervalTime = 4000
  } = {}) {
    this.bannerContent = document.querySelector(bannerContentSelector);
    this.bannerWrapper = document.querySelector(bannerWrapperSelector);
    this.slideIndicators = document.querySelector(slideIndicatorsSelector);
    this.sliderControls = document.querySelector(slideControlsSelector);
    this.slides = document.querySelectorAll(slideSelector);
    this.activeSlideSelector = activeSlideSelector;
    this.indicators = document.querySelectorAll(indicatorSelector);
    this.interval = intervalTime;
    this.intervalID = null;
    this.touchStartX = null;
    this.threshold = 100;

    this.slideIndicators.addEventListener('click', (event) => {
      if (event.target.type === 'button') this.captionHandler(event);
    });

    this.sliderControls.addEventListener('click', (event) => {
      if (event.target.type === 'button') this.controlsHandler(event);
    });

    this.bannerWrapper.addEventListener('touchstart', (event) => {
      this.touchStartX = event.touches[0].clientX;
    });

    this.bannerWrapper.addEventListener('touchend', (event) => {
      this.swipeHandler(event);

      this.dropSlidesStyles();
    });

    this.bannerWrapper.addEventListener('touchmove', (event) => {
      this.swipeAnimation(event);
    });

  }

  /**
   * Begins the slideshow from the specified start index.
   * @param {number} [startIndex=0] - The index at which the slideshow should start.
   */
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

  /**
   * Handles the event that occurs when a slide indicator button is clicked.
   * @param {Event} event - The click event.
   */
  captionHandler(event) {
    const button = event.target;

    this.dropActiveSlides();

    this.slides[button.value].classList.add('active')
    button.classList.add('active');
    button.setAttribute('aria-selected', true);

    this.startSlideshow(button.value);
  }

  /**
   * Handles the event that occurs when a slide control button is clicked.
   * @param {Event} event - The click event.
   */
  controlsHandler(event) {
    let newSlideIndex;
    const indicators = Array.from(this.slideIndicators.children)

    indicators.forEach((indicator, index, array) => {
      if (indicator.getAttribute('aria-selected') === 'true') {
        const value = event.target.value;
        const slidesCount = array.length - 1;

        if (value === 'next') newSlideIndex = index === slidesCount ? 0 : index + 1;
        else if (value === 'prev') newSlideIndex = index === 0 ? slidesCount : index - 1;
      }
    });

    if (newSlideIndex !== undefined && newSlideIndex !== null && newSlideIndex !== NaN)
      indicators[newSlideIndex]?.click();
  }

  /**
   * Handles the event that occurs when the user finishes a swipe gesture.
   * @param {Event} event - The touchend event.
   */
  swipeHandler(event) {
    if (this.touchStartX && Math.abs(this.touchStartX - event.changedTouches[0].clientX) > this.threshold) {
      if (this.touchStartX > event.changedTouches[0].clientX) {
        this.sliderControls.querySelector('[value="next"]').click();
      } else {
        this.sliderControls.querySelector('[value="prev"]').click();
      }
    }

    this.touchStartX = null;
  }
  /**
   * Handles the swipe animation of the slide elements. This function will
   * determine the direction of the swipe and apply the appropriate
   * CSS animation classes to the active and next slides.
   *
   * @param {TouchEvent} event - The touch event triggered by the 'touchmove' event listener.
   */
  swipeAnimation(event) {
    const activeSlide = document.querySelector(this.activeSlideSelector);
    const currentTouchPositionX = event.touches[0].clientX;
    const deltaX = currentTouchPositionX - this.touchStartX;

    const activeSlideIndex = Array.from(this.slides).indexOf(activeSlide);
    let nextSlideIndex;

    // If moving to the right, choose the previous slide, else choose the next slide
    if (deltaX > 0) {
      nextSlideIndex = activeSlideIndex === 0 ? this.slides.length - 1 : activeSlideIndex - 1;
    } else {
      nextSlideIndex = (activeSlideIndex + 1) % this.slides.length;
    }

    const nextSlide = this.slides[nextSlideIndex];

    // Determine the swipe direction
    const swipeDirection = deltaX > 0 ? 'right' : 'left';

    // Remove the existing animation classes
    activeSlide.classList.remove('swipeInLeft', 'swipeInRight', 'swipeOutLeft', 'swipeOutRight');
    nextSlide.classList.remove('swipeInLeft', 'swipeInRight', 'swipeOutLeft', 'swipeOutRight');

    // Add the appropriate animation class based on the swipe direction
    if (swipeDirection === 'right') {
      activeSlide.classList.add('swipeOutRight');
      nextSlide.classList.add('swipeInRight');
    } else {
      activeSlide.classList.add('swipeOutLeft');
      nextSlide.classList.add('swipeInLeft');
    }
  }

  /**
   * Removes the "active" class and 'aria-selected' attribute from all slides and indicators,
   * or a specific slide and indicator if an index is provided.
   * @param {number} [index] - The index of the slide and indicator to deactivate.
   */
  dropActiveSlides(index) {
    if (index) {
      this.slides[index].classList.remove("active");
      this.indicators[index].classList.remove("active");
      this.indicators[index].setAttribute('aria-selected', false);
    } else {
      for (let slide of this.slides) slide.classList.remove('active');

      for (let indicator of this.indicators) {
        indicator.classList.remove('active')
        indicator.setAttribute('aria-selected', false);
      };
    }
  }

  /**
   * Removes swipe animation CSS classes from all slide elements after a delay.
   * This method is used to clean up the CSS classes added during the swipe animation,
   * allowing for the animations to be applied again when the next swipe occurs.
   */
  dropSlidesStyles() {
    setTimeout(() => {
      for (let slide of this.slides) {
        slide.classList.remove('swipeInLeft', 'swipeInRight', 'swipeOutLeft', 'swipeOutRight');
      }
    }, 600)
  }
}

const slider = new Slider();
slider.startSlideshow();
