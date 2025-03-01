// tests/index.test.js
import { captureScreenshots } from '../src/index.js';
import puppeteer from 'puppeteer';
import fs from 'fs';

// Mock Puppeteer and fs methods
jest.mock('puppeteer');
jest.mock('fs');

describe('captureScreenshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should capture screenshots for each route', async () => {
    const routes = ['/', '/about'];
    const outputDir = 'fakeDir';
    const baseUrl = 'http://fakeurl';

    // Force directory creation by simulating that the directory doesn't exist
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {});

    // Create mocks for Puppeteer browser and page functions
    const screenshotMock = jest.fn().mockResolvedValue(null);
    const gotoMock = jest.fn().mockResolvedValue(null);
    const closeMock = jest.fn().mockResolvedValue(null);
    const newPageMock = jest.fn().mockResolvedValue({
      goto: gotoMock,
      screenshot: screenshotMock,
    });

    const browserMock = {
      newPage: newPageMock,
      close: closeMock,
    };

    puppeteer.launch.mockResolvedValue(browserMock);

    // Call the screenshot capture function
    await captureScreenshots(routes, outputDir, baseUrl);

    // Check that the directory existence was verified and created
    expect(fs.existsSync).toHaveBeenCalledWith(outputDir);
    expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
    
    // Verify Puppeteer functions were called as expected
    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(newPageMock).toHaveBeenCalledTimes(1);
    // Each route should trigger a navigation and a screenshot
    expect(gotoMock).toHaveBeenCalledTimes(routes.length);
    expect(screenshotMock).toHaveBeenCalledTimes(routes.length);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
