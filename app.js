const EJERCICIOS_POR_NIVEL = 10;

const USUARIOS = ['Alicia', 'Lucía'];

let usuarioActual = 'Alicia';
let state = {
  tabActual: 'practicar',
  usuarios: {
    Alicia: { tiemposRespuesta: {}, statsDiarias: [], tiempoTotalPractica: 0 },
    Lucía: { tiemposRespuesta: {}, statsDiarias: [], tiempoTotalPractica: 0 }
  },
  cuestionario: {
    preguntas: [],
    indice: 0,
    aciertos: 0,
    tiempoInicio: 0,
    tablaSeleccionada: null
  },
  desafio: {
    activo: false,
    tiempoRestante: 60,
    puntuacion: 0,
    racha: 0,
    pregunta: null,
    intervalo: null
  }
};

function getUsuarioActual() {
  return state.usuarios[usuarioActual];
}

function init() {
  cargarEstado();
  configurarEventos();
  actualizarHeader();
  renderizar();
}

function cargarEstado() {
  const guardado = localStorage.getItem('tablas_estado');
  if (guardado) {
    const estadoGuardado = JSON.parse(guardado);
    if (estadoGuardado.usuarios) {
      Object.keys(estadoGuardado.usuarios).forEach(u => {
        if (state.usuarios[u]) {
          state.usuarios[u] = estadoGuardado.usuarios[u];
        }
      });
    }
    if (estadoGuardado.usuarioActual) {
      usuarioActual = estadoGuardado.usuarioActual;
    }
  }
}

function guardarEstado() {
  localStorage.setItem('tablas_estado', JSON.stringify({
    usuarios: state.usuarios,
    usuarioActual: usuarioActual
  }));
}

function configurarEventos() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab));
  });
}

function cambiarTab(tab) {
  if (state.desafio.activo) return;
  state.tabActual = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  renderizar();
}

function actualizarHeader() {
  const nombreEl = document.getElementById('nombreUsuario');
  if (nombreEl) nombreEl.textContent = usuarioActual;
}

function renderizar() {
  const main = document.getElementById('mainContent');
  switch(state.tabActual) {
    case 'practicar':
      main.innerHTML = renderizarPracticar();
      configurarEventosPracticar();
      break;
    case 'desafios':
      main.innerHTML = renderizarDesafios();
      configurarEventosDesafios();
      break;
    case 'progreso':
      main.innerHTML = renderizarProgreso();
      break;
  }
}

function mostrarSelectorUsuario() {
  const html = `
    <div class="modal-overlay" onclick="if(event.target === this) cerrarSelectorUsuario()">
      <div class="modal-usuario">
        <h3>Cambiar usuario</h3>
        <div class="modal-opciones">
          ${USUARIOS.map(u => `
            <button class="modal-opcion-btn ${u === usuarioActual ? 'active' : ''}" data-usuario="${u}">
              <i class="ph-fill ph-user"></i>
              <span>${u}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  
  document.querySelectorAll('.modal-opcion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      usuarioActual = btn.dataset.usuario;
      guardarEstado();
      actualizarHeader();
      cerrarSelectorUsuario();
    });
  });
}

function cerrarSelectorUsuario() {
  document.querySelector('.modal-overlay')?.remove();
}

window.mostrarSelectorUsuario = mostrarSelectorUsuario;
window.cerrarSelectorUsuario = cerrarSelectorUsuario;

function renderizarPracticar() {
  return `
    <div class="screen active" id="practicarScreen">
      <h2><i class="section-icon ph-pencil-simple"></i> Practicar</h2>
      <button class="practicar-mezcladas-btn" id="mezcladasBtn"><i class="ph-shuffle"></i> Mezclar Todas las Tablas</button>
      <p class="practicar-label">O selecciona una tabla específica:</p>
      <div class="practicar-tabla-grid">
        ${[1,2,3,4,5,6,7,8,9,10,11,12].map(t => 
          `<button class="practicar-tabla-btn ${state.cuestionario.tablaSeleccionada === t ? 'selected' : ''}" data-tabla="${t}">×${t}</button>`
        ).join('')}
      </div>
      <div id="quizContainer">
        <div class="empty-state">
          <i class="ph-pencil-simple" style="font-size: 48px;"></i>
        </div>
      </div>
    </div>
  `;
}

function configurarEventosPracticar() {
  const mezcladasBtn = document.getElementById('mezcladasBtn');
  if (mezcladasBtn) {
    mezcladasBtn.addEventListener('click', () => {
      state.cuestionario.tablaSeleccionada = 0;
      document.querySelectorAll('.practicar-tabla-btn').forEach(b => b.classList.remove('selected'));
      mezcladasBtn.classList.add('selected');
      iniciarPracticaMezcladas();
    });
  }
  
  document.querySelectorAll('.practicar-tabla-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabla = parseInt(btn.dataset.tabla);
      state.cuestionario.tablaSeleccionada = tabla;
      if (mezcladasBtn) mezcladasBtn.classList.remove('selected');
      document.querySelectorAll('.practicar-tabla-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      iniciarPractica(tabla);
    });
  });
  
}

function iniciarPractica(tabla) {
  state.cuestionario = {
    preguntas: generarPreguntas(tabla, EJERCICIOS_POR_NIVEL),
    indice: 0,
    aciertos: 0,
    tiempoInicio: Date.now(),
    tablaSeleccionada: tabla
  };
  renderizarQuizPracticar();
}

function iniciarPracticaMezcladas() {
  const preguntas = [];
  for (let i = 0; i < EJERCICIOS_POR_NIVEL; i++) {
    const tabla = Math.floor(Math.random() * 12) + 1;
    const num = Math.floor(Math.random() * 12) + 1;
    preguntas.push({ pregunta: `${tabla} × ${num}`, resultado: tabla * num, opciones: generarOpciones(tabla * num) });
  }
  state.cuestionario = { preguntas, indice: 0, aciertos: 0, tiempoInicio: Date.now(), tablaSeleccionada: 0 };
  renderizarQuizPracticar();
}

function generarPreguntas(tabla, cantidad) {
  const ops = [];
  for (let i = 1; i <= 12; i++) ops.push({ a: tabla, b: i, r: tabla * i });
  let usadas = {};
  const preguntas = [];
  for (let i = 0; i < cantidad; i++) {
    let op;
    do { op = ops[Math.floor(Math.random() * ops.length)]; } while (usadas[op.r] && Object.keys(usadas).length < 12);
    usadas[op.r] = true;
    preguntas.push({ pregunta: `${op.a} × ${op.b}`, resultado: op.r, opciones: generarOpciones(op.r) });
  }
  return preguntas;
}

function generarOpciones(correcta) {
  const ops = new Set([correcta]);
  while (ops.size < 4) {
    let n = Math.random() < 0.5 ? correcta + Math.floor(Math.random() * 10) + 1 : Math.max(1, correcta - Math.floor(Math.random() * 10) - 1);
    if (n > 0 && n <= 144 && !ops.has(n)) ops.add(n);
  }
  return Array.from(ops).sort(() => Math.random() - 0.5);
}

function renderizarQuizPracticar() {
  const c = document.getElementById('quizContainer');
  if (!c) return;
  const q = state.cuestionario;
  if (q.indice >= q.preguntas.length) {
    guardarResultadosPractica();
    c.innerHTML = renderizarResultados();
    return;
  }
  const p = q.preguntas[q.indice];
  const nombre = q.tablaSeleccionada === 0 ? 'Todas' : `Tabla del ${q.tablaSeleccionada}`;
  c.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header-info"><span>${nombre}</span><span>${q.indice + 1}/${q.preguntas.length}</span></div>
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width: ${(q.indice / q.preguntas.length) * 100}%"></div></div>
      <div class="quiz-question">${p.pregunta} = ?</div>
      <div class="quiz-options">${p.opciones.map(o => `<button class="quiz-option" data-op="${o}">${o}</button>`).join('')}</div>
    </div>
  `;
  document.querySelectorAll('.quiz-option').forEach(b => b.addEventListener('click', () => responder(b)));
}

function responder(boton) {
  const p = state.cuestionario.preguntas[state.cuestionario.indice];
  const correcta = parseInt(boton.dataset.op) === p.resultado;
  const tiempo = (Date.now() - state.cuestionario.tiempoInicio) / 1000;
  registrarTiempo(p.pregunta, tiempo);
  
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.classList.add('disabled');
    if (parseInt(b.dataset.op) === p.resultado) b.classList.add('correct');
  });
  
  if (correcta) {
    state.cuestionario.aciertos++;
    boton.classList.add('correct');
  } else {
    boton.classList.add('incorrect');
  }
  
  state.cuestionario.indice++;
  state.cuestionario.tiempoInicio = Date.now();
  setTimeout(renderizarQuizPracticar, 500);
}

function registrarTiempo(preg, tiempo) {
  const usuario = getUsuarioActual();
  const partes = preg.replace('×', 'x').split(/[x\s]+/).filter(p => p);
  const a = parseInt(partes[0]);
  const b = parseInt(partes[1]);
  // Keep original order: first number is row, second is column
  const key = `${a}x${b}`;
  if (!usuario.tiemposRespuesta[key]) usuario.tiemposRespuesta[key] = [];
  usuario.tiemposRespuesta[key].push(tiempo);
  guardarEstado();
}

function guardarResultadosPractica() {
  const usuario = getUsuarioActual();
  const tiempo = (Date.now() - state.cuestionario.tiempoInicio) / 1000;
  usuario.tiempoTotalPractica += tiempo;
  const hoy = new Date().toISOString().split('T')[0];
  let stat = usuario.statsDiarias.find(s => s.fecha === hoy);
  if (!stat) { stat = { fecha: hoy, cuentas: 0, tiempo: 0 }; usuario.statsDiarias.push(stat); }
  stat.cuentas += state.cuestionario.preguntas.length;
  stat.tiempo += tiempo;
  if (usuario.statsDiarias.length > 7) usuario.statsDiarias = usuario.statsDiarias.slice(-7);
  guardarEstado();
}

function renderizarResultados() {
  const q = state.cuestionario;
  const precision = q.aciertos / q.preguntas.length;
  const estrellas = precision >= 1 ? 3 : precision >= 0.85 ? 2 : precision >= 0.7 ? 1 : 0;
  return `
    <div class="results-summary">
      <h3>¡Resultados!</h3>
      <div class="results-score">${q.aciertos}/${q.preguntas.length}</div>
      <div class="results-stars">${'⭐'.repeat(estrellas)}</div>
      <div class="results-stat"><div class="results-stat-value">${Math.round(precision * 100)}%</div><div class="results-stat-label">Precisión</div></div>
      <button class="btn" onclick="renderizar()">Volver</button>
    </div>
  `;
}

function renderizarDesafios() {
  const d = state.desafio;
  if (d.activo) {
    return `
      <div class="screen active" id="desafiosScreen">
        <h2><i class="section-icon ph-timer"></i> Desafío</h2>
        <div class="desafio-timer" id="desafioTimer">${d.tiempoRestante}s</div>
        <div class="desafio-score">Puntos: ${d.puntuacion}</div>
        <div class="desafio-streak"><i class="ph-fill ph-fire"></i><span>Racha: ${d.racha}</span></div>
        <div id="desafioQuiz">${renderizarDesafioQuiz()}</div>
      </div>
    `;
  }
  return `
    <div class="screen active" id="desafiosScreen">
      <h2><i class="section-icon ph-timer"></i> Desafío</h2>
      <div class="empty-state">
        <i class="ph-timer" style="font-size: 48px;"></i>
        <p>60 segundos para resolver cuántos puedas!</p>
        <p style="margin-top: 8px; color: var(--text-secondary);">Mientras más rápido, más puntos.</p>
        <button class="btn" id="startDesafio" style="margin-top: 16px;">¡Iniciar!</button>
      </div>
    </div>
  `;
}

function configurarEventosDesafios() {
  document.getElementById('startDesafio')?.addEventListener('click', iniciarDesafio);
  if (state.desafio.activo) {
    document.querySelectorAll('.quiz-option').forEach(b => b.addEventListener('click', () => responderDesafio(b)));
  }
}

function iniciarDesafio() {
  state.desafio = {
    activo: true,
    tiempoRestante: 60,
    puntuacion: 0,
    racha: 0,
    pregunta: generarPreguntaDesafio(),
    intervalo: setInterval(() => {
      state.desafio.tiempoRestante--;
      document.getElementById('desafioTimer').textContent = state.desafio.tiempoRestante + 's';
      if (state.desafio.tiempoRestante <= 0) {
        clearInterval(state.desafio.intervalo);
        const pts = state.desafio.puntuacion;
        state.desafio = { activo: false, tiempoRestante: 60, puntuacion: 0, racha: 0, pregunta: null, intervalo: null };
        renderizar();
        setTimeout(() => alert(`¡Tiempo! Puntos: ${pts}`), 100);
      }
    }, 1000)
  };
  renderizar();
}

function generarPreguntaDesafio() {
  const t = Math.floor(Math.random() * 12) + 1;
  const n = Math.floor(Math.random() * 12) + 1;
  return { pregunta: `${t} × ${n}`, resultado: t * n, opciones: generarOpciones(t * n) };
}

function renderizarDesafioQuiz() {
  const q = state.desafio.pregunta;
  return `
    <div class="quiz-container">
      <div class="quiz-question">${q.pregunta} = ?</div>
      <div class="quiz-options">${q.opciones.map(o => `<button class="quiz-option" data-op="${o}">${o}</button>`).join('')}</div>
    </div>
  `;
}

function responderDesafio(boton) {
  const correcta = parseInt(boton.dataset.op) === state.desafio.pregunta.resultado;
  if (correcta) {
    state.desafio.puntuacion += 10 + (state.desafio.racha * 2);
    state.desafio.racha++;
    boton.classList.add('correct');
  } else {
    state.desafio.racha = 0;
    boton.classList.add('incorrect');
  }
  setTimeout(() => {
    state.desafio.pregunta = generarPreguntaDesafio();
    renderizar();
  }, 300);
}

function renderizarProgreso() {
  const usuario = getUsuarioActual();
  const tiempoPromedio = calcularTiempoPromedio(usuario);
  const escala = calcularEscala(tiempoPromedio);
  const stats = calcularStatsSemana(usuario);
  return `
    <div class="screen active" id="progresoScreen">
      <h2><span class="section-icon">📊</span> Progreso</h2>
      
      <div class="stats-semana">
        <div class="stat-card">
          <span class="stat-value">${stats.tiempoSemana}</span>
          <span class="stat-label">Tiempo esta semana</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.cuentasSemana}</span>
          <span class="stat-label">Cuentas practicadas</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.diasPractico}</span>
          <span class="stat-label">Días practicados</span>
        </div>
      </div>
      
      <div class="mapa-colores">${renderizarMapaColores(escala, usuario)}</div>
    </div>
  `;
}

function calcularStatsSemana(usuario) {
  const hoy = new Date();
  let tiempoSemana = 0;
  let cuentasSemana = 0;
  let dias = new Set();
  
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    const stat = usuario.statsDiarias.find(s => s.fecha === fechaStr);
    if (stat) {
      tiempoSemana += stat.tiempo || 0;
      cuentasSemana += stat.cuentas || 0;
      dias.add(fechaStr);
    }
  }
  
  const diasPractico = dias.size;
  const tiempoEnMinutos = Math.round(tiempoSemana / 60);
  const tiempoFormateado = tiempoEnMinutos < 60 
    ? tiempoEnMinutos + 'min' 
    : Math.floor(tiempoEnMinutos / 60) + 'h ' + (tiempoEnMinutos % 60) + 'min';
  
  return {
    tiempoSemana: tiempoFormateado,
    cuentasSemana: cuentasSemana,
    diasPractico: diasPractico
  };
}

function calcularTiempoPromedio(usuario) {
  let todos = [];
  Object.values(usuario.tiemposRespuesta).forEach(t => todos = todos.concat(t));
  return todos.length === 0 ? 3 : todos.reduce((a, b) => a + b, 0) / todos.length;
}

function calcularEscala(promedio) {
  return { rapido: Math.max(1, promedio - 1).toFixed(1), normal: promedio.toFixed(1) };
}

function renderizarMapaColores(escala, usuario) {
  const rap = parseFloat(escala.rapido);
  const norm = parseFloat(escala.normal);
  let html = '<div class="tablas-grid">';
  for (let t = 1; t <= 12; t++) {
    html += `<div class="tabla-fila"><div class="tabla-numero">×${t}</div><div class="tabla-celdas">`;
    for (let i = 1; i <= 12; i++) {
      const key = `${t}x${i}`;
      const tiempos = usuario.tiemposRespuesta[key] || [];
      const promedio = tiempos.length > 0 ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length : -1;
      let color = 'rgba(55, 65, 81, 0.4)';
      if (tiempos.length > 0) {
        if (promedio < rap) color = '#10B981';
        else if (promedio <= norm + 1) color = '#F59E0B';
        else color = '#EF4444';
      }
      html += `<div class="tabla-celda" style="background-color: ${color}; color: ${color === '#F59E0B' ? '#0F0F1A' : 'white'};" title="${t} × ${i} = ${t*i}">${t*i}</div>`;
    }
    html += '</div></div>';
  }
  html += '</div>';
  html += `<div class="leyenda-tiempo">
    <span class="leyenda-item"><span class="leyenda-color" style="background:#10B981"></span> &lt;${rap}s</span>
    <span class="leyenda-item"><span class="leyenda-color" style="background:#F59E0B"></span> ±${norm}s</span>
    <span class="leyenda-item"><span class="leyenda-color" style="background:#EF4444"></span> >${norm}s</span>
  </div>`;
  return html;
}

document.addEventListener('DOMContentLoaded', init);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
