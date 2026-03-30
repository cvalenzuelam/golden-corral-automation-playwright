import { test, expect } from '../../fixtures/fixtures';

test.describe('Login test suite', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.navigateTo('/auth/login');
    });

    test.skip('Validate happy path Login', async ({ page, loginPage }) => {
        const email = process.env.TEST_USER_EMAIL as string;
        const password = process.env.TEST_USER_PASSWORD as string;

        await loginPage.fillLoginForm(email, password);
        await loginPage.loginButton.click();

        await expect(page).toHaveURL(/.*my-profile/);
        await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
    });

    test('Validate Login with invalid credentials', async ({ page, loginPage }) => {
        const invalidEmail = process.env.INVALID_TEST_USER_EMAIL as string;
        const invalidPassword = process.env.INVALID_TEST_USER_PASSWORD as string;

        await loginPage.fillLoginForm(invalidEmail, invalidPassword);
        await loginPage.loginButton.click();

        await expect(loginPage.invalidCredentialsError).toBeVisible();
        await expect(page).toHaveURL(/.*login/);
        await expect(loginPage.loginButton).toBeDisabled();
    });

    test('Validate Login without credentials', async ({ loginPage }) => {
        await loginPage.loginButton.click();

        await expect(loginPage.emailRequiredError).toBeVisible();
        await expect(loginPage.passwordRequiredError).toBeVisible();
    });

    test('Validate forgot password link', async ({ page, loginPage }) => {
        await loginPage.forgotPasswordLink.click();

        await expect(page).toHaveURL(/.*forgot-password/);
        await expect(page.getByRole('heading', { name: ' Reset Password ' })).toBeVisible();
    });

    test('Validate password is masked (hidden) by default', async ({ loginPage }) => {
        const password = process.env.TEST_USER_PASSWORD as string;

        await loginPage.fillLoginForm(undefined, password);
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('Validate password visibility toggle', async ({ loginPage }) => {
        const password = process.env.TEST_USER_PASSWORD as string;

        await loginPage.fillLoginForm(undefined, password);
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

        await loginPage.passwordVisibilityToggle.click();
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    });

    test('Validate Sign Up link navigation', async ({ page, loginPage }) => {
        await loginPage.signUpButton.click();
        await expect(page).toHaveURL(/.*register/);
        await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    });

    test('Validate accept cookies banner', async ({ page, loginPage }) => {
        await expect(loginPage.cookieBanner).toBeVisible();
        await loginPage.acceptCookiesButton.click();
        await expect(loginPage.cookieBanner).toBeHidden();
        await page.reload();
        await expect(loginPage.cookieBanner).toBeHidden();
    });

    test('Validate reject cookies banner', async ({ page, loginPage }) => {
        await expect(loginPage.cookieBanner).toBeVisible();
        await loginPage.rejectCookiesButton.click();
        await expect(loginPage.cookieBanner).toBeHidden();
        await page.reload();
        await expect(loginPage.cookieBanner).toBeHidden();
    });

    test('Validate exit cookie banner', async ({ page, loginPage }) => {
        await expect(loginPage.cookieBanner).toBeVisible();
        await loginPage.closeCookieBannerButton.click();
        await expect(loginPage.cookieBanner).toBeHidden();
        await page.reload();
        await expect(loginPage.cookieBanner).toBeVisible();
    });

    test('Validate login top button navigation', async ({ page, loginPage }) => {
        await loginPage.loginTopButton.click();
        await expect(page).toHaveURL(/.*auth\/login/);
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
    });

    test('Privacy Policy link navigation', async ({ page, loginPage }) => {
        await loginPage.privacyPolicyLink.click();
        await expect(page).toHaveURL(/.*privacy/);
        await expect(page.getByRole('heading', { name: 'Golden Corral Privacy Policy' })).toBeVisible();
    });

    test('Terms and Conditions link navigation', async ({ page, loginPage }) => {
        await loginPage.termsAndConditionsLink.click();
        await expect(page).toHaveURL(/.*terms/);
        await expect(page.getByRole('heading', { name: '403 Forbidden' })).toBeVisible();
    });

});
