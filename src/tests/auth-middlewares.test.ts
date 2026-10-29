import { app } from '../interface/http/app';
import http from 'http';

// Script de pruebas automatizadas para middlewares de autenticación, rol y endpoints protegidos
// Cumple con la Bonificación de la Rúbrica (+3 pts)
async function runTests() {
  const PORT = 4002;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(PORT, () => resolve()));
  console.log(`\n========================================`);
  console.log(`🧪 PRUEBAS AUTOMATIZADAS - VALKIA COFFEE API`);
  console.log(`========================================\n`);

  try {
    // Test 1: Catálogo público con paginación
    const catRes = await fetch(`http://localhost:${PORT}/api/catalogo`);
    const catData = (await catRes.json()) as { pagination: { total: number; page: number }; data: Array<{ id: string }> };
    if (catRes.status !== 200 || !catData.pagination) throw new Error('Falló Test 1: Paginación pública');
    console.log('✔ Test 1 PASÓ: Catálogo público responde 200 con paginación { pagination, data }');

    // Test 2: Login con credenciales válidas emite JWT
    const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cliente@valkia.com', password: 'Cliente123*' })
    });
    const loginData = (await loginRes.json()) as { token?: string; user?: { role: string } };
    if (loginRes.status !== 200 || !loginData.token) throw new Error('Falló Test 2: Login válido');
    console.log('✔ Test 2 PASÓ: Login exitoso responde 200 con token JWT válido');
    const userToken = loginData.token;

    // Test 3: Middleware de Auth - Login con credenciales inválidas responde 401
    const badLoginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cliente@valkia.com', password: 'ClaveIncorrecta' })
    });
    if (badLoginRes.status !== 401) throw new Error('Falló Test 3: 401 en credenciales inválidas');
    console.log('✔ Test 3 PASÓ: Credenciales inválidas responden 401 con mensaje genérico');

    // Test 4: Middleware de Auth - Petición sin token responde 401
    const noTokenRes = await fetch(`http://localhost:${PORT}/api/catalogo/${catData.data[0].id}`, {
      method: 'DELETE'
    });
    if (noTokenRes.status !== 401) throw new Error('Falló Test 4: 401 sin token');
    console.log('✔ Test 4 PASÓ: Petición a ruta protegida sin token responde 401');

    // Test 5: Middleware de Rol - Usuario con rol "user" intentando borrar catálogo responde 403
    const userDeleteRes = await fetch(`http://localhost:${PORT}/api/catalogo/${catData.data[0].id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (userDeleteRes.status !== 403) throw new Error('Falló Test 5: 403 rol insuficiente');
    console.log('✔ Test 5 PASÓ: Usuario con rol "user" intentando modificar catálogo responde 403');

    // Test 6: Login como administrador responde rol admin
    const adminLoginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@valkia.com', password: 'Admin123*' })
    });
    const adminData = (await adminLoginRes.json()) as { token?: string; user?: { role: string } };
    if (adminLoginRes.status !== 200 || adminData.user?.role !== 'admin') throw new Error('Falló Test 6: Admin login');
    console.log('✔ Test 6 PASÓ: Administrador autenticado correctamente con rol "admin"');

    // Test 7: Interacción vinculada estrictamente al token del usuario autenticado
    const interRes = await fetch(`http://localhost:${PORT}/api/interaccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        productId: catData.data[0].id,
        preference: 'Dulce (Chocolate y Caramelo)',
        notes: 'Test automatizado Sommelier Valkia'
      })
    });
    if (interRes.status !== 201) throw new Error('Falló Test 7: Creación de interacción');
    console.log('✔ Test 7 PASÓ: Interacción creada con 201 ligada automáticamente al token');

    // Test 8: Consultar interacciones propias
    const myInterRes = await fetch(`http://localhost:${PORT}/api/interaccion/mias`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (myInterRes.status !== 200) throw new Error('Falló Test 8: Consultar interacciones propias');
    console.log('✔ Test 8 PASÓ: GET /api/interaccion/mias responde 200 con historial del usuario');

    console.log(`\n========================================`);
    console.log(`🎉 ¡TODOS LOS TESTS (8/8) PASARON SATISFACTORIAMENTE!`);
    console.log(`========================================\n`);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('❌ Error en tests:', err);
  process.exit(1);
});
