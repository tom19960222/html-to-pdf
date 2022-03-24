import ejs from 'ejs';

export class EJSRenderer {
  constructor(){}

  /**
   * Render ejs template to HTML. `include` markup is not supported.
   * @param {string} template Template to render
   * @param {object} data Data to pass into underlying render function
   * @returns {string} Rendered HTML string
   */
   async renderHTML (template, data) {
    return ejs.render(template, data);
  }
}