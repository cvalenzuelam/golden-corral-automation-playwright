import { test, expect } from '@playwright/test';

/**
 * Playground de API Testing
 * Aquí aprenderás a usar el objeto 'request' para peticiones HTTP.
 */

test.describe('Curso Rápido de API Testing', () => {

    test('Paso 1: Petición GET básica (Leer datos)', async ({ request }) => {
        // Hacemos un GET a una API de ejemplo (JSONPlaceholder)
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

        // 1. Validar que la petición fue exitosa (Status 200-299)
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // 2. Convertir la respuesta a JSON para leer sus campos
        const body = await response.json();
        console.log('Cuerpo de la respuesta:', body);

        // 3. Validar datos específicos del JSON
        expect(body.id).toBe(1);
        expect(body.title).toBeDefined();
    });

    test('Paso 2: Petición POST (Crear datos)', async ({ request }) => {
        // Enviamos datos en el cuerpo (body) de la petición
        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: {
                title: 'Mi primer test de API',
                body: 'Contenido del post',
                userId: 1
            }
        });

        // Validar que se creó correctamente (Status 201)
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.title).toBe('Mi primer test de API');
        expect(body.id).toBeDefined(); // La API nos devuelve el ID generado
    });

    test('Paso 3: Validar cabeceras (Headers)', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
        
        // Validar que el servidor nos devuelve JSON
        expect(response.headers()['content-type']).toContain('application/json');
    });

});
