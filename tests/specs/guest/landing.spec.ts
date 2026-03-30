import { test, expect } from '../../fixtures/fixtures';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page, landingPage }) => {
        await landingPage.navigateTo('/');
    });

    test('View locations button should navigate to the locations page', async ({ landingPage, page }) => {
        await landingPage.viewLocationsButton.click();
        await expect(page).toHaveURL('/view-locations');
        await expect(page.getByRole('heading', { name: 'Select Your Location' })).toBeVisible();
    });

    test('Login button should navigate to the login page', async ({ landingPage, page }) => {
        await landingPage.loginMiddleButton.click();
        await expect(page).toHaveURL('/auth/login');
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    });


});

