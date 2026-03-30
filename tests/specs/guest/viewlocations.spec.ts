import { test, expect } from '../../fixtures/fixtures';


test.describe("View Locations Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/view-locations");
    });

    test("Validate view location happy path", async ({ viewLocationsPage, page, playwrightUtils }) => {

        await viewLocationsPage.datePicker.click();
        await viewLocationsPage.selectAvailableDate();
        await viewLocationsPage.selectAvailableTime();
        await playwrightUtils.forceClick(viewLocationsPage.okButton);
        await expect(page).toHaveURL(/.*\/quoting\/.*/);
        await expect(page.locator('h1').filter({ hasText: 'Your Quote' })).toBeVisible();
    })

    test("Validate date restrictions", async ({ viewLocationsPage }) => {
        await viewLocationsPage.datePicker.click();
        await viewLocationsPage.validateDateRestrictions();
    });

    test("Validate date restriction one year", async ({ viewLocationsPage }) => {
        await viewLocationsPage.datePicker.click();
        await viewLocationsPage.validateOneYearRange();
    });

    test("Select available date and validate input value", async ({ viewLocationsPage }) => {
        await viewLocationsPage.datePicker.click();
        await viewLocationsPage.selectAvailableDate();
    });


    test("Validate Group Party Size default 27", async ({ viewLocationsPage }) => {
        await expect(viewLocationsPage.partySizeInput).toHaveValue('27');
    });

    test("Validate partySizeErrorMessage minus 27", async ({ viewLocationsPage, page }) => {
        await viewLocationsPage.minusPartySizeButton.click();
        await expect(viewLocationsPage.partySizeInput).toHaveValue('26');
        await expect(viewLocationsPage.partySizeErrorMessage).toBeVisible();
    });

    test.skip("Validate Group Party Size top 113", async ({ viewLocationsPage }) => {

        const dismissAlert = async () => {
            await expect(viewLocationsPage.reservationUnavailableMessage).toBeVisible();
            await viewLocationsPage.reservationUnavailableOkButton.click();
            await expect(viewLocationsPage.reservationUnavailableMessage).toBeHidden();
            await expect(viewLocationsPage.partySizeInput).toHaveValue('112');
        };
        await viewLocationsPage.datePicker.click();
        await viewLocationsPage.selectAvailableDate();
        await viewLocationsPage.selectAvailableTime();
        await viewLocationsPage.partySizeInput.fill('113');
        await dismissAlert();
        await viewLocationsPage.plusPartySizeButton.click();
        await dismissAlert();
    });

    test("Validate Cancel button redirect to login page", async ({ viewLocationsPage }) => {

        await viewLocationsPage.cancelButton.click();
        await expect(viewLocationsPage.page).toHaveURL(/.*login/);
    });
});


