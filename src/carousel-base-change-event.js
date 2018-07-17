import {WidgetEvent} from 'ooui-widget';

/**
 * Базовый класс для события смены слайдов карусели.
 */
export default class CarouselBaseChangeEvent extends WidgetEvent {

  /**
   * Создает экземпляр класса.
   * @param {CarouselWidget} widget Виджет карусели, вызвавщей событие.
   * @param {String}         type   Тип события.
   * @param {Number}         index  Номер предыдущего активного слайда.
   */
  constructor(widget, type, index) {
    super(widget, type, {bubbles: true, cancelable: true});

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
     * Номер предыдущего активного слайда.
     * @type {Number}
     */
    this.previousIndex = index;

    /**
     * Предыдущий активный слайд.
     * @type {HTMLElement}
     */
    this.previousSlide = this.widget._getSlide(index);
  }
}
