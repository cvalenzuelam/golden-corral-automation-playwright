import { test, expect } from '../../fixtures/fixtures';
import { validUser, duplicateUser } from '../../data/userData';

test.describe('Register Page', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('domcontentloaded');
    });

    test('Fill and Submit Form', async ({ page, registerPage }) => {
        await registerPage.fillRegisterForm(validUser);
        await registerPage.submitRegistration();
        await expect(page).toHaveURL(/.*\/auth\/verification-code\/singup/);
        await expect(page.getByRole('heading', { name: 'Verification Code' })).toBeVisible();
    });

    test('Button is disabled until required fields are filled', async ({ page, registerPage }) => {
        await expect(registerPage.registerButton).toBeDisabled();
        await registerPage.fillRegisterForm(validUser);
        await expect(registerPage.registerButton).toBeEnabled();
    });

    test('Verify Golden Corral Regions Count', async ({ page, registerPage }) => {

        await registerPage.openStateDropdown();
        await expect(registerPage.stateOptions.first()).toBeVisible();
        await expect(registerPage.stateOptions).toHaveCount(65);

    });

    test('Cities dropdown updates dynamically', async ({ page, registerPage }) => {
        await registerPage.selectState('Alaska');
        await registerPage.openCityDropdown();
        await expect(page.getByRole('option', { name: 'Adak', exact: true })).toBeVisible();

        await registerPage.selectState('Texas');
        await registerPage.openCityDropdown();

        await expect(page.getByRole('option', { name: 'Abbott', exact: true })).toBeVisible();
        await expect(page.getByRole('option', { name: 'Abilene', exact: true })).toBeVisible();
        await expect(page.getByRole('option', { name: 'Adak', exact: true })).toBeHidden();
    });

    test('Country Code dropdown selection', async ({ page, registerPage }) => {
        await registerPage.selectCountryCode('+1');
        await expect(page.getByRole('option', { name: '+52', exact: false })).toBeHidden();
    });

    test('Phone Number character limit and mask validation', async ({ page, registerPage }) => {
        await expect(registerPage.phoneNumberInput).toHaveAttribute('mask', '(000) 000-0000');

        const extraLongPhone = '123456789099999999';
        await registerPage.phoneNumberInput.fill(extraLongPhone);
        await expect(registerPage.phoneNumberInput).toHaveValue('(123) 456-7890');
    });

    test('Name and Last Name special characters validation', async ({ page, registerPage }) => {
        await registerPage.nameInput.fill('@$!#');
        await registerPage.lastNameInput.fill('%&/*');
        await registerPage.lastNameInput.press('Tab');

        const errorText = page.getByText("This field must contain only letters, ' and -", { exact: false });
        await expect(errorText).toHaveCount(2);
    });

    test('All required fields validation via Tab key', async ({ page, registerPage }) => {
        await registerPage.nameInput.click();

        for (let i = 0; i < 13; i++) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
        }

        const requiredLabels = page.getByText('This field is required', { exact: true });
        await expect(requiredLabels).toHaveCount(12);
    });

    test('Email format validation', async ({ page, registerPage }) => {
        await registerPage.emailInput.fill('invalid-email-format');
        await registerPage.emailInput.press('Tab');

        const emailError = page.getByText('Please enter a valid email', { exact: false });
        await expect(emailError).toBeVisible();

        await registerPage.emailInput.fill('qa.test@goldencorral.com');
        await registerPage.emailInput.press('Tab');

        await expect(emailError).toBeHidden();
    });

    test('Password requirements and mismatch validation', async ({ page, registerPage }) => {
        const robustPassword = 'GoldenCorral2024!';
        await registerPage.passwordInput.fill(robustPassword);

        await registerPage.confirmPasswordInput.fill('Different123!!');
        await registerPage.confirmPasswordInput.press('Tab');

        const mismatchLabel = page.getByText('Passwords do not match', { exact: false });
        await expect(mismatchLabel).toBeVisible();

        await registerPage.confirmPasswordInput.fill(robustPassword);
        await registerPage.confirmPasswordInput.press('Tab');
        await expect(mismatchLabel).toBeHidden();
    });

    test('Login link navigates to Login page', async ({ page, registerPage }) => {
        await registerPage.loginButton.click();
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('Registration with already registered email shows error', async ({ page, registerPage }) => {
        const cognitoResponsePromise = page.waitForResponse(
            r => r.url().includes('cognito-idp') && r.status() === 400
        );

        await registerPage.fillRegisterForm(duplicateUser);
        await registerPage.submitRegistration();

        const body = await (await cognitoResponsePromise).json();
        expect(body.__type).toBe('UsernameExistsException');
        expect(body.message).toBe('User already exists');

    });

});
