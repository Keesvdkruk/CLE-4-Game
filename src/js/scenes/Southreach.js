import { Actor, Color, CollisionType, Axis, BoundingBox, Scene } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
import { Trader } from "../trader"
// NIEUW: Importeer Background en Resources
import { Background } from "../background"
import { Resources } from "../resources"
import { ChoiceNpc } from "../choicenpc"

export class Southreach extends Scene {

    onInitialize(engine) {
        this.engine = engine

        // --- PARALLAX ACHTERGRONDEN ---
        // Volgorde is belangrijk: (Afbeelding, Snelheid, z-index)
        // Hoe lager de z-index, hoe verder naar achteren.
        // Hoe lager de snelheid (bijv 0.1), hoe trager hij beweegt (ver weg).
        
        // Laag 1: De oranje lucht (beweegt bijna niet)
        this.add(new Background(Resources.BgSouthreach, 0.05, -104))
        
        // Laag 2: Verste gebouwen
        this.add(new Background(Resources.BgSouthreach2, 0.2, -103))
        
        // Laag 3: Middelste gebouwen
        this.add(new Background(Resources.BgSouthreach3, 0.4, -102))
        
        // Laag 4: Voorste machinerie (beweegt het snelst, maar nog steeds trager dan de speler)
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

        this.add(new Poster(500, 620))
        this.add(new Poster(1200, 620))
        this.add(new Poster(2500, 620))
        this.add(new Poster(1400, 220))

        this.add(new Platform(600, 550, 200, 30))
        this.add(new Platform(1000, 450, 200, 30))
        this.add(new Platform(1400, 300, 300, 30))

        const player = new Player()
        player.onKnockoutComplete = () => this.restartLevel()
        this.add(player)

        const trader = new Trader(1000, 435)
        trader.setPlayer(player)
        this.add(trader)

        const choiceNpc = new ChoiceNpc(600, 535)
        choiceNpc.setPlayer(player)
        this.add(choiceNpc)

        this.add(new Drone(700, 630))
        this.add(new Drone(1300, 260))

        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000,
            bottom: 720
        }))

    }

    restartLevel() {
        this.clear()
        
        this.camera.clearAllStrategies()
        
        this.onInitialize(this.engine)
    }
}