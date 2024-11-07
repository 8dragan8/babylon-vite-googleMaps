import type { Tile3D } from '@loaders.gl/tiles'
import { ArcRotateCamera, Engine, Scene, SceneLoader, Vector3 } from '@babylonjs/core'
import { WebMercatorViewport } from '@deck.gl/core'
import { Tiles3DLoader } from '@loaders.gl/3d-tiles'
import { load } from '@loaders.gl/core'
import { Tileset3D } from '@loaders.gl/tiles'
import '@babylonjs/loaders/glTF'

// const tilesetUrl = 'https://assets.cesium.ion.com/43978/tileset.json'
const googleAPIKey = 'AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4'
const googleAPIurl = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleAPIKey}`

// const tilesetJson = await load(tilesetUrl, Tiles3DLoader)

// if your tileset file doesn't have the .json extension, set `3d-tiles.isTileset` to true
const tilesetJson = await load(googleAPIurl, Tiles3DLoader, { '3d-tiles': { isTileset: true } })
// console.log('🚀 ~ tilesetJson:', tilesetJson)

const tileset3d = new Tileset3D(tilesetJson, { throttleRequests: false })
console.log('🚀 ~ tileset3d:', tileset3d)

const viewport = new WebMercatorViewport({
  width: 600,
  height: 400,
  latitude: 40.7067584,
  longitude: -74.0115413,
  zoom: 17,

})
tileset3d.selectTiles(viewport)

// // visible tiles
// // Note that visibleTiles will likely not immediately include all tiles
// // tiles will keep loading and file `onTileLoad` callbacks

// // To fully load all tiles in a given view, repeatedly select tiles until the tileset is loaded
while (!tileset3d.isLoaded()) {
  await tileset3d.selectTiles(viewport)
}
const visibleTiles = (tileset3d.tiles as Tile3D[]).filter(tile => tile.selected)

console.log('🚀 ~ visibleTiles:', visibleTiles)

const canvas = document.getElementById('webgl') as HTMLCanvasElement
const engine = new Engine(canvas, true)
const scene = new Scene(engine)
const camera = new ArcRotateCamera('camera', 0.9, 0.7, 9, Vector3.Zero(), scene)

visibleTiles.forEach(async (tile) => {
  await loadGltf(tile.content.gltf)
})

camera.attachControl(canvas, true)

engine.runRenderLoop(() => {
  scene.render()
})

// async function loadModel(tileUrl: string) {
// //   const tileUrl = '/tiles/tileset.json'
//   const tilesetJson = await load(tileUrl, Tiles3DLoader)

//   const tileset3d = new Tileset3D(tilesetJson, {
//     // onTileLoad: tile => console.log(tile, 99)
//   })

//   const loaderTiles = async (modelList) => {
//     if (Array.isArray(modelList)) {
//       for (const item of modelList) {
//         if (item?.contentUrl) {
//           const tiles = await load(item.contentUrl, Tiles3DLoader, {
//             '3d-tiles': { isTileset: true },
//             // 'decompress': true,
//             // 'gltf': { postProcess: false, decompressMeshes: false },
//           })

//           if (tiles.type === 'cmpt') {
//             for (const t of tiles.tiles) {
//               await loadGltf(t.gltf)
//             }
//           }
//           else if (tiles.type === 'b3dm') {
//             await loadGltf(tiles.gltf)
//           }
//           // Other formats such as i3dm are loaded using the same method,
//         }

//         if (Array.isArray(item?.children)) {
//           loaderTiles(item?.children)
//         }
//       }
//     }
//   }

//   loaderTiles(tileset3d.root.children)
// }

async function loadGltf(gltf) {
  try {
    const file = new File([gltf.buffers[0].arrayBuffer], 'file.gltf')
    await SceneLoader.AppendAsync('', gltf, scene)
    engine.hideLoadingUI()
  }
  catch (error) {
    console.log(error)
  }
}

// loadModel(googleAPIurl)
