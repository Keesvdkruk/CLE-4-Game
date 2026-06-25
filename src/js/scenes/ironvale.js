import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Label, Font, Timer } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
import { Background } from "../background"
import { Resources } from "../resources"
import { ironvalePoster } from "../ironvalePoster"
import { ironvaleGround } from "../ironvaleGround"
import { ironvalePlatform } from "../ironvalePlatform"

export class Ironvale extends Scene {

    onInitialize(engine) {
        // Intro
        this.backgroundColor = Color.Black;

        const introBg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        introBg.graphics.use(Resources.IronvaleIntro.toSprite());
        introBg.graphics.opacity = 0;
        this.add(introBg);

        let introAlpha = 0

        const fadeInTimer = new Timer({
            interval: 50,
            repeats: true,
            fcn: () => {

                introAlpha += 0.03

                if (introAlpha >= 1) {
                    introAlpha = 1
                    fadeInTimer.cancel()
                }

                introBg.graphics.opacity = introAlpha
            }
        })

        this.add(fadeInTimer)
        fadeInTimer.start()

        const title = new Label({
            text: "",
            x: 130,
            y: 50,
            color: Color.Black,
            font: new Font({
                family: "Upheaval",
                size: 70
            })
        })

        this.add(title)

        const subtitle = new Label({
            text: "",
            x: 130,
            y: 130,
            color: Color.Black,
            font: new Font({
                family: "Upheaval",
                size: 35
            })
        })

        this.add(subtitle)

        const fullTitle = "IRONVALE"
        const fullSubtitle = "THE HEART OF INDUSTRIAL PRODUCTION"

        let titleIndex = 0
        let subtitleIndex = 0

        const introTimer = new Timer({
            interval: 80,
            repeats: true,
            fcn: () => {

                if (titleIndex < fullTitle.length) {
                    title.text = fullTitle.substring(0, titleIndex + 1)
                    titleIndex++
                }

                else if (subtitleIndex < fullSubtitle.length) {
                    subtitle.text = fullSubtitle.substring(0, subtitleIndex + 1)
                    subtitleIndex++
                }

                else {
                    introTimer.cancel()

                    setTimeout(() => {
                        title.kill()
                        subtitle.kill()
                        introBg.kill()

                        startLevel()
                    }, 2000)
                }
            }
        })

        this.add(introTimer)
        introTimer.start()

        const startLevel = () => {
            // Moving Background
            this.add(new Background(Resources.BgIronvale, 0.05, -104))
            this.add(new Background(Resources.Bg2Ironvale, 0.2, -103))
            this.add(new Background(Resources.Bg3Ironvale, 0.4, -102))
            this.add(new Background(Resources.Bg4Ironvale, 0.6, -101))

            const ground = new ironvaleGround()
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

            this.add(new ironvalePoster(400, 605))
            this.add(new ironvalePoster(1200, 605))
            this.add(new ironvalePoster(2500, 605))
            this.add(new ironvalePoster(1400, 210))

            this.add(new ironvalePlatform(600, 550, 350, 30))
            this.add(new ironvalePlatform(1000, 440, 350, 30))
            this.add(new ironvalePlatform(1200, 280, 450, 30))

            this.add(new Drone(700, 660))
            this.add(new Drone(1300, 260))

            const player = new Player()
            this.add(player)

            // Camera
            this.camera.strategy.lockToActorAxis(player, Axis.X)
            this.camera.strategy.limitCameraBounds(new BoundingBox({
                left: 0,
                top: 0,
                right: 4000,
                bottom: 720
            }))

        }

    }


}