import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegisterData } from '../data/userData';

export { RegisterData };

export class RegisterPage extends BasePage {
  public readonly nameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly organizationInput: Locator;
  public readonly billingAddressInput: Locator;
  public readonly billingAddressTwoInput: Locator;
  public readonly stateInput: Locator;
  public readonly cityInput: Locator;
  public readonly zipCodeInput: Locator;
  public readonly countryCodeInput: Locator;
  public readonly phoneNumberInput: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly loginButton: Locator;
  public readonly loginAnchor: Locator;
  public readonly registerButton: Locator;
  public readonly stateOptions: Locator;
  public readonly cityOptions: Locator;


  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByRole('textbox', { name: 'Name *', exact: true })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *', exact: true })
    this.organizationInput = page.getByRole('textbox', { name: 'Organization name *', exact: true })
    this.billingAddressInput = page.getByRole('textbox', { name: 'Billing Address *', exact: true })
    this.billingAddressTwoInput = page.getByRole('textbox', { name: 'Billing Address 2', exact: true })
    this.stateInput = page.locator('ng-select').filter({ hasText: 'State *' }).locator('.ng-select-container')
    this.cityInput = page.getByText('City *', { exact: true })
    this.zipCodeInput = page.getByRole('textbox', { name: 'Zip code *', exact: true })
    this.countryCodeInput = page.getByText('Country code *', { exact: true })
    this.phoneNumberInput = page.getByRole('textbox', { name: 'Phone number *', exact: true })
    this.emailInput = page.getByRole('textbox', { name: 'Email *', exact: true })
    this.passwordInput = page.getByPlaceholder('Password *', { exact: true })
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password *', exact: true })
    this.loginButton = page.getByRole('link', { name: 'Login', exact: true })
    this.loginAnchor = page.locator('a.text-primary')
    this.registerButton = page.getByRole('button', { name: 'REGISTER' })
    this.stateOptions = page.getByRole('option');
    this.cityOptions = page.getByRole('option');

  }

  async fillPersonalInfo(name: string, lastName: string, organization: string) {
    await this.nameInput.fill(name);
    await this.lastNameInput.fill(lastName);
    await this.organizationInput.fill(organization);
  }

  async fillAddressInfo(address1: string, address2: string, state: string, city: string, zip: string) {
    await this.billingAddressInput.fill(address1);
    await this.billingAddressTwoInput.fill(address2);
    await this.stateInput.click();
    await this.page.getByRole('option', { name: state, exact: true }).click();
    await this.cityInput.click();
    await this.page.getByRole('option', { name: city, exact: true }).click();
    await this.zipCodeInput.fill(zip);
  }

  async fillContactAndSecurity(email: string, phone: string, pass: string, countryCode: string) {
    await this.countryCodeInput.click();
    await this.page.getByRole('option', { name: countryCode, exact: true }).click();
    await this.phoneNumberInput.fill(phone);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.confirmPasswordInput.fill(pass);
  }

  async submitRegistration() {
    await this.registerButton.click();
  }

  async fillRegisterForm(data: RegisterData) {
    await this.fillPersonalInfo(data.name, data.lastName, data.organization);
    await this.fillAddressInfo(data.billingAddress, data.billingAddressTwo, data.state, data.city, data.zipCode);
    await this.fillContactAndSecurity(data.email, data.phoneNumber, data.password, data.countryCode);
  }

  async openStateDropdown() {
    await this.stateInput.click();
  }

  async openCityDropdown() {
    await this.cityInput.click();
  }

  async selectState(stateName: string) {
    await this.stateInput.click();
    await this.page.getByRole('option', { name: stateName, exact: true }).click();
  }


  async selectCountryCode(code: string) {
    await this.countryCodeInput.click();
    await this.page.getByRole('option', { name: code, exact: false }).click();
  }
}
