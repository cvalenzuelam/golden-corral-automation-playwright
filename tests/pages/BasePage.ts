import { Locator, Page } from '@playwright/test';
import { Header } from './Header';

export abstract class BasePage {
    public readonly page: Page;
    public readonly header: Header;
    public readonly cookieBanner: Locator;
    public readonly acceptCookiesButton: Locator;
    public readonly rejectCookiesButton: Locator;
    public readonly closeCookieBannerButton: Locator;
    public readonly privacyPolicyLink: Locator;
    public readonly termsAndConditionsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.cookieBanner = page.getByText('We use cookies', { exact: false });
        this.acceptCookiesButton = page.getByRole('button', { name: ' Accept Cookies ', exact: true });
        this.rejectCookiesButton = page.getByRole('button', { name: ' Reject All ', exact: true });
        this.closeCookieBannerButton = page.getByRole('button', { name: 'Close cookie banner' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'PRIVACY POLICY' });
        this.termsAndConditionsLink = page.getByRole('link', { name: 'TERMS + CONDITIONS' });
    }

    async navigateTo(path: string) {
        await this.page.goto(path);
    }

    async acceptCookies() {
        if (await this.cookieBanner.isVisible()) {
            await this.acceptCookiesButton.click();
        }
    }

    async rejectCookies() {
        if (await this.cookieBanner.isVisible()) {
            await this.rejectCookiesButton.click();
        }
    }
}