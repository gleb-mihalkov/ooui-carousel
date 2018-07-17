import CarouselBaseChangeEvent from './carousel-base-change-event.js';

/**
 * Событие, возникающее сразу же после смены активного слайда, но до окончания
 * анимации смены слайдов.
 */
export default class CarouselChangeEvent extends CarouselBaseChangeEvent {

  /**
   * Создает экземпляр класса.
   * @param {CarouselWidget} widget Виджет карусели, вызвавщей событие.
   * @param {Number}         index  Номер предыдущего активного слайда.
   */
  constructor(widget, index) {
    super(widget, 'change', index);
  }
}
