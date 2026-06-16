import '../css/style.css'
import { Engine, Vector, DisplayMode, SolverStrategy, Axis, BoundingBox, Actor, CollisionType, Color } from "excalibur" 
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Ground } from './ground.js'
import { Platform } from './platform.js'
import { Poster } from './poster.js'
import { CameraEnemy } from './camera.js'

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

        this.start(ResourceLoader).then(() => {
            this.toggleDebug() 
            this.startGame()
        })
    }

    startGame() {
        console.log("start de game!")
        
        const ground = new Ground()
        this.add(ground)

        const leftWall = new Actor({
            x: -25,          
            y: 360,          
            width: 50,
            height: 720,     
            color: Color.Transparent, 
            collisionType: CollisionType.Fixed 
        })
        this.add(leftWall)

        this.add(new Poster(500, 620))
        this.add(new Poster(1200, 620))
        this.add(new Poster(2500, 620))
        this.add(new Poster(1400, 220))

        this.add(new Platform(600, 550, 200, 30))
        this.add(new Platform(1000, 450, 200, 30))
        this.add(new Platform(1400, 300, 300, 30))

        this.add(new CameraEnemy(700, 660))
        
        this.add(new CameraEnemy(1300, 260))

        const player = new Player()
        this.add(player)

        this.currentScene.camera.strategy.lockToActorAxis(player, Axis.X)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000, 
            bottom: 720
        }))
    }
}

new Game()