import { test, expect } from '../../fixtures/fixtures';

test('My Profile Page - Should load My Profile page being logged in', async ({ page }) => {
    // Navegamos al perfil - storageState inyecta la sesión automáticamente
    await page.goto('/my-profile');

    // Si estamos logueados, la URL debe quedarse en my-profile (no redirigir al login)
    await expect(page).toHaveURL(/.*my-profile/);
    await expect(page.getByRole('heading', { name: 'My prokfile' })).toBeVisible();
}); 