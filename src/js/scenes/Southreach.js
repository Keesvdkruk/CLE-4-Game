import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, ScreenElement, Label, Font, FontUnit } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
import { Trader } from "../trader"
import { Background } from "../background"
import { Resources } from "../resources"
import { ChoiceNpc } from "../choicenpc"

// NIEUW: Importeer de globale game state voor de Peace meter!
import { GameState } from "../state.js" 

export class Southreach extends Scene {

    onInitialize(engine) {
        this.engine = engine

        // --- PARALLAX ACHTERGRONDEN ---
        this.add(new Background(Resources.BgSouthreach, 0.05, -104))
        this.add(new Background(Resources.BgSouthreach2, 0.2, -103))
        this.add(new Background(Resources.BgSouthreach3, 0.4, -102))
        this.add(new Background(Resources.BgSouthreach4, 0.6, -101))
        this.add(new Background(Resources.BgSouthreach5, 0.8, -100))

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

        // --- DE SPELER ---
        const player = new Player()
        player.onKnockoutComplete = () => this.restartLevel()
        this.add(player)

        // ==========================================
        // ZONE 1: De Veilige Start 
        // ==========================================
        this.add(new Poster(400, 620))
        
        const choiceNpc = new ChoiceNpc(600, 630) 
        choiceNpc.setPlayer(player)
        this.add(choiceNpc)

        // ==========================================
        // ZONE 2: De Eerste Blokkade
        // ==========================================
        this.add(new Drone(800, 630)) 
        
        this.add(new Platform(1100, 600, 40, 240)) 
        this.add(new Platform(950, 520, 150, 20))  
        this.add(new Platform(1250, 520, 150, 20)) 

        const trader = new Trader(1250, 510) 
        trader.setPlayer(player)
        this.add(trader)

        // ==========================================
        // ZONE 3: De Toren
        // ==========================================
        this.add(new Poster(1400, 620))
        this.add(new Drone(1500, 630))
        
        this.add(new Platform(1700, 550, 200, 20))
        this.add(new Platform(1950, 400, 200, 20)) 
        this.add(new Platform(1700, 250, 200, 20)) 
        
        this.add(new Poster(1700, 200)) 
        this.add(new Drone(1950, 360)) 

        // ==========================================
        // ZONE 4: Drone Alley 
        // ==========================================
        this.add(new Platform(2300, 600, 40, 240)) 
        
        this.add(new Platform(2150, 520, 100, 20)) 
        this.add(new Platform(2450, 520, 100, 20))
        
        this.add(new Poster(2600, 620))
        
        this.add(new Drone(2800, 630))
        this.add(new Drone(3100, 630))
        this.add(new Drone(3400, 630)) 

        this.add(new Poster(3600, 620))

        // ==========================================
        // HET EINDE VAN HET LEVEL
        // ==========================================
        this.add(new Platform(3800, 360, 100, 720))

        // ==========================================
        // UI LAAG VOOR DE PEACE STAT
        // ==========================================
        // Een ScreenElement blijft altijd vast op het scherm staan (negeert de camera)
        this.uiLayer = new ScreenElement({
            x: 30,
            y: 30,
            z: 9999 // Zorg dat het altijd bovenop je achtergronden en speler ligt
        })

        this.peaceLabel = new Label({
            text: "Peace: " + GameState.peace + "%",
            color: Color.White,
            font: new Font({
                family: 'MijnPixelFont', 
                size: 30,
                unit: FontUnit.Px
            })
        })
        
        this.uiLayer.addChild(this.peaceLabel)
        this.add(this.uiLayer)

        // --- CAMERA SETTINGS ---
        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000,
            bottom: 720
        }))
    }

    // Deze functie wordt elke frame aangeroepen door Excalibur
    onPreUpdate() {
        // Zorg dat het getal op het scherm live wordt geüpdatet als je een poster sloopt
        if (this.peaceLabel) {
            this.peaceLabel.text = "Peace: " + GameState.peace + "%"
        }
    }

    restartLevel() {
        this.clear()
        this.camera.clearAllStrategies()
        this.onInitialize(this.engine)
    }
}