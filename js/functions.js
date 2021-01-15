const url_narrativa = 'https://api.covid19tracking.narrativa.com/api'
const html_contenido = document.getElementById('div_contenido')
const select_comunidad = document.getElementById('sel_comunidad')
const div_comunidad = document.getElementById('div_comunidad')
const sp_poblacion = document.getElementById('sp_poblacion')
const range = 3
const range_max = 150

// FUENTE: https://www.ine.es/index.htm datos actualizados para el año 2020 //datos del 2019
let poblacion = [
  { ccaa: 'andalucia', poblacion:  8476718}, //8414240
  { ccaa: 'aragon', poblacion:  1330445}, //1319291
  { ccaa: 'asturias', poblacion:  1018775}, //1022800
  { ccaa: 'baleares', poblacion:  1210750}, //1149460
  { ccaa: 'canarias', poblacion:  2237309}, //2153389
  { ccaa: 'cantabria', poblacion:  582357}, //581078
  { ccaa: 'castilla_y_leon', poblacion:  2401230}, //2399548
  { ccaa: 'castilla-la_mancha', poblacion:  2045384}, //2032863
  { ccaa: 'cataluna', poblacion:  7652069}, //7675217
  { ccaa: 'c_valenciana', poblacion:  5028650}, //5003769
  { ccaa: 'extremadura', poblacion:  1061768}, //1067710
  { ccaa: 'galicia', poblacion:  2702244}, //2699499
  { ccaa: 'madrid', poblacion:  6747425}, //6663394
  { ccaa: 'murcia', poblacion:  1504607}, //1493898
  { ccaa: 'navarra', poblacion:  656487}, //654214
  { ccaa: 'pais_vasco', poblacion:  2189310}, //2207776
  { ccaa: 'la_rioja', poblacion:  315926}, //316798
  { ccaa: 'ceuta', poblacion:  84032}, //84777
  { ccaa: 'melilla', poblacion:  84496} //86487
]
//
// let poblacion_ine = []

document.addEventListener('DOMContentLoaded', initFunction())

select_comunidad.addEventListener('change', (event) => {
  let region = event.target.value
  if (region !== 'select_region') {
    queryRegion(region)
  } else {
    sin_datos('Comunidad Autónoma', '...')
  }
})

function verInfo () {
  let div_verInfo = document.getElementById('div_verInfo')
  div_verInfo.classList.toggle('no-visible')
  let div_verInfo_es = document.getElementById('div_verInfo_es')
  div_verInfo_es.classList.add('no-visible')
}

function verInfoEs () {
  let div_verInfo_es = document.getElementById('div_verInfo_es')
  div_verInfo_es.classList.toggle('no-visible')
  let div_verInfo = document.getElementById('div_verInfo')
  div_verInfo.classList.add('no-visible')
}

function spiner () {
  let html = `
    <div class="provincia">
      <p>Comunidad Autónoma</p>
      <div class="ellipsis_total">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p class="title_ia">[IA] Incidencia Acumulada a 7 y 14 días</p>
      <div class="ellipsis_ia">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  `
  div_comunidad.innerHTML = `${html}`
}

function initFunction () {
  /*
  fetch('http://servicios.ine.es/wstempus/js/es/DATOS_TABLA/36191')
  .then(function(response) {
    return response.text()
  })
  .then(function(text) {
    poblacion_ine = JSON.parse(text)
  })
  .catch(function(error) {
    console.log('Request failed', error)
  })
  */
  let query = '/countries/spain/regions'
  let req = `${url_narrativa}${query}`
  fetch(req)
  .then(function(response) {
    return response.text()
  })
  .then(function(text) {
    let data = JSON.parse(text).countries[0].spain
    let data_sort = data.sort((a, b) => (a.name_es > b.name_es) ? 1 : (a.name_es < b.name_es) ? -1 : 0)
    let option
    data_sort.forEach(
      e => {
        option = document.createElement('option')
        option.text = e.name_es
        option.value = e.id
        select_comunidad.add(option)
      }
    )
  })
  .catch(function(error) {
    console.log('Request failed', error)
  })
}

function queryRegion (region) {
  spiner()
  let html = ``
  let query = `/${hoy}/country/spain/region/${region}`
  let req = `${url_narrativa}${query}`
  fetch(req).then(function(response) {
    return response.text()
  }).then(function(text) {
    let data = JSON.parse(text)
    let reg = data.dates[hoy].countries.Spain.regions[0]
    let query_7d = `/${siete_dias}/country/spain/region/${region}`
    let req_7d = `${url_narrativa}${query_7d}`
    // + inf España.
    let reg_es = data.dates[hoy].countries.Spain
    let confirmados_tot_es = formatearNumero(reg_es.today_confirmed)
    let muertes_tot_es = formatearNumero(reg_es.today_deaths)
    let uci_tot_es = formatearNumero(reg_es.today_intensive_care)
    let casos_tot_abiertos_es = formatearNumero(reg_es.today_open_cases)
    let recuperados_tot_es = formatearNumero(reg_es.today_recovered)
    let hospitalizados_tot_es = formatearNumero(reg_es.today_total_hospitalised_patients)
    let confirmados_es = formatearNumero(reg_es.today_new_confirmed)
    let muertes_es = formatearNumero(reg_es.today_new_deaths)
    let uci_es = formatearNumero(reg_es.today_new_intensive_care)
    let casos_abiertos_es = formatearNumero(reg_es.today_new_open_cases)
    let recuperados_es = formatearNumero(reg_es.today_new_recovered)
    let hospitalizados_es = formatearNumero(reg_es.today_new_total_hospitalised_patients)
    // + inf España [Mundial/World].
    let reg_w = data.total
    let confirmados_tot_w = formatearNumero(reg_w.today_confirmed)
    let muertes_tot_w = formatearNumero(reg_w.today_deaths)
    let casos_tot_abiertos_w = formatearNumero(reg_w.today_open_cases)
    let recuperados_tot_w = formatearNumero(reg_w.today_recovered)
    let confirmados_w = formatearNumero(reg_w.today_new_confirmed)
    let muertes_w = formatearNumero(reg_w.today_new_deaths)
    let casos_abiertos_w = formatearNumero(reg_w.today_new_open_cases)
    let recuperados_w = formatearNumero(reg_w.today_new_recovered)
    fetch(req_7d).then(function(response) {
      return response.text()
    }).then(function(text) {
      let data_7d = JSON.parse(text)
      let reg_7d = data_7d.dates[siete_dias].countries.Spain.regions[0]
      let query_14d = `/${catorce_dias}/country/spain/region/${region}`
      let req_14d = `${url_narrativa}${query_14d}`
      fetch(req_14d).then(function(response) {
        return response.text()
      }).then(function(text) {
        let data_14d = JSON.parse(text)
        let reg_14d = data_14d.dates[catorce_dias].countries.Spain.regions[0]
        // ((Nº infectados hoy - Nº infectados hace N días) / Nº habitantes) * 100.000
        let iHoy = parseInt(reg.today_confirmed)
        let i7dias = parseInt(reg_7d.today_confirmed)
        let nHabitantes = poblacion.find(e => e.ccaa === region).poblacion - reg.today_deaths
        let ia_7d = ((iHoy - i7dias) / nHabitantes) * 100000
        // ((Nº infectados hoy - Nº infectados hace N días) / Nº habitantes) * 100.000
        let i14dias = parseInt(reg_14d.today_confirmed)
        let ia_14d = ((iHoy - i14dias) / nHabitantes) * 100000
        // Formateamos los números
        let simbolo_confirmed = formatearNumero(reg.today_confirmed)
        let simbolo_confirmed_7d = formatearNumero(reg_7d.today_confirmed)
        let simbolo_confirmed_14d = formatearNumero(reg_14d.today_confirmed)
        let simbolo_ia_7d = formatearNumero(ia_7d.toFixed(2))
        let simbolo_ia_14d = formatearNumero(ia_14d.toFixed(2))
        // Obtenemos la población de la comunidad
        let pob_find = poblacion.find(e => e.ccaa === region).poblacion
        let pob_Region = (typeof pob_find !== 'undefined') ? formatearNumero(pob_find) : '...'
        // + inf CCAA.
        let confirmados = formatearNumero(reg.today_new_confirmed)
        let muertes = formatearNumero(reg.today_new_deaths)
        let uci = formatearNumero(reg.today_new_intensive_care)
        let casos_abiertos = formatearNumero(reg.today_new_open_cases)
        let recuperados = formatearNumero(reg.today_new_recovered)
        let hospitalizados = formatearNumero(reg.today_new_total_hospitalised_patients)
        // Añadimos el html los resultados de la provincia
        html += `
          <div class="provincia">
            <p>${reg.name_es} <span>[${hoy_html}]<span></p>
            <ul>
              <li>Confirmados: <span>${simbolo_confirmed}</span></li>
              <li>Confirmados 7d: <span>${simbolo_confirmed_7d}</span></li>
              <li>Confirmados 14d: <span>${simbolo_confirmed_14d}</span></li>
            </ul>
            <p class="title_ia">[IA] Incidencia Acumulada a 7 y 14 días</p>
            <ul>
              <li>IA 7d: <span>${simbolo_ia_7d}</span></li>
              <li>IA 14d: <span>${simbolo_ia_14d}</span></li>
            </ul>
            <ul>
              <li>Población: <span>${pob_Region}</span></li>
            </ul>
          </div>
          <div id="div_masInfo" class="mas_info">
            <span class="par-title par-title_es" onclick="verInfoEs()">+ inf. España/Mundial</span>
            <span class="par-title" onclick="verInfo()">+ inf. CCAA</span>
          </div>
          `
        html += `<div id="div_verInfo_es" class="no-visible">` // Creamos div #div_verInfo_es
        html += `
          <div class="provincia">
            <p>España Totales</p>
            <ul>
              <li>Confirmados: <span>${confirmados_tot_es}</span></li>
              <li>Muertes: <span>${muertes_tot_es}</span></li>
              <li>UCI: <span>${uci_tot_es}</span></li>
              <li>Casos abiertos: <span>${casos_tot_abiertos_es}</span></li>
              <li>Recuperados: <span>${recuperados_tot_es}</span></li>
              <li>Hospitalizados: <span>${hospitalizados_tot_es}</span></li>
            </ul>
            <p class="segundo-titulo">España Hoy <span>[${hoy_html}]<span></p>
            <ul>
              <li>Confirmados: <span>${confirmados_es}</span></li>
              <li>Muertes: <span>${muertes_es}</span></li>
              <li>UCI: <span>${uci_es}</span></li>
              <li>Casos abiertos: <span>${casos_abiertos_es}</span></li>
              <li>Recuperados: <span>${recuperados_es}</span></li>
              <li>Hospitalizados: <span>${hospitalizados_es}</span></li>
            </ul>
          </div>
        `
        html += `
          <div class="provincia">
            <p>Totales Mundial</p>
            <ul>
              <li>Confirmados: <span>${confirmados_tot_w}</span></li>
              <li>Muertes: <span>${muertes_tot_w}</span></li>
              <li>Casos abiertos: <span>${casos_tot_abiertos_w}</span></li>
              <li>Recuperados: <span>${recuperados_tot_w}</span></li>
            </ul>
            <p class="segundo-titulo">Hoy Mundial <span>[${hoy_html}]<span></p>
            <ul>
              <li>Confirmados: <span>${confirmados_w}</span></li>
              <li>Muertes: <span>${muertes_w}</span></li>
              <li>Casos abiertos: <span>${casos_abiertos_w}</span></li>
              <li>Recuperados: <span>${recuperados_w}</span></li>
            </ul>
          </div>
        `
        html += `</div>` // Cerramos div #div_veriInfo_es

                
        html += `<div id="div_verInfo" class="no-visible">` // Creamos div #div_verInfo
          // Añadimos el html los datos del día de hoy de la provincia
        html += `
          <div class="provincia">
            <p>${reg.name_es} Hoy</p>
            <ul>
              <li>Confirmados: <span>${confirmados}</span></li>
              <li>Muertes: <span>${muertes}</span></li>
              <li>UCI: <span>${uci}</span></li>
              <li>Casos abiertos: <span>${casos_abiertos}</span></li>
              <li>Recuperados: <span>${recuperados}</span></li>
              <li>Hospitalizados: <span>${hospitalizados}</span></li>
            </ul>
          </div>
        `
        // Añadimos el html los datos de las regiones de la privincia
        reg.sub_regions.forEach(e => {
          let sub_regions_confirmados = (Number.isInteger(e.today_new_confirmed)) ? formatearNumero(e.today_new_confirmed) : '...'
          let sub_regions_muertes = (Number.isInteger(e.today_new_deaths)) ? formatearNumero(e.today_new_deaths) : '...'
          let sub_regions_uci = (Number.isInteger(e.today_new_intensive_care)) ? formatearNumero(e.today_new_intensive_care) : '...'
          let sub_regions_recuperados = (Number.isInteger(e.today_new_recovered)) ? formatearNumero(e.today_new_recovered) : '...'
          let sub_regions_hospitalizados = (Number.isInteger(e.today_new_total_hospitalised_patients)) ? formatearNumero(e.today_new_total_hospitalised_patients) : '...'
          html += `
            <div class="provincia">
              <p>${e.name}</p>
              <ul>
                <li>Confirmados: <span>${sub_regions_confirmados}</span></li>
                <li>Muertes: <span>${sub_regions_muertes}</span></li>
                <li>UCI: <span>${sub_regions_uci}</span></li>
                <li>Recuperados: <span>${sub_regions_recuperados}</span></li>
                <li>Hospitalizados: <span>${sub_regions_hospitalizados}</span></li>
              </ul>
            </div>
          `
        })
        html += `</div>` // Cerramos div #div_veriInfo
        let list_ia = [ia_7d, ia_14d]
        html += `<hr />`
        html += tablaProv(list_ia)
        // Añadimos el html al DOM #div_comunidad
        div_comunidad.innerHTML = `${html}`
        slider()
      }).catch(function(error) {
        sin_datos(`No hay datos [${hoy}]`, 'N/A')
        console.log('Request failed', error)
      })
    }).catch(function(error) {
      sin_datos(`No hay datos [${hoy}]`, 'N/A')
      console.log('Request failed', error)
    })
  }).catch(function(error) {
    sin_datos(`No hay datos [${hoy}]`, 'N/A')
    console.log('Request failed', error)
  })
}

/* No hay datos */
function sin_datos (region, val) {
  html = `
    <div class="provincia">
      <p>${region}</p>
      <ul>
        <li>Confirmados: <span>${val}</span></li>
        <li>Confirmados 7d: <span>${val}</span></li>
        <li>Confirmados 14d: <span>${val}</span></li>
      </ul>
      <p class="title_ia">[IA] Incidencia Acumulada a 7 y 14 días</p>
      <ul>
        <li>IA 7d: <span>${val}</span></li>
        <li>IA 14d: <span>${val}</span></li>
      </ul>
    </div>
  `
  div_comunidad.innerHTML = `${html}`
}

/* Slider */
function slider() {
  let slider = document.getElementById('myRange')
  let output = document.getElementById('demo')
  let ia7d = document.getElementById('in_prob_0')
  let ia14d = document.getElementById('in_prob_1')
  let ia0 = document.getElementById('calc_ia_0')
  let ia1 = document.getElementById('calc_ia_1')
  output.innerHTML = slider.value

  slider.oninput = function() {
    output.innerHTML = this.value
    let simbolo_ia0 = calcularProb(ia0.innerHTML, this.value)
    let simbolo_ia1 = calcularProb(ia1.innerHTML, this.value)
    ia7d.innerHTML = `${formatearNumero(simbolo_ia0)}%`
    ia14d.innerHTML = `${formatearNumero(simbolo_ia1)}%`
  }
}
// Calcular la probabilidad del ia para N personas
function calcularProb (ia, N) {
  let in_ac = parseFloat(ia).toFixed(3)
  let p = parseFloat(in_ac/100000)
  let P0 = Binomial(N, p, 1)
  let prob = parseFloat(P0*100).toFixed(3)
  return prob
}

function tablaProv(list_ia) {
  // Creamos el DOM para el input type range
  let html = `
    <h3>Selecciona nº de personas</h3>
    <p class="tit_info">
      Aumenta el nº de personas reunidas para ver cual sería el porcentaje de riesgo de ser contagiado.
    </p>
    <div class="slidecontainer">
      <span id='range_min'>${range}</span>
      <input type="range" min="${range}" max="${range_max}" value="${range}" class="slider" id="myRange">
      <span id='range_max'>${range_max}</span>
    </div>
  `
  // Creamos el DOM con las celdas de los nº de personas. La cabecera de la tabla
  let list_N = [range, 6, 10]
  list_N.forEach (
    (e, index) => {
      html += (index === 0) ? `<div class='prob prob_n'></div>` : ``
      html += (index === 0) ? `<div id="demo" class='prob calculado'>${e}</div>` : `<div class='prob'>${e}</div>` 
    }
  )
  // Creamos el DOM con las celdas del ia7-ia14 por cada una de las celdas de personas. El body de la tabla
  list_ia.forEach(
    (ia, index_ia) => list_N.forEach (
      (N, index_N) => {
        let in_ac = parseFloat(ia).toFixed(3)
        let prob = calcularProb(ia, N)
        let simbolo_in_ac = formatearNumero(in_ac)
        let simbolo_prob = formatearNumero(prob)
        html += (index_N === 0) ? `<div class='no-visible' id='calc_ia_${index_ia}'>${in_ac}</div>` : ``
        html += (index_N === 0) ? `<br /><div class='prob prob_ia'>${simbolo_in_ac}</div>` : ``
        html += (index_N === 0) ? `<div id="in_prob_${index_ia}" class='prob calculado'>${simbolo_prob}%</div>` : `<div class='prob'>${simbolo_prob}%</div>`
      }
    )
  )

  return html
}
// https://www.estadisticaparatodos.es/software/misjavascript/js/binomial.js
function Factorial(num){
	let n = 1
	for (let sw = 1; sw <= num; sw += 1) {
		n *= sw
	}
	return(n)
}
function NumComb(sup, inf){
	return Factorial(sup) / (Factorial(inf) * Factorial(sup - inf))
}
function Binomial(n,p,k){
    return NumComb(n,k) * Math.pow(p,k) * Math.pow(1-p,n-k)
}


function formatearFecha(x, y) {
  var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
  }
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
  })

  return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
  })
}

// formatearNumero(123456779.18) // retorna "123.456.779,18"
function formatearNumero (num) {
  let separador = '.'
  let sepDecimal = ','
  let splitStr = num.toString().split('.')
  let splitLeft = splitStr[0]
  let splitRight = splitStr.length > 1 ? sepDecimal + splitStr[1] : ''
  let regx = /(\d+)(\d{3})/
  while (regx.test(splitLeft)) {
    splitLeft = splitLeft.replace(regx, `$1${separador}$2`)
  }
  return `${splitLeft}${splitRight}`
}

 function restarDias(fecha, dias){
  fecha.setDate(fecha.getDate() - dias)
  return fecha
}

const n_dias = 0 //1
const n_dias2 = n_dias + 7 //8
const n_dias3 = n_dias + 14 //15
const hoy = formatearFecha(restarDias(new Date(), n_dias), 'yyyy-MM-dd')
const siete_dias = formatearFecha(restarDias(new Date(), n_dias2), 'yyyy-MM-dd')
const catorce_dias = formatearFecha(restarDias(new Date(), n_dias3), 'yyyy-MM-dd')

const hoy_html = formatearFecha(restarDias(new Date(), n_dias), 'dd-MM-yyyy')
const siete_dias_html = formatearFecha(restarDias(new Date(), n_dias2), 'dd-MM-yyyy')
const catorce_dias_html = formatearFecha(restarDias(new Date(), n_dias3), 'dd-MM-yyyy')

/*
  Cálculo IA (Incidencia Acumulada)
  ((Nº infectados hoy - Nº infectados hace N días) / Nº habitantes) * 100.000

  Datos obtenidos de la API de narrativa.com
    https://documenter.getpostman.com/view/10831675/SzYZ1eNY#1ec8ab35-5fe2-4033-bc74-0a1c636d81dd
    https://www.narrativa.com

*/