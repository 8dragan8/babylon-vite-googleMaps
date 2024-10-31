import * as Cesium from 'cesium';

export default class CesiumScene {
  viewer!:  Cesium.Viewer
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
  initCesium() {
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
