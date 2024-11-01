import * as Cesium from "cesium";
import * as BABYLON from 'babylonjs'


const canvas = document.querySelector("#webgl") as never as HTMLCanvasElement;
const LNG = -122.4175, LAT = 37.655;

const googleAPIurl = "https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4"

const options: Cesium.Viewer.ConstructorOptions = {
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
    mapProjection: new Cesium.WebMercatorProjection(),
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
}
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjhlZWFhZi0xZjVhLTQ1MDktOGI2MS1hYWJmMTYxMGQ0MDciLCJpZCI6MTA0Nzk1LCJpYXQiOjE2NjA1NzQwNTh9.2qUxvkUtmh_LBBDqvJXeaGJ0S27B-DsPNFk3SteOeeg'

export default class CesiumScene {

    viewer!: Cesium.Viewer;
    base_point!: BABYLON.Vector3;
    base_point_up!: BABYLON.Vector3;
    root_node!: BABYLON.TransformNode;
    camera!: BABYLON.FreeCamera;
    scene!: BABYLON.Scene;

    engine!: BABYLON.Engine;

    constructor() {
        this.initCesium().then(() => {

            this.initBabylon();
            this.engine.runRenderLoop(() => {
                this.viewer.render();
                this.moveBabylonCamera();
                this.scene.render();
            });
        });


    }



    async initCesium3D() {
        this.viewer = new Cesium.Viewer('cesiumContainer', options);

        try {
            const tileset = await Cesium.Cesium3DTileset.fromUrl(googleAPIurl);
            this.viewer.scene.primitives.add(tileset);
        } catch (error) {
            console.error(`Error creating tileset: ${error}`);
        }



        this.viewer.scene.globe.show = false;

        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 300),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
            }
        });

        this.base_point = this.cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 50));
        this.base_point_up = this.cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 300));
    }

    async initCesium() {
        // const terrainProvider = await Cesium.createWorldTerrainAsync()

        this.viewer = new Cesium.Viewer('cesiumContainer', options);


        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 300),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
            }
        });

        this.base_point = this.cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 50));
        this.base_point_up = this.cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 300));
    }

    initBabylon() {
        const engine = new BABYLON.Engine(canvas, true, {
            useHighPrecisionFloats: true,
            useHighPrecisionMatrix: true
        });
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);

        this.root_node = new BABYLON.TransformNode("BaseNode", scene);
        this.root_node.lookAt(this.base_point_up.subtract(this.base_point));
        this.root_node.addRotation(Math.PI / 2, 0, 0);

        this.root_node.position = new BABYLON.Vector3(0, 0, -100);
        const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 }, scene);
        const material = new BABYLON.StandardMaterial("Material", scene);
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        material.alpha = 0.5;
        box.material = material;
        box.parent = this.root_node;

        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: 100,
            height: 100
        }, scene);
        ground.material = material;
        ground.parent = this.root_node;

        this.engine = engine;
        this.scene = scene;
        this.camera = camera;

        this.scene.debugLayer.show({
            overlay: true,
        })
    }

    moveBabylonCamera() {
        let fov = Cesium.Math.toDegrees((this.viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy || 1)
        this.camera.fov = fov / 180 * Math.PI;

        let civm = this.viewer.camera.inverseViewMatrix.clone();
        let camera_matrix = BABYLON.Matrix.FromValues(
            civm[0], civm[1], civm[2], civm[3],
            civm[4], civm[5], civm[6], civm[7],
            civm[8], civm[9], civm[10], civm[11],
            civm[12], civm[13], civm[14], civm[15]
        );

        let scaling = BABYLON.Vector3.Zero()
        let rotation = BABYLON.Quaternion.Zero()
        let transform = BABYLON.Vector3.Zero();

        camera_matrix.decompose(scaling, rotation, transform);

        let camera_pos = this.cart2vec(new Cesium.Cartesian3(transform.x, transform.y, transform.z))
        let camera_direction = this.cart2vec(this.viewer.camera.direction)
        let camera_up = this.cart2vec(this.viewer.camera.up)

        let rotation_y = Math.atan(camera_direction.z / camera_direction.x);

        if (camera_direction.x < 0) rotation_y += Math.PI;

        rotation_y = Math.PI / 2 - rotation_y;

        let rotation_x = Math.asin(-camera_direction.y);
        let camera_up_before_rotatez = new BABYLON.Vector3(-Math.cos(rotation_y), 0, Math.sin(rotation_y));
        let rotation_z = Math.acos(camera_up.x * camera_up_before_rotatez.x + camera_up.y * camera_up_before_rotatez.y + camera_up.z * camera_up_before_rotatez.z);

        rotation_z = Math.PI / 2 - rotation_z;

        if (camera_up.y < 0) rotation_z = Math.PI - rotation_z;

        this.camera.position.x = camera_pos.x - this.base_point.x;
        this.camera.position.y = camera_pos.y - this.base_point.y;
        this.camera.position.z = camera_pos.z - this.base_point.z;
        this.camera.rotation.x = rotation_x;
        this.camera.rotation.y = rotation_y;
        this.camera.rotation.z = rotation_z;
    }

    cart2vec(cart: Cesium.Cartesian3): BABYLON.Vector3 {
        return new BABYLON.Vector3(cart.x, cart.z, cart.y);
    }

    multiply(mat1: any, mat2: number[], result: any): number[] {
        const m = mat1
        const otherM = mat2
        const offset = 0
        const tm0 = m[0]; const tm1 = m[1]; const tm2 = m[2]; const tm3 = m[3]
        const tm4 = m[4]; const tm5 = m[5]; const tm6 = m[6]; const tm7 = m[7]
        const tm8 = m[8]; const tm9 = m[9]; const tm10 = m[10]; const tm11 = m[11]
        const tm12 = m[12]; const tm13 = m[13]; const tm14 = m[14]; const tm15 = m[15]

        const om0 = otherM[0]; const om1 = otherM[1]; const om2 = otherM[2]; const om3 = otherM[3]
        const om4 = otherM[4]; const om5 = otherM[5]; const om6 = otherM[6]; const om7 = otherM[7]
        const om8 = otherM[8]; const om9 = otherM[9]; const om10 = otherM[10]; const om11 = otherM[11]
        const om12 = otherM[12]; const om13 = otherM[13]; const om14 = otherM[14]; const om15 = otherM[15]

        result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12
        result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13
        result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14
        result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15

        result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12
        result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13
        result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14
        result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15

        result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12
        result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13
        result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14
        result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15

        result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12
        result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13
        result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14
        result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15
        return result
    }
}
