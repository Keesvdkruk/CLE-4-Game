import '../css/style.css'
import { Engine, Vector, DisplayMode, SolverStrategy } from "excalibur"
import { ResourceLoader } from './resources.js'

import { StartScene } from './scenes/startscene.js'
import { Southreach } from './scenes/Southreach.js'
import { Ironvale } from './scenes/ironvale.js'
import { Eastwatch } from './scenes/eastwatch.js'
import { EastwatchInside } from './scenes/EastwatchInside.js'
import { IronvaleFactory } from './scenes/ironvaleFactory.js'
import { VestraCity } from './scenes/vestracity.js'
import { GameOver } from './scenes/gameover.js'
import { VestraCityInside } from './scenes/vestracityinside.js'
import { RoadToSquare } from './scenes/roadtosquare.js'
import { PeacefulRoadToSquare } from './scenes/peacefulroadtosquare.js'
import { Square } from './scenes/square.js'
import { ViolenceSquare } from './scenes/violencesquare.js'
import { GameState } from "./state.js";

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
      
         GameState.resetAll();
        console.log("start de game!")

        this.addScene("start", new StartScene())
        this.addScene("southreach", new Southreach())
        this.addScene("ironvale", new Ironvale())
        this.addScene("ironvalefactory", new IronvaleFactory())
        this.addScene("eastwatch", new Eastwatch())
        this.addScene("vestracity", new VestraCity())
        this.addScene("gameover", new GameOver())
        this.addScene("vestracityinside", new VestraCityInside())
        this.addScene("roadtosquare", new RoadToSquare())
        this.addScene("peacefulroadtosquare", new PeacefulRoadToSquare())
        this.addScene("square", new Square())
        this.addScene("violencesquare", new ViolenceSquare())

        this.lastScene = "start";
        this.goToScene("start");
    }
}

new Game()