export class NoOpRenderer {
  constructor(){}

  /**
   * This is a dummy render function, will return template string without doing anything.
   * @param {string} template Template to render
   * @param {object} data Data to pass into underlying render function
   * @returns {string} Rendered HTML string
   */
  async renderHTML (template, data) {
    return template;
  }
}
