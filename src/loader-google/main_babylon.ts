import type { TransformNode } from '@babylonjs/core'
import { Color4, Engine, FreeCamera, Matrix, Mesh, Scene, SceneLoader, Tools, Vector3 } from '@babylonjs/core'

import { Inspector } from '@babylonjs/inspector'

import { Loader } from '@googlemaps/js-api-loader'
import '@babylonjs/loaders/glTF'
import computeWorld from '/@/tools/computeWorld'
import multiplyMatrixes from '/@/tools/multiplyMatrixes'

console.info(import.meta.env.VITE_GOOGLE_API_KEY)
const apiOptions = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
}

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 20,
  center: { lat: 37.341641, lng: -121.879632 },
  mapId: '420a4e55cbbdd5e6',
  mapTypeId: 'satellite',
}

async function initMap() {
  const mapDiv = document.getElementById('map') as HTMLDivElement
  const apiLoader = new Loader(apiOptions)
  await apiLoader.load()
  return new google.maps.Map(mapDiv, mapOptions)
}

function initWebGLOverlayView(map: google.maps.Map) {
  let engine: Engine
  let scene: Scene
  let camera: FreeCamera
  let sceneLoaded = false
  let world: Matrix
  const modelTransform = {
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: Tools.ToRadians(0),
    rotateY: Tools.ToRadians(0),
    rotateZ: Tools.ToRadians(0),
    scale: 1,
  }

  //   let loader: GLTFLoader

  const webGLOverlayView = new google.maps.WebGLOverlayView()

  webGLOverlayView.onAdd = () => {
    console.log('🚀 ~ onAdd')
  }
  webGLOverlayView.onContextRestored = (options) => {
    console.log('🚀 ~ onContextRestored')
    const gl = options.gl as WebGL2RenderingContext
    const glOptions = gl.getContextAttributes() as WebGLContextAttributes
    engine = new Engine(gl, glOptions.antialias, { ...glOptions }, true)
    scene = new Scene(engine)
    scene.autoClear = false
    scene.detachControl()
    scene.createDefaultLight()

    SceneLoader.AppendAsync('', 'demo_gameroom_baked.glb', scene).then((gltf) => {
      camera = new FreeCamera('camera', new Vector3(10, 10, 10), scene)
      //   camera.attachControl()
      //   scene.activeCamera = camera
      sceneLoaded = true
      gltf.meshes.forEach((mesh) => {
        if (mesh.name === 'white.013') {
          const sceneMesh = mesh as TransformNode
          sceneMesh.name = 'sceneMesh'
          sceneMesh.setParent(null)
          sceneMesh.rotation = new Vector3(0, 0, 0)
          sceneMesh.position = new Vector3(0, 0, 0)
          sceneMesh.scaling = new Vector3(1, -1, 1)
        }
      })

      Inspector.Show(scene, {
        globalRoot: document.querySelector('body') as HTMLElement,
        embedMode: false,
        overlay: true,
      })
      //   const beforeRenderObserver = scene.onBeforeRenderObservable.add(() => {
      //     map.moveCamera({
      //       tilt: mapOptions.tilt,
      //       heading: mapOptions.heading,
      //       zoom: mapOptions.zoom,
      //     })

    //     if (mapOptions.tilt < 67.5) {
    //       mapOptions.tilt += 0.5
    //     }
    //     else if (mapOptions.heading <= 360) {
    //       mapOptions.heading += 0.2
    //     }
    //     else {
    //       scene.onBeforeRenderObservable.remove(beforeRenderObserver)
    //     }
    //   })
    })
  }

  webGLOverlayView.onDraw = ({ transformer }) => {
    console.log('🚀 ~ onDraw ~ gl:')
    const latLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 0,
    }
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral)
    console.log('🚀 ~ initWebGLOverlayView ~ transformer.getCameraParams():', transformer.getCameraParams())

    if (sceneLoaded && scene) {
      world = computeWorld(modelTransform)
      const mat = multiplyMatrixes(world.m, matrix, camera.getProjectionMatrix().m)

      camera.freezeProjectionMatrix(Matrix.FromArray(mat))

      webGLOverlayView.requestRedraw()
      scene.render()
      engine.wipeCaches(true)
    }
  }

  webGLOverlayView.setMap(map)
}

(async () => {
  const map = await initMap()
  initWebGLOverlayView(map)
})()
