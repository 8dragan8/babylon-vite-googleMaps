import { Scene } from "babylonjs";
import { ServerConnection } from "./connection";


export class Game {

    constructor(
        private readonly _serverConnection: ServerConnection,
        private readonly _scene: Scene
    ) {
    
        this._serverConnection.onDisconnect(() => this.handleDisconnect());
        this._serverConnection.onSceneMessage((data) => this.handleSceneMsg(data));

        this._serverConnection.ok()
    }

    public sendClientState() {
        
    }

    public update() {
        
    }

    private handleDisconnect() {
        
    }

    private handleSceneMsg(data: any) {
        console.log(data)
    }
}