const inquirer = require('inquirer');
const axios = require('axios');
const baseURL = 'http://localhost:3000';

let token = null;
let usuario = null;

function getAuth() {
  return { headers: { Authorization: `Bearer ${token}` } };
}

async function pausa() {
  await inquirer.prompt([{ name: 'pausa', message: '\nPresiona Enter para continuar...' }]);
  await menuPrincipal();
}

async function menuPrincipal() {
  console.clear();
  console.log('=== SISTEMA GANADERO ===\n');

  const opciones = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: 'Selecciona una opción:',
      choices: [
        '1. Registrar usuario',
        '2. Iniciar sesión',
        '3. Registrar ganado',
        '4. Ver ganado del usuario',
        '5. Registrar producción',
        '6. Ver registros de producción',
        '7. Editar producción',
        '8. Eliminar producción',
        '9. Ver reportes por periodo',
        '0. Salir'
      ]
    }
  ]);

  const eleccion = opciones.opcion.split('.')[0];

  switch (eleccion) {
    case '1': return registrarUsuario();
    case '2': return iniciarSesion();
    case '3': return registrarGanado();
    case '4': return verGanado();
    case '5': return registrarProduccion();
    case '6': return verProduccion();
    case '7': return editarProduccion();
    case '8': return eliminarProduccion();
    case '9': return verReporte();
    case '0':
      console.log('Saliendo del sistema...');
      process.exit();
  }
}

async function registrarUsuario() {
  const { nombre, cedula, password } = await inquirer.prompt([
    { name: 'nombre', message: 'Nombre completo:' },
    { name: 'cedula', message: 'Cédula:' },
    { name: 'password', message: 'Contraseña:', type: 'password' }
  ]);

  try {
    const res = await axios.post(`${baseURL}/auth/register`, { nombre, cedula, password });
    console.log('✅ Usuario registrado:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data?.mensaje || err.message);
  }
  await pausa();
}

async function iniciarSesion() {
  const { cedula, password } = await inquirer.prompt([
    { name: 'cedula', message: 'Cédula:' },
    { name: 'password', message: 'Contraseña:', type: 'password' }
  ]);

  try {
    const res = await axios.post(`${baseURL}/auth/login`, { cedula, password });
    token = res.data.token;
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    usuario = payload;
    //console.log('🔑 Token recibido:', token);
    //console.log('📦 Payload decodificado:', usuario);

    console.log(`✅ Bienvenido, ${usuario.nombre}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err.response?.data?.mensaje || err.message);
  }
  await pausa();
}
async function registrarGanado() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para registrar ganado.');
    return await pausa();
  }

  const respuestas = await inquirer.prompt([
    { name: 'raza', message: 'Raza:' },
    { name: 'genero', message: 'Género (macho/hembra):' },
    { name: 'peso', message: 'Peso en kg:', validate: input => !isNaN(input) },
    { name: 'estadoSalud', message: 'Estado de salud:' },
    { name: 'fechaNacimiento', message: 'Fecha de nacimiento (YYYY-MM-DD):' },
    { name: 'categoria', message: 'Categoría (cría, engorde, etc.):' }
  ]);

  try {
    const res = await axios.post(`${baseURL}/ganado/registrar`, respuestas, getAuth());
    console.log('✅ Ganado registrado:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('❌ Error al registrar ganado:');
      console.error('Código:', err.response.status);
      console.error('Mensaje del backend:', err.response.data);
    } else {
      console.error('❌ Error al registrar ganado:', err.message);
    }
  }

  await pausa();
}



async function verGanado() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para ver tu ganado.');
    return await pausa();
  }

  try {
    const res = await axios.get(`${baseURL}/ganado`, getAuth());
    console.log('\n📋 Ganado registrado:');
    res.data.forEach((animal, i) => {
      console.log(`\n#${i + 1}`);
      console.log(`Raza: ${animal.raza}`);
      console.log(`Género: ${animal.genero}`);
      console.log(`Peso: ${animal.peso} kg`);
      console.log(`Categoría: ${animal.categoria}`);
      console.log(`Estado de salud: ${animal.estadoSalud}`);
      console.log(`Fecha de nacimiento: ${animal.fechaNacimiento}`);
    });
  } catch (err) {
    console.error('❌ Error al obtener el ganado:', err.response?.data?.mensaje || err.message);
  }
  await pausa();
}

async function registrarProduccion() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para registrar producción.');
    return await pausa();
  }

  try {
    const ganado = await axios.get(`${baseURL}/ganado`, getAuth());
    if (!ganado.data.length) {
      console.log('⚠️ No tienes animales registrados.');
      return await pausa();
    }

    const opcionesGanado = ganado.data.map(g => ({ name: `${g.raza} - ${g.categoria}`, value: g.id }));

    const respuestas = await inquirer.prompt([
      { type: 'list', name: 'ganado_id', message: 'Selecciona el animal:', choices: opcionesGanado },
      { type: 'list', name: 'tipoProduccion', message: 'Tipo de producción:', choices: ['leche', 'carne'] },
      { name: 'cantidad', message: 'Cantidad (litros o kg):', validate: input => !isNaN(input) },
      { name: 'fechaRegistro', message: 'Fecha del registro (YYYY-MM-DD):' }
    ]);

    const res = await axios.post(`${baseURL}/produccion`, respuestas, getAuth());
    console.log('✅ Producción registrada:', res.data);
  } catch (err) {
    console.error('❌ Error al registrar producción:', err.response?.data?.mensaje || err.message);
  }

  await pausa();
}

async function verProduccion() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para ver la producción.');
    return await pausa();
  }

  try {
    const { tipoProduccion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'tipoProduccion',
        message: '¿Qué tipo de producción deseas ver?',
        choices: ['Todas', 'leche', 'carne']
      }
    ]);

    const query = tipoProduccion === 'Todas' ? '' : `?tipoProduccion=${tipoProduccion}`;
    const res = await axios.get(`${baseURL}/produccion${query}`, getAuth());

    if (!res.data.length) {
      console.log('⚠️ No hay registros de producción.');
    } else {
      console.log('\n📊 Registros de producción:');
      res.data.forEach((p, i) => {
        console.log(`\n#${i + 1}`);
        console.log(`ID: ${p.id}`);
        console.log(`Animal ID: ${p.ganado_id}`);
        console.log(`Tipo: ${p.tipoProduccion}`);
        console.log(`Cantidad: ${p.cantidad}`);
        console.log(`Fecha: ${p.fechaRegistro}`);
      });
    }
  }  catch (err) {
    console.error('❌ Error completo al registrar producción:\n', err);
    console.error('❌ Error al obtener la producción:', err.message);

  }
  

  await pausa();
}

async function editarProduccion() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para editar producción.');
    return await pausa();
  }

  try {
    const { id, cantidad, fechaRegistro } = await inquirer.prompt([
      { name: 'id', message: 'ID de la producción a editar:' },
      { name: 'cantidad', message: 'Nueva cantidad (litros o kg):', validate: input => !isNaN(input) },
      { name: 'fechaRegistro', message: 'Nueva fecha (YYYY-MM-DD):' }
    ]);

    const res = await axios.put(`${baseURL}/produccion/${id}`, { cantidad, fechaRegistro }, getAuth());
    console.log('✅ Producción actualizada:', res.data);
  } catch (err) {
    console.error('❌ Error al editar producción:', err.response?.data?.mensaje || err.message);
  }

  await pausa();
}

async function eliminarProduccion() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para eliminar producción.');
    return await pausa();
  }

  try {
    const { id } = await inquirer.prompt([
      { name: 'id', message: 'ID de la producción a eliminar:' }
    ]);

    const confirmacion = await inquirer.prompt([
      { type: 'confirm', name: 'confirmar', message: `¿Estás seguro de eliminar el registro con ID ${id}?` }
    ]);

    if (!confirmacion.confirmar) {
      console.log('❌ Cancelado por el usuario.');
      return await pausa();
    }

    const res = await axios.delete(`${baseURL}/produccion/${id}`, getAuth());
    console.log('✅ Producción eliminada:', res.data);
  } catch (err) {
    console.error('❌ Error al eliminar producción:', err.response?.data?.mensaje || err.message);
  }

  await pausa();
}

async function verReporte() {
  if (!token) {
    console.log('❌ Debes iniciar sesión para ver reportes.');
    return await pausa();
  }

  try {
    const { periodo } = await inquirer.prompt([
      {
        type: 'list',
        name: 'periodo',
        message: 'Selecciona el periodo del reporte:',
        choices: ['diario', 'semanal', 'mensual']
      }
    ]);

    const res = await axios.get(`${baseURL}/produccion/reporte?periodo=${periodo}`, getAuth());

    if (!res.data.length) {
      console.log('⚠️ No hay datos de producción para el periodo seleccionado.');
    } else {
      console.log(`\n📈 Reporte de producción (${periodo}):`);
      res.data.forEach((r, i) => {
        const a = r.animal;
        console.log(`\n#${i + 1}`);
        console.log(`Animal ID: ${a?.id}`);
        console.log(`Raza: ${a?.raza} | Categoría: ${a?.categoria}`);
        console.log(`Tipo: ${r.tipo}`);
        console.log(`Total producido: ${r.total}`);
      });
    }
  } catch (err) {
    console.error('❌ Error al obtener reporte:', err.response?.data?.mensaje || err.message);
  }

  await pausa();
}

// 🟢 Inicia el programa
menuPrincipal();
