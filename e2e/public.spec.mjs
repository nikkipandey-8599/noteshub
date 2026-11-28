import {test,expect} from '@playwright/test';
test('public homepage and library',async({page})=>{await page.goto('/');await expect(page).toHaveTitle(/NotesHub/);await page.goto('/explore');await expect(page).toHaveTitle(/NotesHub/);await expect(page.locator('main').first()).toBeVisible()});
for(const route of ['/upload','/dashboard','/admin','/profile','/library'])test('anonymous access redirects '+route,async({page})=>{await page.goto(route);await expect(page).toHaveURL(/\/login\?next=/)});
test('mobile layout has no horizontal overflow',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('body')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(391)});
