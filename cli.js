#!/usr/bin/env node
import { captureScreenshots } from './src/index.js';

// Here you could parse command line arguments to get routes, outputDir, etc.
// For demonstration, we use a hardcoded list.
const routes = ['/', '/about', '/contact'];
const outputDir = './screenshots';
const baseUrl = 'http://localhost:3000';

captureScreenshots(routes, outputDir, baseUrl)
  .then(() => console.log('All screenshots captured successfully!'))
  .catch((error) => console.error('Error capturing screenshots:', error));
