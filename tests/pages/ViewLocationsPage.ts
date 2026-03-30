import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ViewLocationsPage extends BasePage {
    public readonly locationSearchInput: Locator;
    public readonly searchButton: Locator;
    public readonly locationNameTitle: Locator;
    public readonly locationAddressText: Locator;
    public readonly datePicker: Locator;
    public readonly datePickerPlaceholder: Locator;
    public readonly dataPickerMonthLabel: Locator;
    public readonly dataPickerYearInput: Locator;
    public readonly dataPickerNextMonthButton: Locator;
    public readonly dataPickerPreviousMonthButton: Locator;
    public readonly dataPickerTodayDateButton: Locator;
    public readonly selectTimeDropdown: Locator;
    public readonly minusPartySizeButton: Locator;
    public readonly plusPartySizeButton: Locator;
    public readonly partySizeInput: Locator;
    public readonly cancelButton: Locator;
    public readonly partySizeErrorMessage: Locator;
    public readonly reservationUnavailableMessage: Locator;
    public readonly reservationUnavailableOkButton: Locator;
    public readonly timePickerOptions: Locator;
    public readonly okButton: Locator;

    constructor(page: Page) {
        super(page);
        this.locationSearchInput = page.getByPlaceholder('Search by City, State or Zip');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.locationNameTitle = page.locator('div.font-bold.test-text-lg');
        this.locationAddressText = page.locator('div.text-sm.test-text-sm');
        this.datePicker = page.locator("input[placeholder='Select Date'][type='text']");
        this.datePickerPlaceholder = page.locator('input[type="hidden"]')
        this.dataPickerMonthLabel = page.locator('span.cur-month');
        this.dataPickerYearInput = page.getByLabel('Year');
        this.dataPickerNextMonthButton = page.getByText('>', { exact: true });
        this.dataPickerPreviousMonthButton = page.getByText('<', { exact: true });
        this.dataPickerTodayDateButton = page.locator('.flatpickr-day.today');
        this.selectTimeDropdown = page.getByRole('textbox', { name: 'Select Time    ' });
        this.minusPartySizeButton = page.locator('div.inline-flex.items-center').locator('button').nth(0);
        this.plusPartySizeButton = page.locator('div.inline-flex.items-center').locator('button').nth(1);
        this.partySizeInput = page.locator('#partySize');
        this.cancelButton = page.getByRole('link', { name: 'CANCEL' });
        this.partySizeErrorMessage = page.getByText('The party size number cannot be less than 27. If you require fewer guests, please click here.', { exact: true });
        this.reservationUnavailableMessage = page.locator('.swal2-popup');
        this.reservationUnavailableOkButton = page.locator('button.swal2-confirm');
        this.timePickerOptions = page.locator('.time-picker-dropdown div');
        this.okButton = page.locator("//button[normalize-space()='OK']");
    }

    async selectAvailableDate() {
        const firstAvailableDay = this.page.locator('.flatpickr-day.today ~ .flatpickr-day:not(.flatpickr-disabled)').first();
        const dateText = await firstAvailableDay.getAttribute('aria-label');
        await firstAvailableDay.click();

        const date = new Date(dateText!);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const expectedDate = `${year}-${month}-${day}`;
        await expect(this.datePickerPlaceholder).toHaveValue(expectedDate);

    }

    async validateDateRestrictions() {
        const today = this.page.locator('.flatpickr-day.today');
        const followingDays = this.page.locator('.flatpickr-day.today ~ .flatpickr-day');

        await expect(today).toHaveClass(/disabled/);
        await expect(followingDays.nth(0)).toHaveClass(/disabled/);
        await expect(followingDays.nth(1)).toHaveClass(/disabled/);
        const firstAvailableDay = followingDays.nth(2);
        await expect(firstAvailableDay).not.toHaveClass(/disabled/);
    }

    async validateOneYearRange() {
        const todayLabel = await this.dataPickerTodayDateButton.getAttribute('aria-label');
        const parts = todayLabel!.split(' ');
        const month = parts[0];
        const day = parts[1].replace(',', '');
        const year = parts[2];
        const nextYear = (Number(year) + 1).toString();

        await this.dataPickerYearInput.click();
        await this.dataPickerYearInput.fill(nextYear);
        await this.dataPickerYearInput.press('Enter');

        const nextDayNumber = (Number(day) + 1).toString();
        const nextDayLabel = `${month} ${nextDayNumber}, ${nextYear}`;
        const firstLockedDay = this.page.locator(`.flatpickr-day[aria-label="${nextDayLabel}"]`);

        await expect(firstLockedDay).toHaveText(nextDayNumber);
        await expect(firstLockedDay).toHaveClass(/.*flatpickr-disabled.*/);

        const tooltipText = 'This day is unavailable; bookings open up to 365 days in advance.';
        await this.verifyTooltip(firstLockedDay, tooltipText);
    }

    async verifyTooltip(dayElement: Locator, expectedText: string) {
        await dayElement.hover();
        await expect(dayElement).toHaveAttribute('aria-expanded', 'true');
        await expect(this.page.getByText(expectedText)).toBeVisible();
    }

    async selectAvailableTime() {
        await this.selectTimeDropdown.click();
        await this.timePickerOptions.first().click();
    }
}
