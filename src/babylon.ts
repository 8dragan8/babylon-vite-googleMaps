import { Engine } from 'babylonjs'
import { Game } from './game'
// import { newConnection } from './connection'
import { TemplateScene } from './scene'
import { TilesResponse } from '/@/tilesresponce'
import { TilesSessionType } from '/@/tilesresponce-2'


export const babylonInit = async (): Promise<void> => {
    // get the module to load
    const createSceneModule = new TemplateScene();

    // Execute the pretasks, if defined
    // await Promise.all(createSceneModule.preTasks || [])

    const response = await (await fetch('https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4')).json() as TilesResponse
    console.log("🚀 ~ babylonInit ~ response:", response.root.children[0].children[0].content)

    const tilesURL = 'https://tile.googleapis.com' + response.root.children[0].children[0].content.uri + '&key=AIzaSyBxJ2n9B9AAjyFXdoIg1O8Akm0P4HTXx_4'
    const tileset = await (await fetch(tilesURL)).json() as TilesSessionType
    console.log("🚀 ~ babylonInit ~ tileset:", tileset)

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
