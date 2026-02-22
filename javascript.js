document.addEventListener('DOMContentLoaded', (listo)=> {console.log(listo.type);
	let festivosX = {
    1: {
		1: ['Año Nuevo','festivo-1'],
		6: ['Día de Reyes','festivo-1'],
		22: ['San Vicente Mártir','festivo-1']
	},
	3: {
		19: ['San José (día del padre)','festivo-1']
	},
	4: {
	},
    5: {
		1: ['Día del Trabajo','festivo-1'],
		31: ['Día de Castilla la Mancha','festivo-2']
	},
	6: {
		24: ['San Juan','festivo-1']
	},
    8: {
		13: ['Día Internacional del Zurdo','festivo-2'],
        15: ['Asunción de la Virgen','festivo-1']
	},
    10: {
		9: ['Día de la Comunidad Valenciana','festivo-1'],
		12: ['Día de la Hispanidad','festivo-1']
	},
    11: {
		1: ['Todos los santos','festivo-1']
	},
    12: {
		6: ['Día de la Constitución','festivo-1'],
        8: ['Inmaculada Concepción','festivo-1'],
        25: ['Navidad','festivo-1']
	}
};
let festivos = JSON.parse(JSON.stringify(festivosX));
calcgauss();
function calcgauss(aa = new Date().getFullYear()) {
festivos = JSON.parse(JSON.stringify(festivosX));
	let a, b, c, k, p, q, m, n, d, e, x, s;

	a = aa % 19;
	b = aa % 4;
	c = aa % 7;
	k = Math.floor(aa / 100);
	p = Math.floor((13 + 8 * k) / 25);
	q = Math.floor(k / 4);
	m = (15 - p + k - q) % 30;
	n = (4 + k - q) % 7;
	d = (19 * a + m) % 30;
	e = (2 * b + 4 * c + 6 * d + n) % 7;
	x = (11 * m + 11) % 30;

	if((22 + d + e) < 32) {
		s = (22 + d + e);
		m = 2;
	} else  {
		s = (d + e - 9);
		m = 3;
	}
	if (d == 29 && e == 6) {
		s = 19;
		m = 3;
	};
	if (d == 28 && e == 6 && x < 19) {
		s = 18;
		m = 3;
	};

	let domingo = new Date(aa,4,1);
	while (domingo.getDay() != 0) {
		domingo.setDate(domingo.getDate() + 1);
	};

	let opciones = {month: '2-digit', day: '2-digit'};

let vs = new Date(aa, m, s - 2),
lp = new Date(aa, m, s + 1),
sv = new Date(aa, m, s + 8);

festivos[vs.getMonth() + 1][vs.getDate()] = ['Viernes Santo','festivo-1'];
festivos[lp.getMonth() + 1][lp.getDate()] = ['Lunes de Pascua','festivo-1'];
festivos[sv.getMonth() + 1][sv.getDate()] = ['San Vicente Ferrer','festivo-1'];
festivos[5][domingo.getDate()] = ['Día de la madre','festivo-2'];

};

let fechaActual = new Date();
let diasSeleccionados = new Set();
const gridCalendario = document.getElementById('calendar-grid');
const mesActualHeader = document.getElementById('mes-actual');
const annoActualHeader = document.getElementById('anno-actual');
const diasSeleccionadosSpan = document.getElementById('dias-seleccionados');

let dia_hoy = fechaActual.getDate();
let mes_hoy = fechaActual.toLocaleString('es-ES', { month: 'long' });

// Array de días de la semana modificado para empezar en Lunes
const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function renderizarCalendario() {

    gridCalendario.innerHTML = '';
    
    // Añadir encabezados de días de la semana
    diasSemana.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('day-header');
        header.textContent = day;
        gridCalendario.appendChild(header);
    });

    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDiaMes.getDate();
    
    // getDay() devuelve 0 (Dom) a 6 (Sáb). 
    // Para que empiece en lunes (1), ajustamos el índice.
    // Si es Domingo (0), lo tratamos como el 6º día de la semana laboral (índice 6 de nuestro array).
    let primerDiaSemana = primerDiaMes.getDay(); 
    if (primerDiaSemana === 0) {
        primerDiaSemana = 6; // Domingo pasa a ser el último día (índice 6)
    } else {
        primerDiaSemana--; // Lunes (1) pasa a ser índice 0, Martes (2) índice 1, etc.
    }

    annoActualHeader.textContent = fechaActual.getFullYear();
	mesActualHeader.textContent = fechaActual.toLocaleString('es-ES', { month: 'long' });

    // Rellenar días vacíos al principio
    for (let i = 0; i < primerDiaSemana; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.classList.add('calendar-day', 'inactive');
        gridCalendario.appendChild(diaVacio);
    }

    // Rellenar días del mes
    for (let i = 1; i <= diasEnMes; i++) {
        const dia = document.createElement('div');
        dia.classList.add('calendar-day');
		if(i === fechaActual.getDate()) {
			dia.classList.add('dia-hoy');
		};
		if(i === fechaActual.getDate() && mesActualHeader.textContent === mes_hoy) {
			dia.classList.add('mes-hoy');
		};
		let fest = fechaActual.getMonth() + 1;
		
		if (festivos[fest] && festivos[fest][i]) {
            dia.classList.add(festivos[fest][i][1]);
			//dia.title = festivos[fest][i][0];
			dia.innerHTML = i + '<span>' + festivos[fest][i][0] + '</span>';
        } else {
			dia.textContent = i;
		};


        

        const fechaDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i);
        const fechaKey = fechaDia.toISOString().split('T')[0]; // Usar solo la parte de fecha

        if (diasSeleccionados.has(fechaKey)) {
            dia.classList.add('selected');
        }

        dia.addEventListener('click', () => toggleDia(fechaKey, dia));
        gridCalendario.appendChild(dia);
    };
    actualizarContador();
}

function toggleDia(fechaKey, elementoDia) {
    if (diasSeleccionados.has(fechaKey)) {
        diasSeleccionados.delete(fechaKey);
        elementoDia.classList.remove('selected');
    } else {
        diasSeleccionados.add(fechaKey);
        elementoDia.classList.add('selected');
    };
    actualizarContador();
};

function cambiarMes(offset) {
    fechaActual.setMonth(fechaActual.getMonth() + offset);
	calcgauss(fechaActual.getFullYear());
    renderizarCalendario();
};

function actualizarContador() {
    diasSeleccionadosSpan.textContent = diasSeleccionados.size;
};

function reiniciarSeleccion() {
    diasSeleccionados.clear();
    renderizarCalendario();
};

document.querySelector('.container button:nth-of-type(1)').addEventListener('click', function() {
	cambiarMes(-1);
}, false);

document.querySelector('.container button:nth-of-type(2)').addEventListener('click', function() {
	cambiarMes(1);
}, false);

document.querySelector('.container > button:last-child').addEventListener('click', reiniciarSeleccion, false);

// Inicializar el calendario al cargar
renderizarCalendario();
}, false);
