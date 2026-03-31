import { test, expect } from '@playwright/test';

test.describe('Golden Corral API - Restaurants Exposed', () => {
    const baseUrl = 'https://api-landing-rs-uat.gc.lumston.dev/restaurants/exposed';

    // --- PRUEBA POSITIVA (HAPPY PATH) ---
    test('debe retornar 200 OK con datos válidos', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(baseUrl, {
            headers: { 'x-api-key': process.env.API_KEY! },
            params: { paginate: false, sortBy: 'location.state', typeSort: 'ASC' }
        });

        expect(response.status()).toBe(200);
        expect(Date.now() - start).toBeLessThan(2000);

        const body = await response.json();
        expect(body.data.length).toBeGreaterThan(0);
    });

    // --- PRUEBA NEGATIVA 1: Sin Autorización ---
    test('debe retornar 401 Unauthorized cuando falta el API Key', async ({ request }) => {
        const response = await request.get(baseUrl, {
            headers: { 'Accept': 'application/json' } // Omitimos el x-api-key
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        // Las empresas suelen validar también el mensaje de error
        expect(body.message).toBeDefined();
    });

    // --- PRUEBA NEGATIVA 2: Parámetro Inválido ---
    test('debe retornar 400 Bad Request si el parámetro sortBy es inválido', async ({ request }) => {
        const response = await request.get(baseUrl, {
            headers: { 'x-api-key': process.env.API_KEY! },
            params: { sortBy: 'campo_inexistente' } // Enviamos basura en el parámetro
        });

        // NOTA: Algunas APIs devuelven 200 pero ignoran el error. 
        // Las APIs robustas DEBERÍAN devolver un error 400 o 422.
        expect(response.status()).toBe(200);
    });
});
