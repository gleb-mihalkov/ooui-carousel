import {WidgetEvent} from 'ooui-widget';

/**
 * Событие, вызываемое перед сменой слайдов карусели.
 */
export default class CarouselBeforeChangeEvent extends WidgetEvent {

  /**
   * Создает экземпляр класса.
   * @param {CarouselWidget} widget Виджет карусели, вызвавщей событие.
   * @param {Number}         index  Номер слайда, который станет активным.
   */
  constructor(widget, index) {
    super(widget, 'beforeChange', {bubbles: true, cancelable: true});

    /**
     * Номер активного слайда.
     * @type {Number}
     */
    this.index = this.widget._getIndex();

    /**
     * Активный слайд.
     * @type {HTMLElement}
     */
    this.slide = this.widget._getSlide(this.index);

    /**
     * Номер слайда, который станет активным.
     * @type {Number}
     */
    this.nextIndex = index;

    /**
     * Слайд, который станет активным.
     * @type {HTMLElement}
     */
    this.nextSlide = this.widget._getSlide(this.nextIndex);
  }
}
