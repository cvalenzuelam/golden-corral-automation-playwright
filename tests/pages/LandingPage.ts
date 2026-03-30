import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LandingPage extends BasePage {

    public readonly viewLocationsButton: Locator;
    public readonly loginMiddleButton: Locator;


    constructor(page: Page) {
        super(page);
        this.viewLocationsButton = page.getByRole('link', { name: 'View Locations' });
        this.loginMiddleButton = page.locator('a').filter({ hasText: 'LOGIN' }).first()

    }

}