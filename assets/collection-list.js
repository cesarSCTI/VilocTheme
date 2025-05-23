if (!customElements.get('collection-list')) {
  class CollectionList extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.selectors = {
        sliderWrapper: '.collection-list__items',
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };

      this.classes = {
        grid: 'f-grid',
        swiper: 'swiper',
        swiperWrapper: 'swiper-wrapper',
      };

      this.sectionId = this.dataset.sectionId;
      this.section = this.closest(`.section-${this.sectionId}`);
      this.sliderWrapper = this.querySelector(this.selectors.sliderWrapper);

      this.sliderInstance = false;

      const mql = window.matchMedia(FoxTheme.config.mediaQueryMobile);
      mql.onchange = this.init.bind(this);
      this.init();
    }

    init() {
      if (FoxTheme.config.mqlMobile) {
        this.destroySlider();
      } else {
        this.initSlider();
      }
    }

    initSlider() {
      const sliderOptions = {
        modules: [FoxTheme.Swiper.Navigation, FoxTheme.Swiper.Pagination],
        slidesPerView: 'auto',
        spaceBetween: 8,
        navigation: {
          nextEl: this.section.querySelector(this.selectors.nextEl),
          prevEl: this.section.querySelector(this.selectors.prevEl),
        },
        pagination: false,
        loop: false,
        threshold: 2,
        breakpoints: {
          768: {
            spaceBetween: 20,
          },
        },
      };

      if (typeof this.sliderInstance !== 'object') {
        this.classList.add(this.classes.swiper);
        this.sliderWrapper.classList.remove(this.classes.grid);
        this.sliderWrapper.classList.add(this.classes.swiperWrapper);

        this.sliderInstance = new window.FoxTheme.Carousel(this, sliderOptions);
        this.sliderInstance.init();

        const focusableElements = FoxTheme.a11y.getFocusableElements(this);

        focusableElements.forEach((element) => {
          element.addEventListener('focusin', () => {
            const slide = element.closest('.swiper-slide');
            this.sliderInstance.slider.slideTo(this.sliderInstance.slider.slides.indexOf(slide));
          });
        });

        if (Shopify.designMode) {
          document.addEventListener('shopify:block:select', (e) => {
            if (e.detail.sectionId != this.sectionId) return;
            let { target } = e;
            const index = Number(target.dataset.index);

            this.sliderInstance.slider.slideTo(index);
          });
        }
      }
    }

    destroySlider() {
      this.classList.remove(this.classes.swiper);
      this.sliderWrapper.classList.remove(this.classes.swiperWrapper);
      this.sliderWrapper.classList.add(this.classes.grid);
      if (typeof this.sliderInstance !== 'object') return;
      this.sliderInstance.slider.destroy();
      this.sliderInstance = false;
    }
  }
  customElements.define('collection-list', CollectionList);
}
