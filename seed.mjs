import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// More users
await sql`
  INSERT INTO users (id, name, email, phone, role, email_verified) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Roberto Díaz', 'roberto@test.cl', '+56 9 6111 1111', 'user', true),
  ('b0000000-0000-0000-0000-000000000002', 'Camila Fuentes', 'camila@test.cl', '+56 9 6222 2222', 'user', true),
  ('b0000000-0000-0000-0000-000000000003', 'Javier Morales', 'javier@test.cl', '+56 9 6333 3333', 'user', true),
  ('b0000000-0000-0000-0000-000000000004', 'Valentina Castro', 'valentina@test.cl', '+56 9 6444 4444', 'user', true),
  ('b0000000-0000-0000-0000-000000000005', 'Felipe Herrera', 'felipe@test.cl', '+56 9 6555 5555', 'user', true),
  ('b0000000-0000-0000-0000-000000000006', 'Sofía Reyes', 'sofia@test.cl', '+56 9 6666 6666', 'user', true),
  ('b0000000-0000-0000-0000-000000000007', 'Tomás Navarro', 'tomas@test.cl', '+56 9 6777 7777', 'user', true),
  ('b0000000-0000-0000-0000-000000000008', 'Catalina Pizarro', 'catalina@test.cl', '+56 9 6888 8888', 'user', true),
  ('b0000000-0000-0000-0000-000000000009', 'Andrés Tapia', 'andres@test.cl', '+56 9 6999 9999', 'user', true),
  ('b0000000-0000-0000-0000-000000000010', 'Francisca Vera', 'francisca@test.cl', '+56 9 7000 0000', 'user', true),
  ('b0000000-0000-0000-0000-000000000011', 'Nicolás Bravo', 'nicolas@test.cl', '+56 9 7111 1111', 'user', true),
  ('b0000000-0000-0000-0000-000000000012', 'Isidora Campos', 'isidora@test.cl', '+56 9 7222 2222', 'user', true),
  ('b0000000-0000-0000-0000-000000000013', 'Matías Olivares', 'matias@test.cl', '+56 9 7333 3333', 'user', true),
  ('b0000000-0000-0000-0000-000000000014', 'Antonia Guzmán', 'antonia@test.cl', '+56 9 7444 4444', 'user', true),
  ('b0000000-0000-0000-0000-000000000015', 'Sebastián Paredes', 'sebastian@test.cl', '+56 9 7555 5555', 'user', true)
  ON CONFLICT (email) DO NOTHING
`;

// MATCH GROUP A: Santiago Providencia -> Valparaiso (~1km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'transportista', 'Av. Providencia 2000, Providencia, Santiago', -33.4260, -70.6100, 'Av. Brasil 1500, Valparaíso', -33.0470, -71.6170, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000002', 'enviador', 'Av. Nueva Providencia 1800, Providencia, Santiago', -33.4250, -70.6130, 'Calle Condell 1200, Valparaíso', -33.0440, -71.6200, 'general', 6, 900, 'Muebles de oficina empacados', 'active')
`;

// MATCH GROUP B: Rancagua -> Talca (~1km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'transportista', 'Av. San Martín 400, Rancagua', -34.1680, -70.7350, 'Calle 1 Sur 800, Talca', -35.4260, -71.6550, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000004', 'enviador', 'Calle Millán 300, Rancagua', -34.1690, -70.7380, 'Av. 2 Sur 600, Talca', -35.4270, -71.6530, 'refrigerated', 4, 600, 'Frutas de exportación', 'active')
`;

// MATCH GROUP C: Concepcion -> Temuco (~2km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'transportista', 'Av. Los Carrera 800, Concepción', -36.8270, -73.0500, 'Av. Alemania 500, Temuco', -38.7350, -72.5900, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000006', 'enviador', 'Calle Barros Arana 600, Concepción', -36.8280, -73.0470, 'Calle Manuel Montt 700, Temuco', -38.7370, -72.5920, 'general', 8, 1200, 'Materiales de construcción', 'active')
`;

// MATCH GROUP D: Antofagasta -> Calama (~1.5km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000007', 'transportista', 'Av. Balmaceda 2500, Antofagasta', -23.6500, -70.3980, 'Calle Granaderos 1000, Calama', -22.4560, -68.9290, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000008', 'enviador', 'Calle Prat 800, Antofagasta', -23.6510, -70.3950, 'Av. Balmaceda 500, Calama', -22.4540, -68.9310, 'general', 3, 350, 'Repuestos industriales para minería', 'active')
`;

// MATCH GROUP E: Las Condes -> Rancagua (~5km spread, matches at 5-6km radius)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000009', 'transportista', 'Av. Apoquindo 5000, Las Condes, Santiago', -33.4180, -70.5800, 'Av. Cachapoal 100, Rancagua', -34.1650, -70.7300, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000010', 'enviador', 'Av. Vitacura 3000, Vitacura, Santiago', -33.3990, -70.5980, 'Calle Estado 200, Rancagua', -34.1720, -70.7410, 'general', 2, 250, 'Electrodomésticos', 'active')
`;

// MATCH GROUP F: Vina del Mar -> La Serena (~2km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000011', 'transportista', 'Av. San Martín 500, Viña del Mar', -33.0240, -71.5520, 'Av. del Mar 1000, La Serena', -29.9070, -71.2540, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000012', 'enviador', 'Calle Valparaíso 300, Viña del Mar', -33.0260, -71.5500, 'Calle Balmaceda 800, La Serena', -29.9090, -71.2520, 'refrigerated', 5, 700, 'Productos del mar congelados', 'active')
`;

// MATCH GROUP G: Puerto Montt -> Osorno (~4km spread)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000013', 'transportista', 'Av. Diego Portales 1000, Puerto Montt', -41.4690, -72.9400, 'Calle Mackenna 500, Osorno', -40.5730, -73.1350, NULL, NULL, NULL, NULL, 'active'),
  ('b0000000-0000-0000-0000-000000000014', 'enviador', 'Calle Benavente 400, Puerto Montt', -41.4720, -72.9350, 'Av. República 800, Osorno', -40.5680, -73.1400, 'general', 10, 2000, 'Salmón fresco en cajas térmicas', 'active')
`;

// NO MATCH: Arica -> Iquique (solo, no counterpart)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, status) VALUES
  ('b0000000-0000-0000-0000-000000000015', 'transportista', 'Calle 21 de Mayo 400, Arica', -18.4780, -70.3210, 'Calle Baquedano 600, Iquique', -20.2130, -70.1500, 'active')
`;

// NO MATCH: Punta Arenas -> Puerto Natales (solo, extreme south)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, status) VALUES
  ('b0000000-0000-0000-0000-000000000009', 'transportista', 'Av. Colón 800, Punta Arenas', -53.1540, -70.9110, 'Calle Blanco Encalada 200, Puerto Natales', -51.7300, -72.4870, 'active')
`;

// 3rd route in Santiago -> Valpo corridor (matches Group A at ~3km)
await sql`INSERT INTO routes (user_id, user_type, origin_address, origin_lat, origin_lng, destination_address, destination_lat, destination_lng, cargo_type, pallet_count, weight_kg, cargo_description, status) VALUES
  ('b0000000-0000-0000-0000-000000000013', 'enviador', 'Av. Irarrázaval 3000, Ñuñoa, Santiago', -33.4530, -70.6050, 'Av. Pedro Montt 2000, Valparaíso', -33.0490, -71.6130, 'general', 4, 500, 'Cajas de libros y documentos', 'active')
`;

console.log("Done! Added 15 users and 17 new routes across Chile.");
console.log("");
console.log("Match groups by radius:");
console.log("  2km:  A (Santiago→Valpo), B (Rancagua→Talca), C (Concepción→Temuco), D (Antofagasta→Calama), F (Viña→La Serena)");
console.log("  4km:  + G (Puerto Montt→Osorno), + A expanded (3rd route from Ñuñoa)");
console.log("  6km:  + E (Las Condes→Rancagua)");
console.log("  No match: Sebastián (Arica→Iquique), Andrés (Punta Arenas→Puerto Natales), Diego (Las Condes→Concepción)");
