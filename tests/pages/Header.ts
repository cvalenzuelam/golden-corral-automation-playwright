import { Locator, Page } from '@playwright/test';

export class Header {
    public readonly page: Page;
    public readonly loginTopButton: Locator;
    public readonly registerTopButton: Locator;
    public readonly homeButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.homeButton = page.locator('section:visible');
        this.loginTopButton = page.getByRole('link', { name: 'LOGIN' });
        this.registerTopButton = page.getByRole('link', { name: 'REGISTER' });
    }

}
