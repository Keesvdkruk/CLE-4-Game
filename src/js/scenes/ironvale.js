import { Actor, Color, CollisionType, Axis, BoundingBox, Scene } from "excalibur"
import { CameraEnemy } from "../camera"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
// NIEUW: Importeer Background en Resources
import { Background } from "../background"
import { Resources } from "../resources"

export class Ironvale extends Scene {

    onInitialize(engine) {

        // --- PARALLAX ACHTERGRONDEN ---
        // Volgorde is belangrijk: (Afbeelding, Snelheid, z-index)
        // Hoe lager de z-index, hoe verder naar achteren.
        // Hoe lager de snelheid (bijv 0.1), hoe trager hij beweegt (ver weg).
        
        // Laag 1: De oranje lucht (beweegt bijna niet)
        this.add(new Background(Resources.Bg1, 0.05, -104))
        
        // Laag 2: Verste gebouwen
        this.add(new Background(Resources.Bg2, 0.2, -103))
        
        // Laag 3: Middelste gebouwen
        this.add(new Background(Resources.Bg3, 0.4, -102))
        
        // Laag 4: Voorste machinerie (beweegt het snelst, maar nog steeds trager dan de speler)
        this.add(new Background(Resources.Bg4, 0.6, -101))


        // --- DE REST VAN JE LEVEL ---
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


        this.add(new CameraEnemy(700, 660))
        this.add(new CameraEnemy(1300, 260))

        const player = new Player()
        this.add(player)

        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000,
            bottom: 720
        }))

    }
}