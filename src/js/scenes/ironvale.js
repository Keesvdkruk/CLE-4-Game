import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Label, Font, Timer, Vector } from "excalibur"
import { Player } from "../player"
import { Background } from "../background"
import { Resources } from "../resources"
import { ironvalePoster } from "../ironvalePoster"
import { ironvaleGround } from "../ironvaleGround"
import { ironvalePlatform } from "../ironvalePlatform"
import { WorkerNpc } from "../worker"
import { IronvaleDrone } from "../ironvaleDrone"
import { MovingPlatform } from "../movingPlatform"
import { Spike } from "../spike"

export class Ironvale extends Scene {

    objective
    workersSpoken = 0
    canLeave = false

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
            color: Color.White,
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
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 35
            })
        })
        this.add(subtitle)

        const fullTitle = "IRONVALE"
        const fullSubtitle = "HET HART VAN DE INDUSTRIËLE PRODUCTIE..."

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
            // Objective
            this.objective = new Label({
                text: "Haal informatie op bij arbeiders (0/3)",
                x: 40,
                y: 40,
                color: Color.White,
                font: new Font({
                    family: "MijnPixelFont",
                    size: 24
                })
            })
            this.objective.z = 100
            this.add(this.objective)

            // Moving Background
            const ironvaleBg = new Actor({
                x: 0,
                y: 0,
            })
            ironvaleBg.z = -10
            ironvaleBg.anchor = new Vector(0, 0)
            ironvaleBg.graphics.use(Resources.BgIronvale.toSprite())

            this.add(ironvaleBg)

            // Level Borders
            const leftBorder = new Actor({
                x: -25,
                y: 360,
                width: 50,
                height: 720,
                collisionType: CollisionType.Fixed
            })
            this.add(leftBorder)

            const rightBorder = new Actor({
                x: 2180,
                y: 360,
                width: 40,
                height: 720,
                collisionType: CollisionType.Fixed
            });
            this.add(rightBorder);

            // Platform Opstelling
            this.add(new ironvalePlatform(0, 440, 240, 20))

            this.add(new ironvalePlatform(0, 660, 620, 20))

            this.add(new ironvalePlatform(270, 440, 160, 20))

            this.add(new ironvalePlatform(400, 530, 130, 20))

            this.add(new ironvalePlatform(580, 400, 230, 20))

            this.add(new ironvalePlatform(810, 310, 150, 20))

            this.add(new ironvalePlatform(810, 530, 470, 20))

            this.add(new ironvalePlatform(1010, 330, 220, 20))

            this.add(new ironvalePlatform(1290, 360, 100, 20))

            this.add(new ironvalePlatform(1430, 580, 80, 20))

            this.add(new ironvalePlatform(1550, 550, 170, 20))

            this.add(new ironvalePlatform(1480, 470, 130, 20))

            this.add(new ironvalePlatform(1550, 750, 150, 20))

            this.add(new ironvalePlatform(1680, 450, 70, 20))

            this.add(new ironvalePlatform(1880, 450, 300, 20))

            this.add(new ironvalePlatform(1760, 400, 100, 20))

            this.add(new ironvalePlatform(1670, 680, 330, 20))

            this.add(new ironvalePlatform(2000, 290, 200, 20))

            this.add(new ironvalePlatform(1390, 240, 70, 20))


            // Spikes
            const addSpikeRow = (startX, y, amount) => {
                for (let i = 0; i < amount; i++) {
                    this.add(new Spike(
                        startX + (i * 25),
                        y
                    ))
                }
            }

            addSpikeRow(570, 620, 4)
            addSpikeRow(690, 550, 3)
            addSpikeRow(1250, 650, 7)
            addSpikeRow(1500, 470, 5)

            // Player
            const player = new Player()
            player.pos = new Vector(0, 430)
            player.name = "player"
            player.onKnockoutComplete = () => this.restartLevel()
            this.add(player)

            // Workers
            // 1
            const worker1 = new WorkerNpc(
                870,
                310,
                "We werken 14 uur per dag voor lage lonen..."
            )

            const worker2 = new WorkerNpc(
                1730,
                680,
                "Er wordt niet geluisterd naar onze klachten..."
            )

            const worker3 = new WorkerNpc(
                2050,
                290,
                "De regering is tegen ons..."
            )

            worker1.setPlayer(player)
            worker2.setPlayer(player)
            worker3.setPlayer(player)

            worker1.onConversationComplete = () => this.workerTalkedTo()
            worker2.onConversationComplete = () => this.workerTalkedTo()
            worker3.onConversationComplete = () => this.workerTalkedTo()

            this.add(worker1)
            this.add(worker2)
            this.add(worker3)

            // Camera
            this.camera.strategy.lockToActorAxis(player, Axis.X)
            this.camera.strategy.limitCameraBounds(new BoundingBox({
                left: 0,
                top: 0,
                right: 2170,
                bottom: 720
            }))

            const exitTrigger = new Actor({
                x: 2140,
                y: 360,
                width: 50,
                height: 720,
                collisionType: CollisionType.Passive
            })
            this.add(exitTrigger)

            exitTrigger.on("collisionstart", (event) => {

                if (
                    event.other.owner?.name === "player" &&
                    this.canLeave
                ) {
                    this.engine.goToScene("ironvalefactory")
                }
            })
        }
    }

    onPreUpdate() {
        if (this.objective) {
            this.objective.pos.x = Math.round(this.camera.pos.x - 600)
            this.objective.pos.y = Math.round(this.camera.pos.y - 320)
        }
    }

    workerTalkedTo() {
        this.workersSpoken++
        this.objective.text =
            `Haal informatie op bij arbeiders (${this.workersSpoken}/3)`

        if (this.workersSpoken >= 3) {
            this.canLeave = true
            this.objective.text =
                "Alle informatie verzameld, ga de fabriek binnen."
        }
    }

    restartLevel() {

        this.workersSpoken = 0
        this.canLeave = false

        this.clear()
        this.camera.clearAllStrategies()

        this.onInitialize(this.engine)
    }
}