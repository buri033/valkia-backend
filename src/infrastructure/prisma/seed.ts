import { prisma } from './prisma.client';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando carga de datos reales (seed) para Valkia Coffee...');

  // Limpiar datos existentes en orden de dependencias
  await prisma.interaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear usuarios de prueba con contraseñas encriptadas con bcrypt
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin123*', salt);
  const userPasswordHash = await bcrypt.hash('Cliente123*', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Valkia',
      email: 'admin@valkia.com',
      password: adminPasswordHash,
      role: 'admin'
    }
  });

  const normalUser = await prisma.user.create({
    data: {
      name: 'Tomás Buriticá',
      email: 'cliente@valkia.com',
      password: userPasswordHash,
      role: 'user'
    }
  });

  console.log('✔ Usuarios creados:');
  console.log('  - Admin: admin@valkia.com (clave: Admin123*)');
  console.log('  - User: cliente@valkia.com (clave: Cliente123*)');

  // 2. Crear catálogo real de Valkia Coffee (de la Entrega 1)
  const productosData = [
    {
      name: 'Caturra Huila',
      category: 'cafes',
      origin: 'Huila, Colombia · 1.800 msnm',
      notes: ['Chocolate', 'Caramelo', 'Frutos rojos'],
      process: 'Lavado',
      intensity: 3,
      price: 38000,
      priceFmt: '$38.000',
      accent: '#6B4A35',
      image: '/assets/images/products/bolsa-caturra.png',
      badge: 'Edición de Autor',
      description: 'Perfil clásico colombiano de tueste medio. Taza redonda con dulzor acaramelado y final prolongado a cacao fino.'
    },
    {
      name: 'Geisha Nariño',
      category: 'cafes',
      origin: 'Nariño, Colombia · 1.950 msnm',
      notes: ['Jazmín', 'Citrus', 'Miel de Azahar'],
      process: 'Honey Anaeróbico',
      intensity: 2,
      price: 48000,
      priceFmt: '$48.000',
      accent: '#68705A',
      image: '/assets/images/products/bolsa-wush-wush.png',
      badge: 'Lote Exclusivo',
      description: 'Gran expresividad floral y elegancia. Notas brillantes a jazmín silvestre y acidez sedosa a lima madura.'
    },
    {
      name: 'SL28 Sierra Nevada',
      category: 'cafes',
      origin: 'Santa Marta, Colombia · 1.700 msnm',
      notes: ['Mandarina', 'Té Verde', 'Cuerpo Cremoso'],
      process: 'Lavado Especial',
      intensity: 2,
      price: 45000,
      priceFmt: '$45.000',
      accent: '#B79A73',
      image: '/assets/images/products/bolsa-sl28.png',
      badge: 'Selección Sommelier',
      description: 'Varietal keniana adaptada al microclima de la Sierra Nevada. Carácter cítrico refinado y final herbal fresco.'
    },
    {
      name: 'Borbón Rosado Quindío',
      category: 'cafes',
      origin: 'Genoa, Quindío · 1.850 msnm',
      notes: ['Frutos Rojos', 'Cerezo', 'Vino Especiado'],
      process: 'Natural 72h',
      intensity: 4,
      price: 42000,
      priceFmt: '$42.000',
      accent: '#A9694F',
      image: '/assets/images/products/bolsa-borbon.png',
      badge: 'Favorito del Tostador',
      description: 'Fermentación natural prolongada. Notas complejas a frutos silvestres maduros y cuerpo licoroso inolvidable.'
    },
    {
      name: 'Cafetera Dripper V60 Cristal',
      category: 'accesorios',
      origin: 'Vidrio borosilicato resistente al calor',
      notes: ['Extracción limpia', 'Capacidad 1-4 tazas'],
      process: 'Método de Goteo',
      intensity: 0,
      price: 85000,
      priceFmt: '$85.000',
      accent: '#382A21',
      image: '/assets/images/products/dripper-v60.png',
      badge: 'Accesorios',
      description: 'Cafetera de goteo manual en cristal térmico de alta durabilidad para tazas limpias y aromáticas.'
    },
    {
      name: 'Molino Manual Cono Cerámico',
      category: 'accesorios',
      origin: 'Ajuste micrométrico de molienda',
      notes: ['Molienda uniforme', 'Compacto y portátil'],
      process: 'Molienda de Precisión',
      intensity: 0,
      price: 120000,
      priceFmt: '$120.000',
      accent: '#4A382C',
      image: '/assets/images/gallery/tostadora-cafe.webp',
      badge: 'Accesorios',
      description: 'Molino portátil con muelas cónicas de cerámica para conservar el aroma sin calentar el grano.'
    },
    {
      name: 'Prensa Francesa Émbolo Cristal',
      category: 'accesorios',
      origin: 'Vidrio termorresistente y acero 304',
      notes: ['Cuerpo denso y sedoso', 'Capacidad 600ml'],
      process: 'Inmersión Directa',
      intensity: 0,
      price: 95000,
      priceFmt: '$95.000',
      accent: '#68705A',
      image: '/assets/images/products/prensa-francesa.png',
      badge: 'Accesorios',
      description: 'Prensa francesa clásica con filtro de malla de acero inoxidable para extracciones con cuerpo pronunciado.'
    },
    {
      name: 'Valkia Club — Caja Exploradora',
      category: 'suscripciones',
      origin: '2 bolsas seleccionadas de origen mensual',
      notes: ['Lotes rotativos', 'Envío gratis a todo el país'],
      process: 'Suscripción Mensual',
      intensity: 0,
      price: 75000,
      priceFmt: '$75.000 / mes',
      accent: '#241A14',
      image: '/assets/images/gallery/granos-cafe.jpg',
      badge: 'Suscripción',
      description: 'Suscripción mensual a dos microlotes exclusivos de caficultores colombianos directamente en tu puerta.'
    }
  ];

  const createdProducts = [];
  for (const prod of productosData) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);
  }
  console.log(`✔ Catálogo cargado: ${createdProducts.length} productos reales creados.`);

  // 3. Crear interacción inicial de prueba (Sommelier recomendación ligada a usuario y producto)
  const geisha = createdProducts.find(p => p.name === 'Geisha Nariño') || createdProducts[0];
  await prisma.interaction.create({
    data: {
      userId: normalUser.id,
      productId: geisha.id,
      preference: 'Floral (Cítrico y Frutal)',
      notes: 'Solicitud Sommelier Virtual: Busco un café con notas brillantes y florales para preparar en V60.'
    }
  });

  console.log('✔ Interacción de prueba creada (Sommelier para usuario normal).');
  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
