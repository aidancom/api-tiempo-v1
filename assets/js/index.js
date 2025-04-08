window.addEventListener('load', () => {

  let selector = document.getElementById('selector-provincia')
  let loader = document.getElementById('loader')
  let loader_box = document.getElementById('datos-loader')

  const provis = async () => {
    try {
      const response = await fetch('./assets/provincias.json')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const options = async () => {
    const data = await provis()
    data.forEach(provincia => {
      let option = document.createElement('option')
      option.value = provincia.slug
      option.innerHTML = provincia.name
      selector.appendChild(option)
    })
  }
  
  function insertInfo(data, provincia) {
    let caja = document.getElementById('datos-meteo')
    const {is_day, rain, cloud_cover} = data.current
    caja.innerHTML = `
      <h3>Información del clima en ${provincia}</h3>
      <p>Estado: ${is_day ? 'Es de día 🌇' : 'Es de noche 🌃'}</p>
      <p>Meteorología: ${rain ? 'Lloviendo 🌧️' : cloud_cover > 50 ? 'Nublado ☁️' : cloud_cover < 50 && cloud_cover > 0 ? 'Parcialmente nublado ⛅' : 'Soleado ☀️'}</p>
      ${rain ? `<p>Precipitación: ${rain} mm ⛆</p>` : ''}
      <p>Temperatura: ${data.current.temperature_2m} °C 🌡️</p>
    `
    loader.classList.remove('loader')
    loader_box.classList.remove('loading')
  }

  const getMeteo = async (provincia) => {
    try {
      const respuesta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${provincia.coordinates.latitude}&longitude=${provincia.coordinates.longitude}&hourly=temperature_2m,relative_humidity_2m&current=rain,precipitation,weather_code,temperature_2m,is_day,cloud_cover`)
      if (!respuesta.ok) {
        throw new Error('Error en la respuesta de la API');
      } else {
        const data = await respuesta.json()
        insertInfo(data, provincia.name)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const information = async (value) => {
    try {
      const data = await provis()
      const [provincia] = data.filter(provincia => provincia.slug === value)
      loader.classList.add('loader')
      loader_box.classList.add('loading')
      setTimeout(() => {
        getMeteo(provincia)
      }, 1000)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  selector.addEventListener('change', function() {
    information(this.value)
  });
  
  options()
})