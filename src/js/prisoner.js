import {
    Actor,
    CollisionType,
    Color,
    Font,
    FontUnit,
    Keys,
    Label,
    Rectangle,
    Vector
} from "excalibur"

import { Resources } from "./resources.js"
import { Player } from "./player.js"

export class Prisoner extends Actor {

    constructor(x, y) {
        super({
            x,
            y,
            width: 100,
            height: 100,
            collisionType: CollisionType.Passive
        })

        this.isPlayerNear = false
        this.playerActor = null

        this.holdStartTime = null

        this.progressBarBackground = null
        this.progressBarFill = null
        this.promptLabel = null

        this.barWidth = 60
        this.barHeight = 6

        this.freed = false

        this.onFreed = null
    }

    onInitialize(engine) {

        this.engine = engine

        this.graphics.use(
            Resources.PrisonerCageClosed.toSprite()
        )

        this.on("collisionstart", (evt) => {

            if (evt.other.owner instanceof Player) {
                this.isPlayerNear = true
                this.playerActor = evt.other.owner

                if (!this.freed) {
                    this.ensureProgressBar()
                }
            }
        })

        this.on("collisionend", (evt) => {

            if (evt.other.owner instanceof Player) {

                this.isPlayerNear = false
                this.playerActor = null
                this.holdStartTime = null

                this.destroyProgressBar()
            }
        })
    }

    onPreUpdate(engine) {

        if (this.freed) {
            return
        }

        if (!this.isPlayerNear) {
            return
        }

        let progress = 0

        if (engine.input.keyboard.isHeld(Keys.X)) {

            if (this.holdStartTime === null) {
                this.holdStartTime = Date.now()
            }

            const holdDuration =
                Date.now() - this.holdStartTime

            progress = Math.min(
                holdDuration / 3000,
                1
            )

            this.updateProgressBar(progress)

            if (holdDuration >= 3000) {

                this.freePrisoner()
            }
        }
        else {

            this.holdStartTime = null
            this.updateProgressBar(0)
        }
    }

    freePrisoner() {

        this.freed = true

        this.destroyProgressBar()

        this.graphics.use(
            Resources.PrisonerCageOpen.toSprite()
        )

        if (this.onFreed) {
            this.onFreed()
        }
    }

    ensureProgressBar() {

        if (this.progressBarBackground) {
            return
        }

        this.progressBarBackground = new Actor({
            width: this.barWidth,
            height: this.barHeight,
            collisionType: CollisionType.PreventCollision,
            z: 1000
        })

        this.progressBarBackground.graphics.use(
            new Rectangle({
                width: this.barWidth,
                height: this.barHeight,
                color: Color.Black
            })
        )

        this.progressBarFill = new Actor({
            width: 1,
            height: this.barHeight - 2,
            collisionType: CollisionType.PreventCollision,
            z: 1001
        })

        this.engine.currentScene.add(
            this.progressBarBackground
        )

        this.engine.currentScene.add(
            this.progressBarFill
        )

        this.createPromptLabel()

        this.updateProgressBar(0)
    }

    createPromptLabel() {

        if (this.promptLabel) {
            return
        }

        this.promptLabel = new Label({
            text: "Hold X to free",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 14,
                unit: FontUnit.Px
            })
        })

        this.promptLabel.z = 1002
        this.promptLabel.anchor = new Vector(0.5, 0.5)

        this.engine.currentScene.add(
            this.promptLabel
        )
    }

    updateProgressBar(progress) {

        if (!this.progressBarBackground) {
            return
        }

        const barX = this.pos.x
        const barY = this.pos.y - 80

        const fillWidth =
            this.barWidth * progress

        this.progressBarBackground.pos =
            new Vector(barX, barY)

        this.progressBarFill.graphics.use(
            new Rectangle({
                width: Math.max(fillWidth, 1),
                height: this.barHeight - 2,
                color: Color.Green
            })
        )

        this.progressBarFill.pos =
            new Vector(
                barX - this.barWidth / 2 + fillWidth / 2,
                barY
            )

        if (this.promptLabel) {

            this.promptLabel.pos =
                new Vector(
                    barX,
                    barY - 15
                )
        }
    }

    destroyProgressBar() {

        if (this.promptLabel) {
            this.promptLabel.kill()
            this.promptLabel = null
        }

        if (this.progressBarBackground) {
            this.progressBarBackground.kill()
            this.progressBarBackground = null
        }

        if (this.progressBarFill) {
            this.progressBarFill.kill()
            this.progressBarFill = null
        }
    }
}