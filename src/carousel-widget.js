import {Widget} from 'ooui-widget';
import CarouselBeforeChangeEvent from './carousel-before-change-event.js';
import CarouselChangeEvent from './carousel-change-event.js';
import CarouselAfterChangeEvent from './carousel-after-change-event.js';
import CarouselDirection from './carousel-direction.js';

/**
 * Виджет карусели слайдов.
 */
export default class CarouselWidget extends Widget {

  /**
   * Создает экземпляр класса.
   * @param {HTMLElement} element Элемент.
   */
  constructor(element) {
    super(element);

    /**
     * Длительность анимации смены слайдов.
     * @type {Number}
     */
    this.duration = 0;

    /**
     * True, если карусель зациклена.
     * @type {Boolean}
     */
    this.isLoop = false;

    /**
     * True, если карусель должна показывать предупреждения в консоли.
     * @type {Boolean}
     */
    this.isDebug = false;



    /**
     * Класс, который добавляется активному слайду.
     * @type {String}
     */
    this._activeClass = 'active';

    /**
     * Класс, который добавляется слайду во время анимации появления.
     * @type {String}
     */
    this._enterClass = 'enter';

    /**
     * Класс, который добавляется слайду во время анимации скрытия.
     * @type {String}
     */
    this._leaveClass = 'leave';

    /**
     * Класс, который добавляется карусели при переходу к следующему слайду.
     * @type {String}
     */
    this._forwardClass = 'forward';

    /**
     * Класс, который добавляется карусели при переходе к предыдущему слайду.
     * @type {String}
     */
    this._backwardClass = 'backward';

    /**
     * Дескриптор асинхронной операции смены слайдов. Если не null, в
     * данный момент выполняется анимация.
     * @type {Number}
     */
    this._transition = null;

    /**
     * Массив слайдов карусели.
     * @type {Array}
     */
    this._slides = this._initSlides();

    /**
     * Номер активного слайда.
     * @type {Number}
     */
    this._index = this._initIndex();
  }

  /**
   * Обновляет виджет.
   * @return {void}
   */
  refresh() {
    super.refresh();

    this._slides = this._initSlides();
    this._index = this._initIndex();
  }

  /**
   * Возвращает массив слайдов карусели при создании экземпляра класса.
   * @return {Array} Массив слайдов.
   */
  _initSlides() {
    let slides = [];

    for (let slide of this.element.childNodes) {
      if (slide.nodeType != Node.ELEMENT_NODE) continue;
      slides.push(slide);
    }

    return slides;
  }

  /**
   * Возвращает номер активного слайда при создании экземпляра класса.
   * @return {Number} Номер активного слайда.
   */
  _initIndex() {
    for (let i = 0; i < this._slides.length; i++) {
      let slide = this._slides[i];

      if (slide.classList.contains(this._activeClass)) {
        return i;
      }
    }

    let first = this._slides[0];

    if (first) {
      first.classList.add(this._activeClass);
      return 0;
    }

    return null;
  }

  /**
   * Возвращает количество слайдов.
   * @return {Number} Количество.
   */
  _getCount() {
    return this._slides.length;
  }

  /**
   * Возвращает слайд по его номеру.
   * @param  {Number}      index Номер слайда.
   * @return {HTMLElement}       Слайд.
   */
  _getSlide(index) {
    return this._slides[index] || null;
  }

  /**
   * Возвращает номер активного слайда.
   * @return {Number} Номер слайда.
   */
  _getIndex() {
    return this._index;
  }

  /**
   * Делает активным следующий слайд, не запуская анимацию смены слайдов.
   * @param {Number}  index           Номер нового активного слайда.
   * @param {Boolean} [isEvents=true] True, если следует генерировать события.
   */
  _setIndex(index, isEvents = true) {
    if (this._transition) {
      this.isDebug
        && console.warn(`Cannot change active slide while animation is going`);
      return;
    }

    let currentIndex = this._getIndex();
    let currentSlide = this._getSlide(currentIndex);

    let nextIndex = index;
    let nextSlide = this._getSlide(nextIndex);

    if (!nextSlide) {
      throw new Error(`Index ${nextIndex} is out of range`);
    }

    if (nextIndex == currentIndex) {
      this.isDebug && console.warn(`Next and current slides are equal`);
      return;
    }

    if (isEvents) {
      let before = new CarouselBeforeChangeEvent(this, nextIndex);

      if (!before.dispatch()) {
        return;
      }

      let change = new CarouselChangeEvent(this, currentIndex);
      change.dispatch();
    }

    currentSlide.classList.remove(this._activeClass);
    nextSlide.classList.add(this._activeClass);

    this._index = nextIndex;

    if (isEvents) {
      let after = new CarouselAfterChangeEvent(this, currentIndex);
      after.dispatch();
    }
  }


  /**
   * Делает активным слайд с указанным номером.
   * @param {Number} index     Номер нового активного слайда.
   * @param {String} direction Направление смены слайдов CarouselDirection.
   */
  _change(index, direction) {
    if (this._transition) {
      this.isDebug
        && console.warn(`Cannot change active slide while animation is going`);
      return;
    }

    let currentIndex = this._getIndex();
    let currentSlide = this._getSlide(currentIndex);

    let nextIndex = index;
    let nextSlide = this._getSlide(nextIndex);

    if (!nextSlide) {
      throw new Error(`Index ${nextIndex} is out of range`);
    }

    if (nextIndex == currentIndex) {
      this.isDebug && console.warn(`Next and current slides are equal`);
      return;
    }

    let before = new CarouselBeforeChangeEvent(this, nextIndex);

    if (!before.dispatch()) {
      return;
    }

    let change = new CarouselChangeEvent(this, currentIndex);
    change.dispatch();

    currentSlide.classList.remove(this._activeClass);
    nextSlide.classList.add(this._activeClass);

    this._index = nextIndex;

    let after = new CarouselAfterChangeEvent(this, currentIndex);

    if (!this.duration) {
      after.dispatch();
      return;
    }

    if (!direction) {
      direction = currentIndex < nextIndex
        ? CarouselDirection.FORWARD : CarouselDirection.BACKWARD;
    }

    let transitionClass = direction == CarouselDirection.FORWARD
      ? this._forwardClass
      : this._backwardClass;

    this.element.classList.add(transitionClass);

    currentSlide.classList.add(this._leaveClass);
    nextSlide.classList.add(this._enterClass);

    let finish = () => {
      this.element.classList.remove(transitionClass);

      currentSlide.classList.remove(this._leaveClass);
      nextSlide.classList.remove(this._enterClass);

      this._transition = null;

      after.dispatch();
    };

    this._transition = setTimeout(finish, this.duration);
  }

  /**
   * Возвращает номер слайда, отстоящего от текущего на offset слайдов.
   * @param {Number} offset Смещение относительно текущего активного слайда.
   */
  _getOffsetIndex(offset) {
    return this.isLoop
      ? this._getOffsetLoopIndex(offset)
      : this._getOffsetLinearIndex(offset);
  }

  /**
   * Возвращает номер слайда, отстоящего от текущего на offset слайдов при
   * условии, что карусель зациклена.
   * @param {Number} offset Смещение относительно текущего активного слайда.
   */
  _getOffsetLoopIndex(offset) {
    let count = this._getCount();
    let index = (this._getIndex() + offset) % count;

    if (index < 0) {
      index = count + index;
    }

    return index;
  }

  /**
   * Возвращает номер слайда, отстоящего от текущего на offset слайдов при
   * условии, что карусель не зациклена.
   * @param {Number} offset Смещение относительно текущего активного слайда.
   */
  _getOffsetLinearIndex(offset) {
    let index = this._getIndex() + offset;
    let count = this._getCount();

    if (index >= count) {
      index = count - 1;
    }

    if (index < 0) {
      index = 0;
    }

    return index;
  }

  /**
   * Возвращает количество слайдов.
   * @return {Number} Количество слайдов.
   */
  get count() {
    return this._getCount();
  }

  /**
   * Возвращает номер активного слайда.
   * @return {Number} Номер слайда.
   */
  get index() {
    return this._getIndex();
  }

  /**
   * Задает номер нового активного слайда, не запуская анимацию смены слайдов,
   * но генерируя специальные события.
   * @param  {Number} index Номер слайда.
   * @return {void}
   */
  set index(index) {
    this._setIndex(index);
  }

  /**
   * Вызывает переход к слайду с указанным номером.
   * @param  {Number} index Номер слайда.
   * @return {void}
   */
  to(index) {
    this._change(index);
  }

  /**
   * Делает активным слайд, отстоящий от текущего на offset слайдов.
   * @param  {Number} offset Смещение относительно текущего активного слайда.
   * @return {void}
   */
  seek(offset) {
    let index = this._getOffsetIndex(offset);

    let direction = offset < 0
      ? CarouselDirection.BACKWARD
      : CarouselDirection.FORWARD;

    this._change(index, direction);
  }

  /**
   * Делает активным слайд, отстоящий от текущего на offset слайдов вперед.
   * @param  {Number} [offset=1] Смещение относительно текущего активного слайда.
   * @return {void}
   */
  next(offset = 1) {
    this.seek(offset);
  }

  /**
   * Делает активным слайд, отстоящий от текущего на offset слайдов назад.
   * @param  {Number} [offset=1] Смещение относительно текущего активного слайда.
   * @return {void}
   */
  back(offset = 1) {
    this.seek(offset * -1);
  }
}
