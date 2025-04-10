import { test, expect } from '@playwright/test';

test.describe('Geospatial Flow Editor', () => {
     test.beforeEach(async ({ page }) => {
          await page.goto('http://localhost:5173');
          // Wait for the app to be ready
          await page.waitForSelector('.MuiBox-root', { timeout: 10000 });
          // Wait for the node panel Paper component to be ready
          await page.waitForSelector('.MuiPaper-root', { timeout: 10000 });
     });

     test('creates a new source node', async ({ page }) => {
          // Find the draggable elements inside the MuiPaper-root class
          const elements = await page.$$('[class*="MuiPaper-root"] div[draggable="true"]');

          // Ensure that there are at least three draggable elements
          if (elements.length < 3) {
               throw new Error('Not enough draggable elements found');
          }

          // Select the first three draggable elements
          const firstThreeElements = elements.slice(0, 3);
          const viewport = page.locator('.react-flow__viewport');

          // Get the bounding boxes for the drag operation
          const sourceBox = await firstThreeElements[0].boundingBox();
          const viewportBox = await viewport.boundingBox();

          console.log('sourceBox:', sourceBox);
          console.log('viewportBox:', viewportBox);

          if (!sourceBox || !viewportBox) throw new Error('Could not get element positions');

          // Drag from the center of the source to the center of the viewport
          await page.mouse.move(
               sourceBox.x + sourceBox.width / 2,
               sourceBox.y + sourceBox.height / 2
          );
          await page.mouse.down();
          await page.mouse.move(viewportBox.x + 400, viewportBox.y + 400);
          await page.mouse.up();
          await page.waitForTimeout(500); // Wait for the node to be properly placed

          await page.screenshot({ path: 'screenshot_after_drag.png' });

          // Verify node is added to the canvas
          await page.waitForSelector('.selectable.draggable', { state: 'visible', timeout: 5000 });
          await expect(page.locator('.selectable.draggable')).toBeVisible();
     });
});
