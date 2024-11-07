import { Loader } from '@googlemaps/js-api-loader'
import { AmbientLight, DirectionalLight, Matrix4, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

console.info(import.meta.env.VITE_GOOGLE_API_KEY)
const apiOptions = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
}

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: { lat: 37.341641, lng: -121.879632 },
  mapId: '420a4e55cbbdd5e6',
  mapTypeId: 'satellite',
}

async function initMap() {
  const mapDiv = document.getElementById('map')
  const apiLoader = new Loader(apiOptions)
  await apiLoader.load()
  return new google.maps.Map(mapDiv, mapOptions)
}

function initWebGLOverlayView(map) {
  let scene: Scene
  let renderer: WebGLRenderer
  let camera: PerspectiveCamera
  let loader: GLTFLoader

  const webGLOverlayView = new google.maps.WebGLOverlayView()

  webGLOverlayView.onAdd = () => {
    scene = new Scene()
    camera = new PerspectiveCamera()
    const ambientLight = new AmbientLight(0xFFFFFF, 0.75)
    scene.add(ambientLight)
    const directionalLight = new DirectionalLight(0xFFFFFF, 0.25)
    directionalLight.position.set(0.5, -1, 0.5)
    scene.add(directionalLight)

    loader = new GLTFLoader()
    const source = 'pin.gltf'
    loader.load(
      source,
      (gltf) => {
        gltf.scene.scale.set(25, 25, 25)
        gltf.scene.rotation.x = 180 * Math.PI / 180
        scene.add(gltf.scene)
      },
    )
  }

  webGLOverlayView.onContextRestored = ({ gl }) => {
    renderer = new WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    })

    renderer.autoClear = false

    loader.manager.onLoad = () => {
      renderer.setAnimationLoop(() => {
        map.moveCamera({
          tilt: mapOptions.tilt,
          heading: mapOptions.heading,
          zoom: mapOptions.zoom,
        })

        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5
        }
        else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2
        }
        else {
          renderer.setAnimationLoop(null)
        }
      })
    }
  }

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    const latLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 100,
    }

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral)
    camera.projectionMatrix = new Matrix4().fromArray(matrix)

    webGLOverlayView.requestRedraw()

    renderer.render(scene, camera)
    renderer.resetState()
  }

  webGLOverlayView.setMap(map)
}

(async () => {
  const map = await initMap()
  initWebGLOverlayView(map)
})()
