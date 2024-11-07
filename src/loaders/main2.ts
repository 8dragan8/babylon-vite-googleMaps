import { WebMercatorViewport } from '@deck.gl/core'
import { CesiumIonLoader } from '@loaders.gl/3d-tiles'
import { load } from '@loaders.gl/core'

const tilesetUrl = 'https://assets.ion.cesium.com/69380/tileset.json'
const ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjhlZWFhZi0xZjVhLTQ1MDktOGI2MS1hYWJmMTYxMGQ0MDciLCJpZCI6MTA0Nzk1LCJpYXQiOjE2NjA1NzQwNTh9.2qUxvkUtmh_LBBDqvJXeaGJ0S27B-DsPNFk3SteOeeg'

const options = { ion: { loadGLTF: true } }
// resolve the authorizations used for requesting tiles from Cesium ion server
const metadata = CesiumIonLoader.preload(tilesetUrl, { accessToken: ION_ACCESS_TOKEN })
console.log(metadata)

// const tilesetJson = await load(tilesetUrl, CesiumIonLoader, { ...options, ...metadata })

// If your tileset doesn't have .json extension, set options['cesium-ion'].isTileset to true
const tilesetJson = await load(tilesetUrl, CesiumIonLoader, {
  ...options,
  ...metadata,
  isTileset: true,
})

const viewport = new WebMercatorViewport({ latitude, longitude, zoom })
tileset3d.selectTiles(viewport)

// visible tiles
const visibleTiles = tileset3d.tiles.filter(tile => tile.selected)
