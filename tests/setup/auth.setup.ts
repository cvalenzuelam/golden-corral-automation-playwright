import { test as setup } from '@playwright/test';
import fs from 'fs';
const authFile = 'playwright/.auth/user.json';
const ONE_HOUR = 60 * 60 * 1000;
setup('authenticate', async ({ page }) => {
    if (fs.existsSync(authFile) && Date.now() - fs.statSync(authFile).mtimeMs < ONE_HOUR) {
        return; // Sesión todavía válida
    }
    await page.goto('/auth/login');
    await page.getByPlaceholder('Email').fill(process.env.TEST_USER_EMAIL!);
    await page.getByPlaceholder('Password').fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await page.waitForURL(/.*my-profile/);
    await page.context().storageState({ path: authFile });
});