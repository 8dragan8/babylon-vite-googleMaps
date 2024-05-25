import {Engine, Scene, Color4, Vector3, ArcRotateCamera, MeshBuilder, HemisphericLight} from  'babylonjs'

export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>
    preTasks?: Promise<unknown>[]
}

export interface CreateSceneModule {
    default: CreateSceneClass
}

export class TemplateScene implements CreateSceneClass {

    private _scene!: Scene

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        // init the scene
        const scene = await this._initScene(engine, canvas)

        // init your asssets
        this._initAssets()

        // init YUKA AI game engine
        await this._initGame()

        // start game
        this._startGame()

        // await this._scene.debugLayer.show({
        //     overlay: true,
        // })

        return scene
    }

    // start the game
    private _startGame() {
        this._scene.onBeforeRenderObservable.add(() => {
            
        })
    }

    // BabylonJS specific - create and initialize the scene
    private async _initScene(engine: Engine, canvas: HTMLCanvasElement) {
        const scene = new Scene(engine)
        this._scene = scene

        scene.clearColor = new Color4(0, 0, 0, 1)
        scene.useRightHandedSystem = true

        MeshBuilder.CreateBox("box", {});

        //

        const camera = new ArcRotateCamera('camera', 0.9, 0.7, 9, Vector3.Zero(), scene)
        // camera.target = new Vector3(0, 0, 0)
        // camera.minZ = 0.1
        // camera.lowerRadiusLimit = 2
        // camera.upperRadiusLimit = 200
        camera.attachControl(canvas, true)


        const light = new HemisphericLight("light", new Vector3(1, 1, 0));

        //

        return scene
    }

    // init models
    private _initAssets() {
        // create/load your meshes
    }

    private async _initGame() {
        
    }
}