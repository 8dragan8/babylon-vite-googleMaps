import * as Cesium from 'cesium';

const googleAPIurl = "https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4"


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjhlZWFhZi0xZjVhLTQ1MDktOGI2MS1hYWJmMTYxMGQ0MDciLCJpZCI6MTA0Nzk1LCJpYXQiOjE2NjA1NzQwNTh9.2qUxvkUtmh_LBBDqvJXeaGJ0S27B-DsPNFk3SteOeeg'


export default class CesiumScene {
  viewer!: Cesium.Viewer
  minWGS84: [number, number]
  maxWGS84: [number, number]
  loadingIndicator: HTMLDivElement
  cesiumContainer: HTMLDivElement

  constructor(minWGS84: [number, number], maxWGS84: [number, number]) {
    this.minWGS84 = minWGS84
    this.maxWGS84 = maxWGS84
    this.loadingIndicator = document.getElementById('loadingIndicator') as HTMLDivElement;
    this.loadingIndicator.style.display = 'none';
    this.cesiumContainer = document.getElementById("cesiumContainer") as HTMLDivElement;
  }
  async initCesium() {
    this.viewer = new Cesium.Viewer(this.cesiumContainer, {
      useDefaultRenderLoop: false,
      selectionIndicator: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      navigationInstructionsInitiallyVisible: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      // allowTextureFilterAnisotropic: false,
      contextOptions: {
        webgl: {
          alpha: false,
          antialias: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
          depth: true,
          stencil: false,
        },
      },
      targetFrameRate: 60,
      // resolutionScale: 0.1,
      orderIndependentTranslucency: true,
      // imageryProvider: undefined,
      baseLayerPicker: false,
      geocoder: false,
      automaticallyTrackDataSourceClocks: false,
      // clock: null,
      terrainShadows: Cesium.ShadowMode.DISABLED
    });

    // try {
    //   const tileset = await Cesium.Cesium3DTileset.fromUrl(googleAPIurl);
    //   this.viewer.scene.primitives.add(tileset);
    // } catch (error) {
    //   console.error(`Error creating tileset: ${error}`);
    // }

    let center = Cesium.Cartesian3.fromDegrees(
      (this.minWGS84[0] + this.maxWGS84[0]) / 2,
      ((this.minWGS84[1] + this.maxWGS84[1]) / 2) - 1,
      200000
    );
    this.viewer.camera.flyTo({
      destination: center,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-60),
        roll: Cesium.Math.toRadians(0)
      },
      duration: 3
    });
  }
  renderCesium() {
    this.viewer?.render();
  }

};
