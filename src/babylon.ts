import { Engine } from 'babylonjs'
import { Game } from './game'
import { newConnection } from './connection'
import { TemplateScene } from './scene'


export const babylonInit = async (): Promise<void> => {
    // get the module to load
    const createSceneModule = new TemplateScene();

    // Execute the pretasks, if defined
    // await Promise.all(createSceneModule.preTasks || [])

    const canvas = document.getElementById('webgl') as never as HTMLCanvasElement
    const engine = new Engine(canvas, true)

    const scene = await createSceneModule.createScene(engine, canvas)
    // const serverConnection = await newConnection("http://localhost:8080/ws")
    const serverConnection = null
    const game = new Game(serverConnection, scene)

    engine.runRenderLoop(function () {
        scene.render()
    })

    window.addEventListener('resize', function () {
        engine.resize()
    })

    const update = () => {
        // Update game
        game.update();
    };
    scene.onBeforeRenderObservable.add(() => update());
}

// babylonInit().then(() => {
//     // scene started rendering, everything is initialized
// })
