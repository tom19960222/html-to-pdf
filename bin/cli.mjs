import yargs from 'yargs';
import { hideBin }  from 'yargs/helpers'
import {PDFCreator} from '../src/pdf-creator.mjs'

/**
 * 
 * @param {string} templatePath 
 * @returns {'noop' | 'ejs'} Renderer to use
 */
const determineRendererType = templatePath => {
  if (templatePath.endsWith('ejs')) return 'ejs';
  return 'noop';
}

const argv = yargs(hideBin(process.argv)).options({
  template: {
    type: 'string',
    requiresArg: true,
    demandOption: true,
    describe: 'HTML template path to use'
  },
  output: {
    type: 'string',
    requiresArg: true,
    demandOption: true,
    describe: 'Final PDF file output path'
  },
  data: {
    type: 'string',
    requiresArg: true,
    describe: 'JSON data file to use when rendering HTML template'
  },
})
.help()
.argv;

const pdfCreator = new PDFCreator('file', determineRendererType(argv.template));
pdfCreator.createPDF({templatePath: argv.template, outputPath: argv.output, dataPath: argv.data}).then(() => {
  console.log('created success');
  process.exit(0);
})