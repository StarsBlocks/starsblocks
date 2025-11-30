import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import * as fs from 'fs'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

// Datos de España - Comunidades, Provincias y Municipios
const UBICACIONES = [
  { community: 'Aragon', province: 'Huesca', councils: ['Huesca', 'Monzon', 'Barbastro', 'Jaca', 'Fraga'] },
  { community: 'Aragon', province: 'Zaragoza', councils: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros', 'Utebo', 'Tarazona'] },
  { community: 'Aragon', province: 'Teruel', councils: ['Teruel', 'Alcaniz', 'Andorra', 'Calamocha'] },
  { community: 'Cataluna', province: 'Barcelona', councils: ['Barcelona', 'Hospitalet', 'Badalona', 'Terrassa', 'Sabadell'] },
  { community: 'Cataluna', province: 'Tarragona', councils: ['Tarragona', 'Reus', 'Tortosa', 'Salou'] },
  { community: 'Cataluna', province: 'Girona', councils: ['Girona', 'Figueres', 'Blanes', 'Lloret de Mar'] },
  { community: 'Comunidad de Madrid', province: 'Madrid', councils: ['Madrid', 'Alcala de Henares', 'Mostoles', 'Getafe', 'Leganes'] },
  { community: 'Andalucia', province: 'Sevilla', councils: ['Sevilla', 'Dos Hermanas', 'Alcala de Guadaira', 'Utrera'] },
  { community: 'Andalucia', province: 'Malaga', councils: ['Malaga', 'Marbella', 'Velez-Malaga', 'Mijas', 'Fuengirola'] },
  { community: 'Andalucia', province: 'Granada', councils: ['Granada', 'Motril', 'Almunecar', 'Baza'] },
  { community: 'Comunidad Valenciana', province: 'Valencia', councils: ['Valencia', 'Gandia', 'Torrent', 'Paterna', 'Sagunto'] },
  { community: 'Comunidad Valenciana', province: 'Alicante', councils: ['Alicante', 'Elche', 'Torrevieja', 'Orihuela', 'Benidorm'] },
  { community: 'Pais Vasco', province: 'Vizcaya', councils: ['Bilbao', 'Barakaldo', 'Getxo', 'Portugalete'] },
  { community: 'Pais Vasco', province: 'Guipuzcoa', councils: ['San Sebastian', 'Irun', 'Renteria', 'Eibar'] },
  { community: 'Galicia', province: 'A Coruna', councils: ['A Coruna', 'Santiago de Compostela', 'Ferrol', 'Naron'] },
  { community: 'Galicia', province: 'Pontevedra', councils: ['Vigo', 'Pontevedra', 'Vilagarcia de Arousa'] },
  { community: 'Castilla y Leon', province: 'Valladolid', councils: ['Valladolid', 'Medina del Campo', 'Laguna de Duero'] },
  { community: 'Castilla y Leon', province: 'Burgos', councils: ['Burgos', 'Miranda de Ebro', 'Aranda de Duero'] },
  { community: 'Region de Murcia', province: 'Murcia', councils: ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura'] },
  { community: 'Islas Baleares', province: 'Baleares', councils: ['Palma', 'Calvia', 'Ibiza', 'Manacor', 'Mahon'] },
]

// Nombres españoles SIN ACENTOS para emails
const NOMBRES = ['Maria', 'Carmen', 'Ana', 'Laura', 'Isabel', 'Lucia', 'Elena', 'Marta', 'Sara', 'Paula',
  'Antonio', 'Jose', 'Manuel', 'Francisco', 'David', 'Juan', 'Carlos', 'Miguel', 'Pedro', 'Javier']

// Apellidos SIN ACENTOS para emails
const APELLIDOS = ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Hernandez', 'Perez', 'Sanchez',
  'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Ruiz', 'Alvarez']

// Empresas de recolección
const EMPRESAS = ['EcoRecicla S.L.', 'VerdeClean S.A.', 'Reciclajes del Norte', 'GreenWaste Iberica',
  'Recogida Urbana S.L.', 'EcoServicios Municipales', 'Limpieza Integral S.A.', 'ReciclaPlus']

// Genera wallet simulada
function generateWallet(): string {
  const chars = '0123456789abcdef'
  let wallet = '02'
  for (let i = 0; i < 64; i++) wallet += chars[Math.floor(Math.random() * chars.length)]
  return wallet
}

// Encriptar privateKey (igual que en el registro real)
function encryptPrivateKey(privateKey: string, password: string): string {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(password, 'salt', 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(privateKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

// Genera DNI español válido
function generateDNI(): string {
  const num = Math.floor(Math.random() * 99999999).toString().padStart(8, '0')
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'
  return num + letras[parseInt(num) % 23]
}

// Genera fecha aleatoria en los últimos N días
function randomDate(daysBack: number): Date {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
}

// Genera hash de transacción simulado
function generateTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = ''
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]
  return hash
}

// Genera código postal basado en provincia
function generateCodigoPostal(province: string): string {
  const prefijos: Record<string, string> = {
    'Huesca': '22', 'Zaragoza': '50', 'Teruel': '44',
    'Barcelona': '08', 'Tarragona': '43', 'Girona': '17',
    'Madrid': '28', 'Sevilla': '41', 'Malaga': '29', 'Granada': '18',
    'Valencia': '46', 'Alicante': '03', 'Vizcaya': '48', 'Guipuzcoa': '20',
    'A Coruna': '15', 'Pontevedra': '36', 'Valladolid': '47', 'Burgos': '09',
    'Murcia': '30', 'Baleares': '07'
  }
  const prefijo = prefijos[province] || '28'
  return prefijo + Math.floor(Math.random() * 999).toString().padStart(3, '0')
}

async function resetAndSeed() {
  const client = new MongoClient(MONGODB_URI)
  const passwords: { type: string; email: string; password: string }[] = []

  try {
    await client.connect()
    console.log('Conectado a MongoDB\n')

    const db = client.db('starsblocks')

    // ============ BORRAR DATOS EXISTENTES ============
    console.log('=== BORRANDO DATOS EXISTENTES ===')
    const deleteUsers = await db.collection('users').deleteMany({})
    console.log(`Usuarios borrados: ${deleteUsers.deletedCount}`)

    const deleteCollectors = await db.collection('collectors').deleteMany({})
    console.log(`Collectors borrados: ${deleteCollectors.deletedCount}`)

    const deleteTransactions = await db.collection('transactions').deleteMany({})
    console.log(`Transacciones borradas: ${deleteTransactions.deletedCount}`)

    // Obtener productos
    const products = await db.collection('productTypes').find({}).toArray()
    if (products.length === 0) {
      console.error('No hay productos. Ejecuta cleanup-products.ts primero.')
      return
    }
    console.log('\nProductos:', products.map(p => p.name).join(', '))

    // ============ COLLECTORS ============
    console.log('\n=== CREANDO COLLECTORS ===')
    const collectors: any[] = []
    const collectorData = [
      { name: 'Juan Recolector', email: 'juan@recolector.com', zone: 'Norte' },
      { name: 'Maria Recogida', email: 'maria@recolector.com', zone: 'Sur' },
      { name: 'Carlos Verde', email: 'carlos@recolector.com', zone: 'Este' },
      { name: 'Ana Limpia', email: 'ana@recolector.com', zone: 'Oeste' },
      { name: 'Pedro Eco', email: 'pedro@recolector.com', zone: 'Centro' },
      { name: 'Laura Recicla', email: 'laura@recolector.com', zone: 'Norte' },
      { name: 'Miguel Ambiente', email: 'miguel@recolector.com', zone: 'Sur' },
      { name: 'Elena Sostenible', email: 'elena@recolector.com', zone: 'Este' },
      { name: 'David Green', email: 'david@recolector.com', zone: 'Oeste' },
      { name: 'Sara Ecologica', email: 'sara@recolector.com', zone: 'Centro' },
    ]

    for (let i = 0; i < collectorData.length; i++) {
      const data = collectorData[i]
      const ubicacion = UBICACIONES[i % UBICACIONES.length]
      const council = ubicacion.councils[Math.floor(Math.random() * ubicacion.councils.length)]
      const plainPassword = `collector${i + 1}pass`
      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      passwords.push({ type: 'collector', email: data.email, password: plainPassword })

      collectors.push({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        dni: generateDNI(),
        role: 'collector',
        company: EMPRESAS[Math.floor(Math.random() * EMPRESAS.length)],
        zone: data.zone,
        vehicle: `${Math.floor(Math.random() * 9999)}${['ABC', 'DEF', 'GHI', 'JKL'][Math.floor(Math.random() * 4)]}`,
        license: Math.floor(Math.random() * 999999).toString(),
        community: ubicacion.community,
        province: ubicacion.province,
        council: council,
        createdAt: randomDate(180),
      })
    }

    const collectorResult = await db.collection('collectors').insertMany(collectors)
    console.log(`Insertados ${collectorResult.insertedCount} collectors`)
    const collectorIds = Object.values(collectorResult.insertedIds)

    // ============ USUARIOS ============
    console.log('\n=== CREANDO USUARIOS ===')
    const users: any[] = []

    for (let i = 0; i < 100; i++) {
      const nombre = NOMBRES[Math.floor(Math.random() * NOMBRES.length)]
      const apellido1 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)]
      const apellido2 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)]
      const fullName = `${nombre} ${apellido1} ${apellido2}`
      // EMAIL SIN ACENTOS - todo en minusculas y sin caracteres especiales
      const email = `${nombre.toLowerCase()}.${apellido1.toLowerCase()}${i}@gmail.com`
      const plainPassword = `user${i + 1}pass`
      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      const ubicacion = UBICACIONES[Math.floor(Math.random() * UBICACIONES.length)]
      const council = ubicacion.councils[Math.floor(Math.random() * ubicacion.councils.length)]

      // Simular wallet y privateKey encriptada
      const wallet = generateWallet()
      const fakePrivateKey = crypto.randomBytes(32).toString('hex')
      const encryptedPrivateKey = encryptPrivateKey(fakePrivateKey, plainPassword)

      passwords.push({ type: 'user', email, password: plainPassword })

      users.push({
        email,
        password: hashedPassword,
        name: fullName,
        dni: generateDNI(),
        role: 'user',
        wallet,
        encryptedPrivateKey,
        ayuntamiento: council,
        comunidad: ubicacion.community,
        codigoPostal: generateCodigoPostal(ubicacion.province),
        privacySettings: {
          shareStats: Math.random() > 0.3,
          shareHistory: Math.random() > 0.5,
          shareLocation: Math.random() > 0.4,
          allowRankings: Math.random() > 0.2,
          updatedAt: new Date().toISOString(),
        },
        createdAt: randomDate(180),
      })
    }

    const userResult = await db.collection('users').insertMany(users)
    console.log(`Insertados ${userResult.insertedCount} usuarios`)
    const userIds = Object.values(userResult.insertedIds)

    // ============ TRANSACCIONES ============
    console.log('\n=== CREANDO TRANSACCIONES ===')
    const transactions: any[] = []

    for (let i = 0; i < 500; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)]
      const collectorId = collectorIds[Math.floor(Math.random() * collectorIds.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      const amount = Math.round((Math.random() * 30 + 0.5) * 10) / 10 // 0.5 a 30.5 kg
      const pointsEarned = amount * product.pointsPerKg
      const createdAt = randomDate(90)

      transactions.push({
        userId: new ObjectId(userId),
        collectorId: new ObjectId(collectorId),
        productTypeId: new ObjectId(product._id),
        amount,
        pointsEarned,
        status: 'validated',
        txHash: generateTxHash(),
        createdAt,
        validatedAt: createdAt,
      })
    }

    const txResult = await db.collection('transactions').insertMany(transactions)
    console.log(`Insertadas ${txResult.insertedCount} transacciones`)

    // ============ GUARDAR PASSWORDS ============
    const passwordsFile = 'scripts/passwords.json'
    fs.writeFileSync(passwordsFile, JSON.stringify(passwords, null, 2))
    console.log(`\nPasswords guardados en: ${passwordsFile}`)

    // ============ RESUMEN ============
    console.log('\n=== RESUMEN ===')
    console.log(`Collectors: ${collectorResult.insertedCount}`)
    console.log(`Usuarios: ${userResult.insertedCount}`)
    console.log(`Transacciones: ${txResult.insertedCount}`)

    // Resumen por comunidad
    console.log('\n=== USUARIOS POR COMUNIDAD ===')
    const usersByCommunity = users.reduce((acc, u) => {
      acc[u.comunidad] = (acc[u.comunidad] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    Object.entries(usersByCommunity)
      .sort((a, b) => b[1] - a[1])
      .forEach(([com, count]) => console.log(`  ${com}: ${count}`))

    // Resumen por material
    console.log('\n=== KG POR MATERIAL ===')
    const kgByProduct = transactions.reduce((acc, t) => {
      const prod = products.find(p => p._id.toString() === t.productTypeId.toString())
      if (prod) acc[prod.name] = (acc[prod.name] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
    Object.entries(kgByProduct)
      .sort((a, b) => b[1] - a[1])
      .forEach(([mat, kg]) => console.log(`  ${mat}: ${(kg as number).toFixed(1)} kg`))

    console.log('\nSeed completado!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

resetAndSeed()
