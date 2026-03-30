import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyProfilePage extends BasePage {
    public readonly makeReservationButton: Locator;
    public readonly viewCardInfoButton: Locator;

    constructor(page: Page) {
        super(page);
        this.makeReservationButton = page.getByText('MAKE NEW RESERVATION', { exact: true });
        this.viewCardInfoButton = page.getByText('VIEW CARD INFORMATION', { exact: true });
        // Nota: myProfileButton y logoutButton ahora están en this.header
    }
}
