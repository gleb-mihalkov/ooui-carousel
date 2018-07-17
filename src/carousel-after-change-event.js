import CarouselBaseChangeEvent from './carousel-base-change-event.js';

/**
 * Событие, возникающее после окончания анимации смены слайдов.
 */
export default class CarouselAfterChangeEvent extends CarouselBaseChangeEvent {

  /**
   * Создает экземпляр класса.
   * @param {CarouselWidget} widget Виджет карусели, вызвавщей событие.
   * @param {Number}         index  Номер предыдущего активного слайда.
   */
  constructor(widget, index) {
    super(widget, 'afterChange', index);
  }
}
