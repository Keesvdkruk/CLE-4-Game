import '../css/style.css'
import { Engine, Vector, DisplayMode, SolverStrategy, Axis, BoundingBox, Actor, CollisionType, Color } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Ground } from './ground.js'
import { Platform } from './platform.js'
import { Poster } from './poster.js'
import { CameraEnemy } from './camera.js'
import { StartScene } from './scenes/startscene.js'
import { LevelOne } from './scenes/levelone.js'
import { Ironvale } from './scenes/ironvale.js'
import { IronvaleFactory } from './scenes/ironvaleFactory.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 2000)
            }
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        console.log("start de game!")
        this.addScene("start", new StartScene());
        this.addScene("levelone", new LevelOne());
        this.addScene("ironvale", new Ironvale());
        this.addScene("ironvalefactory", new IronvaleFactory());
        this.goToScene("start")
    }
}

new Game()
