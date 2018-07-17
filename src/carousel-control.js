/**
 * Базовый элемент управления каруселью.
 */
export default class CarouselControl {

  /**
   * Создает экземпляр класса.
   * @param {CarouselWidget} carousel Виджет карусели, которым управляет данный
   *                                  элемент.
   */
  constructor(carousel) {

    /**
     * Виджет карусели, которым управляет данный элемент.
     * @type {CarouselWidget}
     */
    this.carousel = carousel;
  }
}
