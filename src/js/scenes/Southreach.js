import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector, Keys, Label, Font, FontUnit } from "excalibur"
import { Drone } from "../drone"
import { Player } from "../player"
import { Poster } from "../poster"
import { Trader } from "../trader"
import { ChoiceNpc } from "../choicenpc"
import { Resources } from "../resources"
import { GameState } from "../state.js" 
import { HUD } from "../hud.js" 
import { OneWayPlatform } from "../OneWayPlatform.js" 

export class Southreach extends Scene {

    onActivate(context) {
        GameState.saveCheckpoint()
        this.isAtExit = false // Reset de exit status bij het starten
    }

    onInitialize(engine) {
        this.engine = engine

        const levelImage = new Actor({
            x: 0,
            y: 0,
            z: -100, // Zorgt dat de afbeelding helemaal achteraan wordt getekend
            anchor: Vector.Zero, 
            width: 2167,
            height: 726,
            collisionType: CollisionType.Prevent
        })

        levelImage.graphics.use(Resources.BgSouthreach1.toSprite())
        this.add(levelImage)

        // ==========================================
        // HARDE PLATFORMEN
        // ==========================================

        this.createPlatform(0, 635, 2167, 100)
        this.createPlatform(-50, 0, 50, 726)

        // ==========================================
        // SPELER
        // ==========================================

        const player = new Player()
        player.pos = new Vector(100, 500)
        player.previousBottom = player.pos.y
        player.onKnockoutComplete = () => this.restartLevel()
        this.add(player)

       // ==========================================
        // DE EXIT (Rechtemuur & Trigger)
        // ==========================================

        // 1. De harde muur (zodat je niet uit de map valt)
        const rightWall = new Actor({
            x: 2167,
            y: 0,
            width: 50,
            height: 726,
            anchor: Vector.Zero,
            collisionType: CollisionType.Fixed,
            color: Color.Transparent, 
            z: 10
        })
        this.add(rightWall)

        // 2. De onzichtbare "Exit Zone" (40 pixels voor de muur)
        const exitTrigger = new Actor({
            x: 2127, // Start 40 pixels eerder dan de echte muur
            y: 0,
            width: 40,
            height: 726,
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive, // Passive betekent dat je erin kunt staan!
            color: Color.Transparent
        })
        this.add(exitTrigger)

        // Maak het label aan (standaard leeg)
        this.exitLabel = new Label({
            text: "", 
            color: Color.White,
            x: 1850, 
            y: 500,  
            font: new Font({
                family: 'MijnPixelFont', 
                size: 20,
                unit: FontUnit.Px
            }),
            z: 1000
        })
        this.add(this.exitLabel)

        // Koppel de logica nu aan de Trigger Zone in plaats van de harde muur!
        exitTrigger.on('collisionstart', (evt) => {
            if (evt.other.owner === player) {
                this.isAtExit = true
                this.exitLabel.text = "press x to go to the next level"
            }
        })

        exitTrigger.on('collisionend', (evt) => {
            if (evt.other.owner === player) {
                this.isAtExit = false
                this.exitLabel.text = ""
            }
        })
        
        this.add(rightWall)

        // ==========================================
        // ONE-WAY PLATFORMEN
        // ==========================================

        this.createOneWayPlatform(0, 195, 315, 10, player)
        this.createOneWayPlatform(290, 340, 130, 15, player)
        this.createOneWayPlatform(75, 443, 265, 15, player)
        
        this.createOneWayPlatform(540, 120, 190, 10, player)
        this.createOneWayPlatform(710, 130, 60, 10, player)
        this.createOneWayPlatform(430, 215, 190, 10, player)
        this.createOneWayPlatform(550, 325, 200, 10, player)
        this.createOneWayPlatform(440, 365, 110, 10, player)
        this.createOneWayPlatform(390, 505, 380, 15, player)
        
        this.createOneWayPlatform(1030, 72, 230, 10, player)
        this.createOneWayPlatform(1085, 172, 85, 10, player)
        this.createOneWayPlatform(1200, 190, 180, 10, player)
        this.createOneWayPlatform(900, 230, 185, 10, player)
        this.createOneWayPlatform(1085, 295, 100, 10, player)
        this.createOneWayPlatform(820, 390, 155, 15, player)
        this.createOneWayPlatform(1090, 420, 275, 15, player)
        this.createOneWayPlatform(840, 487, 240, 10, player)
        
        this.createOneWayPlatform(1280, 300, 160, 15, player)

        this.createOneWayPlatform(1465, 195, 100, 10, player)
        this.createOneWayPlatform(1460, 285, 135, 15, player)
        this.createOneWayPlatform(1410, 435, 190, 10, player)

        this.createOneWayPlatform(1800, 480, 130, 10, player)
        this.createOneWayPlatform(2080, 510, 100, 15, player)

        // ==========================================
        // NPCS & OBSTAKELS
        // ==========================================

        // posters met specifieke maten en afbeeldingsbron
        this.add(new Poster(440, 570, 52, 41, Resources.PropagandaPoster))
        this.add(new Poster(720, 570, 52, 41, Resources.PropagandaPoster))
        this.add(new Poster(536, 447, 127, 66, Resources.PropagandaPoster))
        this.add(new Poster(960, 322, 54, 75, Resources.PropagandaPoster2))
        this.add(new Poster(952, 562, 59, 69, Resources.PropagandaPoster2))
        this.add(new Poster(1353, 562, 65, 69, Resources.PropagandaPoster3))
        this.add(new Poster(1520, 370, 60, 62, Resources.PropagandaPoster3))

        const choiceNpc = new ChoiceNpc(600, 635)
        choiceNpc.setPlayer(player)
        this.add(choiceNpc)

        this.add(new Drone(800, 600))

        const trader = new Trader(670, 121)
        trader.setPlayer(player)
        this.add(trader)

        this.add(new Drone(1400, 400))

        // ==========================================
        // UI & CAMERA
        // ==========================================

        this.add(new HUD())

        this.camera.strategy.lockToActorAxis(player, Axis.X)

        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 2167,
            bottom: 726
        }))
    }

    onPreUpdate(engine) {
        // Controleer of de speler bij de muur staat en op X drukt
        if (this.isAtExit && engine.input.keyboard.wasPressed(Keys.X)) {
            console.log("Naar het volgende level!")
            engine.goToScene("ironvale") 
        }
    }

    createPlatform(x, y, breedte, hoogte) {
        const platform = new Actor({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            anchor: Vector.Zero, 
            collisionType: CollisionType.Fixed,
            color: Color.Transparent,
            z: 10 
        })

        this.add(platform)
    }

    createOneWayPlatform(x, y, breedte, hoogte, player) {
        const platform = new OneWayPlatform(x, y, breedte, hoogte)

        this.add(platform)
        player.addOneWayPlatform(platform)
    }

    restartLevel() {
        GameState.revertToCheckpoint()

        this.clear()
        this.camera.clearAllStrategies()
        this.onInitialize(this.engine)
    }
}