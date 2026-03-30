import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { ViewLocationsPage } from '../pages/ViewLocationsPage';
import { Header } from '../pages/Header';
import { PlaywrightUtils } from '../utils/PlaywrightUtils';

type MyFixtures = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  landingPage: LandingPage;
  viewLocationsPage: ViewLocationsPage;
  header: Header;
  playwrightUtils: PlaywrightUtils;
};

// Extendemos el test base de Playwright con nuestras fixtures
export const test = base.extend<MyFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  viewLocationsPage: async ({ page }, use) => {
    await use(new ViewLocationsPage(page));
  },
  playwrightUtils: async ({ page }, use) => {
    await use(new PlaywrightUtils(page));
  },



});

export { expect } from '@playwright/test';
