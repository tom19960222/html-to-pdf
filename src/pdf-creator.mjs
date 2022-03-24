import {FileReader} from './reader/file.mjs';
import {NoOpRenderer} from './html-renderer/noop.mjs'
import {EJSRenderer} from './html-renderer/ejs.mjs'
import fs from 'fs/promises'
import puppeteer from 'puppeteer'

const readers = {
  file: () => new FileReader(),
}
const renderers = {
  noop: () => new NoOpRenderer(),
  ejs: () => new EJSRenderer(),
}

export class PDFCreator {
  /**
   * 
   * @param {'file'} reader Reader to use, possible values: `file`
   * @param {'noop' | 'ejs'} renderer HTML renderer to use, possible values: `noop`, `ejs`
   */
  constructor(reader, renderer) {
    if(!readers[reader]) throw new Error(`Unknown template reader: ${reader}`)
    if(!renderers[renderer]) throw new Error(`Unknown HTML renderer: ${renderer}`)
    
    this.templateReader = readers[reader]();
    this.templateRenderer = renderers[renderer]();
  }

  /**
   * 
   * @param {string} renderedHTML 
   * @returns {Promise<Buffer>} Buffer contains created PDF file.
   */
  async #createPDFFile(renderedHTML) {
    let browser;
    try {
      browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();
      await page.setContent(renderedHTML, {
        waitUntil: 'networkidle2',
      });
      const pdfContent = await page.pdf({ format: 'a4' });
      await browser.close();
      return pdfContent;
    }
    catch(err) {
      if(browser) await browser.close();
      throw err;
    }
  }

  /**
   * Create PDF file using provided template and data file, then output to provided path.
   * @param {Object} options
   * @param {!string} options.templatePath - Path of template file, required.
   * @param {!string} options.outputPath - Path to output final PDF file, required.
   * @param {string} options.dataPath - Path to JSON format data file, will be use when rendering HTML template.
   */
  async createPDF({templatePath, outputPath, dataPath}) {
    const templateHTML = await this.templateReader.read(templatePath);
    const data = (dataPath && dataPath.length > 0) ? JSON.parse(await this.templateReader.read(dataPath)) : {};
    const renderedHTML = await this.templateRenderer.renderHTML(templateHTML, data);
    const pdfFileContent = await this.#createPDFFile(renderedHTML);
    await fs.writeFile(outputPath, pdfFileContent);
  }
}
