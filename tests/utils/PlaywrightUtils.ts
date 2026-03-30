import { Locator, Page, expect } from '@playwright/test';

export class PlaywrightUtils {
    constructor(private page: Page) { }

    // ─── Visibility ───────────────────────────────────────────────

    async isVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async assertVisible(locator: Locator, message?: string) {
        await expect(locator, message).toBeVisible();
    }

    async assertHidden(locator: Locator, message?: string) {
        await expect(locator, message).toBeHidden();
    }

    // ─── Click helpers ────────────────────────────────────────────

    async safeClick(locator: Locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async clickIfVisible(locator: Locator, timeout = 3000): Promise<boolean> {
        const visible = await this.isVisible(locator, timeout);
        if (visible) {
            await locator.click();
            return true;
        }
        return false;
    }

    async clickWithRetry(locator: Locator, retries = 3, delay = 500) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.safeClick(locator);
                return;
            } catch (err) {
                if (attempt === retries) throw err;
                await this.page.waitForTimeout(delay);
            }
        }
    }

    async forceClick(locator: Locator) {
        // Útil cuando hay overlays que bloquean el click normal
        await locator.dispatchEvent('click');
    }

    // ─── Scroll + Click ───────────────────────────────────────────

    async scrollIntoViewAndClick(locator: Locator) {
        await locator.scrollIntoViewIfNeeded();
        await this.safeClick(locator);
    }

    // ─── Wait + Assert pattern ────────────────────────────────────

    async waitForVisibleAndClick(
        locator: Locator,
        options?: { timeout?: number; message?: string }
    ) {
        const timeout = options?.timeout ?? 10000;
        await expect(locator, options?.message).toBeVisible({ timeout });
        await locator.click();
    }
}