import * as Cesium from "cesium";
import * as BABYLON from 'babylonjs'


const canvas = document.querySelector("#webgl") as never as HTMLCanvasElement;
const LNG = -122.4175, LAT = 37.655;

const googleAPIurl = "https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4"


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
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            // imageryProvider: true,
            baseLayerPicker: false,
            requestRenderMode: false,
        });

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
        const  terrainProvider = await Cesium.createWorldTerrainAsync()

        this.viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider,
            useDefaultRenderLoop: false
        });


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
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);

        this.root_node = new BABYLON.TransformNode("BaseNode", scene);
        this.root_node.lookAt(this.base_point_up.subtract(this.base_point));
        this.root_node.addRotation(Math.PI / 2, 0, 0);

        // this.root_node.position = new BABYLON.Vector3(0, 0, 0);
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
        let fov = Cesium.Math.toDegrees((this.viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy || 45)
        this.camera.fov = fov / 180 * Math.PI;

        let civm = this.viewer.camera.inverseViewMatrix;
        let camera_matrix = BABYLON.Matrix.FromValues(
            civm[0], civm[1], civm[2], civm[3],
            civm[4], civm[5], civm[6], civm[7],
            civm[8], civm[9], civm[10], civm[11],
            civm[12], civm[13], civm[14], civm[15]
        );

        let scaling = BABYLON.Vector3.Zero(), rotation = BABYLON.Quaternion.Zero(), transform = BABYLON.Vector3.Zero();
        camera_matrix.decompose(scaling, rotation, transform);
        let camera_pos = this.cart2vec(new Cesium.Cartesian3(transform.x, transform.y, transform.z)),
            camera_direction = this.cart2vec(this.viewer.camera.direction),
            camera_up = this.cart2vec(this.viewer.camera.up);

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
}
