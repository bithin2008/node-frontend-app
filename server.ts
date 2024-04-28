import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import 'localstorage-polyfill'
const port = process.env['PORT'] || 8010;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/fphw-website/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
    if(req.originalUrl == '/quote' || req.originalUrl == '/quote/'){
         res.redirect(301, `/home-warranty-quotes`);
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 8010;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
  (global as any).WebSocket = require('ws');
  (global as any).XMLHttpRequest = require('xhr2');
  const domino = require('domino-ext');
  const fs = require('fs');
  const path = require('path');
  const distFolder = join(process.cwd(), 'dist/fphw-website/browser');
  const template = fs.readFileSync(path.join(distFolder, 'index.html')).toString();
  const win = domino.createWindow(template.toString());

  global['window'] = win;
  global['document'] = win.document;
  global['IDBIndex'] = win.IDBIndex
  global['document'] = win.document
  global['navigator'] = win.navigator
  global['HTMLElement'] = win.HTMLElement
  global['getComputedStyle'] = win.getComputedStyle;
  global['scrollTo'] = win.scrollTo;
  global['localStorage'] = localStorage;
  global['Event'] = win.Event;
  global['Event']['prototype'] = win.Event.prototype;
  global['cancelAnimationFrame'] = function (id) {
    clearTimeout(id);
  };

  /* (global as any).WebSocket = require('ws');
  (global as any).XMLHttpRequest = require('xhr2');
  const domino = require('domino-ext');
  const fs = require('fs');
  const path = require('path');
  const distFolder = join(process.cwd(), 'dist/fphw-website/browser');
  const template = fs.readFileSync(path.join(distFolder, 'index.html')).toString();
  const win = domino.createWindow(template.toString());

  global['window'] = win;
  global['document'] = win.document;
  global['IDBIndex'] = win.IDBIndex
  global['document'] = win.document
  global['navigator'] = win.navigator
  global['HTMLElement'] = win.HTMLElement
  (global as any)['object'] = win.object;
  global['getComputedStyle'] = win.getComputedStyle;
  global['scrollTo'] = win.scrollTo;
  global['localStorage'] = localStorage;
  global['Event'] = win.Event;
  global['Event']['prototype'] = win.Event.prototype;
  global['cancelAnimationFrame'] = function (id) {
    clearTimeout(id);
  }; */
}

export * from './src/main.server';