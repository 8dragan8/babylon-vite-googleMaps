import * as Cesium from 'cesium'
import * as THREE from 'three'
import CesiumScene from '/@/threeVersion/CesiumScene'
import ThreeObject from '/@/threeVersion/ThreeObject'

const minWGS84: [number, number] = [115.23, 39.55]
const maxWGS84: [number, number] = [116.23, 41.55]

// const minWGS84: [number, number] =    [-121.8810757, 37.3417071];
// const maxWGS84: [number, number] =    [-121.8798307, 37.3420631];

export default class ThreeScene {
  renderer!: THREE.WebGLRenderer
  camera!: THREE.PerspectiveCamera
  scene!: THREE.Scene
  cesiumScene: CesiumScene
  threeObjects: ThreeObject[] = []
  threeContainer: HTMLDivElement

  constructor() {
    this.threeContainer = document.getElementById('ThreeContainer') as HTMLDivElement
    this.cesiumScene = new CesiumScene(minWGS84, maxWGS84)
  }

  initThree() {
    const fov = 45
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    const near = 1
    const far = 10 * 1000 * 1000

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.threeContainer.appendChild(this.renderer.domElement)
  }

  cartToVec(cart: Cesium.Cartesian3) {
    return new THREE.Vector3(cart.x, cart.y, cart.z)
  };

  renderThreeObj() {
    // register Three.js scene with Cesium
    const cesiumCameraFrustum = this.cesiumScene.viewer.camera.frustum as Cesium.PerspectiveFrustum
    if (cesiumCameraFrustum.fovy) {
      this.camera.fov = Cesium.Math.toDegrees(cesiumCameraFrustum.fovy) // ThreeJS FOV is vertical
    }

    this.camera.updateProjectionMatrix()

    // console.log("🚀 ~ ThreeScene ~ renderThreeObj ~ this.threeObjects:", this.threeObjects)

    // Configure Three.js meshes to stand against globe center position up direction
    for (const id in this.threeObjects) {
      const minWGS84 = this.threeObjects[id].minWGS84
      const maxWGS84 = this.threeObjects[id].maxWGS84
      // convert lat/long center position to Cartesian3
      const center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2)

      // get forward direction for orienting model
      const centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1)

      // use direction from bottom left to top left as up-vector
      const bottomLeft = this.cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]))
      const topLeft = this.cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]))
      const latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize()

      // configure entity position and orientation
      this.threeObjects[id].threeMesh.position.copy(this.cartToVec(center))
      this.threeObjects[id].threeMesh.lookAt(this.cartToVec(centerHigh))
      this.threeObjects[id].threeMesh.up.copy(latDir)
    }

    // Clone Cesium Camera projection position so the
    // Three.js Object will appear to be at the same place as above the Cesium Globe
    this.camera.matrixAutoUpdate = false
    const cvm = this.cesiumScene.viewer.camera.viewMatrix
    const civm = this.cesiumScene.viewer.camera.inverseViewMatrix
    this.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15],
    )
    this.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15],
    )
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    const width = this.threeContainer.clientWidth
    const height = this.threeContainer.clientHeight
    const aspect = width / height
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.renderer.render(this.scene, this.camera)
  }

  init3DObject() {
    // Cesium entity
    const entity = {
      name: 'Polygon',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          minWGS84[0],
          minWGS84[1],
          maxWGS84[0],
          minWGS84[1],
          maxWGS84[0],
          maxWGS84[1],
          minWGS84[0],
          maxWGS84[1],
        ]),
        material: Cesium.Color.RED.withAlpha(0.2),
      },
    }
    this.cesiumScene.viewer.entities.add(entity)

    // Three.js Objects
    // Lathe geometry
    const doubleSideMaterial = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
    })
    const segments = 10
    const points = []

    for (let i = 0; i < segments; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2))
    }

    const LatheGeometry = new THREE.LatheGeometry(points)
    const latheMesh = new THREE.Mesh(LatheGeometry, doubleSideMaterial)
    latheMesh.scale.set(1500, 1500, 1500) // scale object to be visible at planet scale
    latheMesh.position.z += 15000.0 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    latheMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
    const latheMeshYup = new THREE.Group()
    latheMeshYup.add(latheMesh)
    this.scene.add(latheMeshYup) // don’t forget to add it to the Three.js scene manually

    // Assign Three.js object mesh to our object array
    this.threeObjects.push(new ThreeObject(latheMeshYup, minWGS84, maxWGS84))

    // dodecahedron
    const DodecahedronGeometry = new THREE.DodecahedronGeometry()
    const dodecahedronMesh = new THREE.Mesh(DodecahedronGeometry, new THREE.MeshNormalMaterial())
    dodecahedronMesh.scale.set(5000, 5000, 5000) // scale object to be visible at planet scale
    dodecahedronMesh.position.z += 15000.0 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
    const dodecahedronMeshYup = new THREE.Group()
    dodecahedronMeshYup.add(dodecahedronMesh)
    this.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually

    this.threeObjects.push(new ThreeObject(dodecahedronMeshYup, minWGS84, maxWGS84))

    // console.log('🚀 ~ ThreeScene ~ init3DObject ~ this.threeObjects:', this.threeObjects)
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop()
    })
    this.cesiumScene.renderCesium()
    this.renderThreeObj()
  }
}
