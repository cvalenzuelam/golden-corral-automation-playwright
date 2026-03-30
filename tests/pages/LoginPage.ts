import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly forgotPasswordLink: Locator;
    public readonly loginButton: Locator;
    public readonly signUpButton: Locator;
    public readonly passwordVisibilityToggle: Locator;
    public readonly invalidCredentialsError: Locator;
    public readonly emailRequiredError: Locator;
    public readonly passwordRequiredError: Locator;
    public readonly loginTopButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByPlaceholder('Email', { exact: true });
        this.passwordInput = page.getByPlaceholder('Password', { exact: true });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password? ' });
        this.loginButton = page.getByRole('button', { name: 'LOGIN' })
        this.loginTopButton = page.getByRole('link', { name: 'LOGIN' });
        this.signUpButton = page.getByRole('link', { name: ' OR SIGN UP NOW ' });
        this.passwordVisibilityToggle = page.locator('.feather.feather-eye');
        this.invalidCredentialsError = page.getByText('Incorrect username or password.', { exact: true });
        this.emailRequiredError = page.getByText(' Enter a valid email address ', { exact: true });
        this.passwordRequiredError = page.getByText(' Enter password ', { exact: true });
    }

    async fillLoginForm(email?: string, password?: string) {
        if (email) {
            await this.emailInput.fill(email);
        }
        if (password) {
            await this.passwordInput.fill(password);
        }
    }
}
