# 🎭 Playwright — Notas de Estudio para Entrevistas

---

## 1. 🚀 CLI — Comandos de Terminal

```bash
npm init playwright@latest                         # Instala navegadores (Chromium, Firefox, WebKit)
npx playwright install --with-deps            # Instala dependencias del SO (usar en Linux/CI)
npx playwright test                           # Ejecuta todos los tests
npx playwright test login.spec.ts             # Ejecuta un archivo específico
npx playwright test -g "login test"           # Ejecuta tests que coincidan con el nombre
npx playwright test --project=chromium        # Solo en un browser/proyecto
npx playwright test --headed                  # Abre el navegador (modo visual)
npx playwright test --debug                   # Abre el Inspector paso a paso
npx playwright test --ui                      # Abre la UI Mode interactiva
npx playwright codegen https://sitio.com      # Graba acciones y genera código automáticamente
npx playwright show-report                    # Abre el reporte HTML del último run
npx playwright show-trace trace.zip           # Abre el Trace Viewer
```

---

## 2. 🔍 Locators — Estrategias de Selección

> ⚡ **Regla de oro:** priorizar locators semánticos (accesibilidad) sobre CSS o XPath.

```typescript
// ✅ RECOMENDADOS (prioridad alta)
page.getByRole('button', { name: 'Login' })       // Por rol ARIA y texto visible
page.getByLabel('Password')                        // Por etiqueta <label>
page.getByPlaceholder('e.g. user@mail.com')        // Por placeholder del input
page.getByText('Welcome, Chris')                   // Por texto visible en la página
page.getByTestId('submit-btn')                     // Por data-testid (acuerdo con devs)
page.getByAltText('Company Logo')                  // Para imágenes <img alt="">
page.getByTitle('Close dialog')                    // Por atributo title

// ⚠️  ÚLTIMO RECURSO
page.locator('.css-class')                         // Por selector CSS
page.locator('//div[@id="main"]')                  // Por XPath
page.locator('[data-cy="menu"]')                   // Por atributo personalizado

// 🔗 ENCADENAR Y FILTRAR
page.locator('.cart').getByRole('button', { name: 'Remove' })  // dentro de contenedor
page.locator('li').filter({ hasText: 'Sauce Labs Backpack' })  // filtrar por texto
page.getByRole('listitem').nth(2)                  // seleccionar el 3er elemento (0-indexed)
page.getByRole('listitem').first()
page.getByRole('listitem').last()
```

---

## 3. ⚡ Acciones

```typescript
// --- NAVEGACIÓN ---
await page.goto('https://sitio.com')
await page.goto('/', { waitUntil: 'networkidle' }) // load | domcontentloaded | networkidle
await page.goBack()
await page.goForward()
await page.reload()

// --- INTERACCIÓN CON ELEMENTOS ---
await locator.click()                             // Click (espera que sea actionable)
await locator.dblclick()                          // Doble click
await locator.fill('texto')                       // Escribe (borra el campo primero)
await locator.clear()                             // Limpia el campo
await locator.press('Enter')                      // Presiona una tecla del teclado
await locator.check()                             // Marca checkbox/radio
await locator.uncheck()                           // Desmarca checkbox
await locator.selectOption('value')               // Seleccionar opción en <select>
await locator.selectOption({ label: 'Admin' })    // Por texto del option
await locator.hover()                             // Mouse over
await locator.scrollIntoViewIfNeeded()            // Scroll hasta el elemento

// --- DRAG & DROP ---
await page.dragAndDrop('#source', '#target')
await locator.dragTo(targetLocator)
```

---

## 4. ✅ Aserciones (Web-First — Auto-Waiting)

> 💡 Las aserciones `expect(locator)...` reintentan automáticamente hasta 5 segundos antes de fallar.

```typescript
// --- ELEMENTO ---
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeChecked()
await expect(locator).toHaveText('Texto exacto')
await expect(locator).toContainText('texto parcial')
await expect(locator).toHaveValue('valor del input')
await expect(locator).toHaveCount(5)              // lista con N elementos
await expect(locator).toHaveAttribute('type', 'password')
await expect(locator).toHaveClass('active')

// --- PÁGINA ---
await expect(page).toHaveURL('https://sitio.com/dashboard')
await expect(page).toHaveURL(/.*dashboard/)       // también acepta regex
await expect(page).toHaveTitle('Mi App')

// --- NEGACIONES ---
await expect(locator).not.toBeVisible()
await expect(locator).not.toHaveText('Error')
```

---

## 5. ⏳ Waits — Esperas Explícitas

```typescript
await expect(locator).toBeVisible({ timeout: 10_000 })  // Esperar un locator
await page.waitForURL('**/dashboard')                    // Esperar una URL
await page.waitForSelector('.spinner', { state: 'hidden' })  // Esperar que desaparezca
await page.waitForResponse('**/api/users')               // Esperar respuesta de red
await page.waitForLoadState('networkidle')               // Sin peticiones activas

// ❌ Evitar en producción (no recomendado)
await page.waitForTimeout(2000)
```

---

## 6. 🌐 API Testing

```typescript
import { test, expect } from '@playwright/test'

test('GET /api/products', async ({ request }) => {
  const response = await request.get('https://api.ejemplo.com/products')

  expect(response.status()).toBe(200)
  expect(response.ok()).toBeTruthy()

  const body = await response.json()
  expect(body).toHaveProperty('data')
})

test('POST /api/users', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Chris', email: 'chris@test.com' },
    headers: { 'Authorization': 'Bearer token123' }
  })
  expect(response.status()).toBe(201)
})
```

---

## 7. 🔗 Manejo de Red (Network Mocking)

```typescript
// MOCKEAR una respuesta
await page.route('**/api/products', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'Mock Product' }])
  })
})

// ABORTAR peticiones (ej. imágenes para acelerar tests)
await page.route('**/*.{png,jpg}', route => route.abort())

// ESPERAR una respuesta específica antes de continuar
const responsePromise = page.waitForResponse('**/api/login')
await page.getByRole('button', { name: 'Login' }).click()
const response = await responsePromise
```

---

## 8. 📸 Screenshots y Visual Testing

```typescript
await page.screenshot({ path: 'screenshot.png', fullPage: true })   // Página completa
await locator.screenshot({ path: 'element.png' })                    // Solo un elemento

// Comparación visual automática (falla si hay diferencias)
await expect(page).toHaveScreenshot('homepage.png')
await expect(locator).toHaveScreenshot('button.png')
```

---

## 9. 🏗️ Fixtures, Hooks y Control de Tests

```typescript
import { test, expect } from '@playwright/test'

// HOOKS
test.beforeAll(async () => { /* Setup una vez por suite */ })
test.afterAll(async () => { /* Teardown una vez por suite */ })
test.beforeEach(async ({ page }) => { await page.goto('/') })
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `failures/${testInfo.title}.png` })
  }
})

// ORGANIZACIÓN
test.describe('Login Suite', () => {
  test('valid credentials', async ({ page }) => { /* ... */ })
  test('invalid credentials', async ({ page }) => { /* ... */ })
})

// CONTROL
test.only('solo este test corre', async ({ page }) => { /* ... */ })
test.skip('omite este test', async ({ page }) => { /* ... */ })
test.fixme('falla conocida — pendiente fix', async ({ page }) => { /* ... */ })
```

---

## 10. 🛠️ playwright.config.ts — Configuración Clave

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,            // timeout por test (ms)
  retries: 2,                 // reintentos automáticos en CI
  workers: 4,                 // paralelismo
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://mi-app.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',  // activa el Trace Viewer en reintentos
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
})
```

---

## 11. 🏛️ Page Object Model (POM)

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.getByLabel('Username')
    this.passwordInput = page.getByLabel('Password')
    this.loginButton   = page.getByRole('button', { name: 'Login' })
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user)
    await this.passwordInput.fill(pass)
    await this.loginButton.click()
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test('login exitoso', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await page.goto('/login')
  await loginPage.login('standard_user', 'secret_sauce')
  await expect(page).toHaveURL('/inventory')
})
```

---

## 12. 🔐 Autenticación con storageState

```typescript
// auth.setup.ts — corre una vez antes de todos los tests
import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Username').fill('admin')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Login' }).click()
  await page.context().storageState({ path: 'auth.json' }) // guarda sesión
})

// En playwright.config.ts agregar:
// use: { storageState: 'auth.json' }
```

---

## 13. ☁️ CI/CD — GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 14. ❓ Preguntas Frecuentes en Entrevistas

| Pregunta | Respuesta |
| :--- | :--- |
| **¿Qué es Auto-waiting?** | Playwright espera a que los elementos sean *actionable* (visibles, habilitados, estables) antes de actuar. |
| **¿Qué son Web-First Assertions?** | Aserciones `expect()` que reintentan hasta cumplirse o agotar el timeout (evitan `waitForTimeout`). |
| **¿Locator vs ElementHandle?** | `Locator` es lazy (busca al ejecutar la acción) y es la API moderna. `ElementHandle` está deprecado. |
| **¿Cómo manejas flaky tests?** | Con `retries`, esperas basadas en `expect`, evitar `waitForTimeout`, y usar `waitForResponse` para red. |
| **¿Playwright vs Selenium?** | Playwright usa DevTools Protocol (más rápido y estable), tiene auto-wait nativo y herramientas integradas. |
| **¿Qué es el Trace Viewer?** | Herramienta post-ejecución con screenshots, DOM snapshots, logs de red y errores de cada paso del test. |
| **¿Cómo corres tests en paralelo?** | Con `fullyParallel: true` y ajustando `workers` en `playwright.config.ts`. |
| **¿Qué es storageState?** | Guarda y reutiliza cookies y localStorage para no re-loguearse en cada test (sesión compartida). |
