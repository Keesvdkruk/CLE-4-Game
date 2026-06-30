import {
    Actor,
    CollisionType,
    Vector,
    Label,
    Font,
    FontUnit,
    Color,
    Keys,
    SpriteSheet,
    Animation,
    range
} from "excalibur"

import { Resources } from "./resources.js"

export class WorkerNpc extends Actor {

    constructor(x, y, dialogueText) {
        super({
            x,
            y,
            width: 60,
            height: 82,
            collisionType: CollisionType.Passive,
            anchor: new Vector(0.5, 1)
        })

        this.z = 10

        this.player = null

        this.dialogueText = dialogueText
        this.dialogueLabel = null

        this.hasBeenTalkedTo = false

        this.onConversationComplete = null

        this.playerNearby = false
        this.promptLabel = null

        this.currentCharacter = 0
        this.typingInterval = null
    }

    setPlayer(player) {
        this.player = player
    }

    onInitialize(engine) {
        this.engine = engine

        this.graphics.use(
            Resources.Worker.toSprite()
        )

        this.on("collisionstart", (evt) => {

            if (evt.other.owner !== this.player) {
                return
            }

            this.playerNearby = true
            this.showPrompt()
        })

        this.on("collisionend", (evt) => {

            if (evt.other.owner !== this.player) {
                return
            }

            this.playerNearby = false

            this.hidePrompt()
            this.hideDialogue()
        })
    }

    onPreUpdate() {

        if (this.dialogueLabel) {

            this.dialogueLabel.pos = new Vector(
                this.pos.x,
                this.pos.y - 100
            )
        }

        if (
            this.playerNearby &&
            this.engine.input.keyboard.wasPressed(Keys.E)
        ) {
            this.showDialogue()

            if (!this.hasBeenTalkedTo) {

                this.hasBeenTalkedTo = true

                if (this.onConversationComplete) {
                    this.onConversationComplete()
                }
            }
        }

        if (this.promptLabel) {
            this.promptLabel.pos = new Vector(
                this.pos.x,
                this.pos.y - 130
            )
        }
    }

    showDialogue() {

        if (this.dialogueLabel) {
            return
        }

        this.dialogueLabel = new Label({
            text: "",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 16,
                unit: FontUnit.Px
            })
        })

        this.dialogueLabel.z = 100

        this.dialogueLabel.anchor = new Vector(0.5, 0.5)

        this.engine.currentScene.add(this.dialogueLabel)

        this.currentCharacter = 0

        this.typingInterval = setInterval(() => {

            this.currentCharacter++

            this.dialogueLabel.text =
                this.dialogueText.substring(
                    0,
                    this.currentCharacter
                )

            if (
                this.currentCharacter >=
                this.dialogueText.length
            ) {
                clearInterval(this.typingInterval)
            }

        }, 35)
    }

    hideDialogue() {

        if (!this.dialogueLabel) {
            return
        }

        this.dialogueLabel.kill()
        this.dialogueLabel = null

        if (this.typingInterval) {
            clearInterval(this.typingInterval)
        }
    }

    showPrompt() {

        if (this.promptLabel) {
            return
        }

        this.promptLabel = new Label({
            text: "Press E to talk",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 14,
                unit: FontUnit.Px
            })
        })

        this.promptLabel.z = 100

        this.promptLabel.anchor = new Vector(0.5, 0.5)

        this.engine.currentScene.add(this.promptLabel)
    }

    hidePrompt() {

        if (!this.promptLabel) {
            return
        }

        this.promptLabel.kill()
        this.promptLabel = null
    }
}