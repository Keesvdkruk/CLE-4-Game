import { Actor, CollisionType, SpriteSheet, Animation, Vector, Label, Font, FontUnit, Color, Keys } from "excalibur"
import { Resources } from "./resources.js"

export class ChoiceNpc extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 128,
            height: 128,

            // Geen collision-events meer voor interactie
            collisionType: CollisionType.PreventCollision,

            anchor: new Vector(0.5, 1)
        })

        this.player = null
        this.engine = null

        this.isPlayerNear = false
        this.interactRangeX = 85
        this.interactRangeY = 100

        this.dialogueLabel = null

        this.hasReceivedFood = false
        this.onGiveFood = null

        this.introAnimEndTime = null
        this.currentState = "idle"

        // Onthoudt richting zodat NPC niet snapt/flipt bij sprite wissel
        this.facingLeft = false
    }

    setPlayer(player) {
        this.player = player
    }

    setFoodCallback(callback) {
        this.onGiveFood = callback
    }

    onInitialize(engine) {
        this.engine = engine

        const idleSheet = SpriteSheet.fromImageSource({
            image: Resources.Npc1Idle1,
            grid: { rows: 1, columns: 6, spriteWidth: 128, spriteHeight: 128 }
        })

        const idleSheet2 = SpriteSheet.fromImageSource({
            image: Resources.Npc1Idle2,
            grid: { rows: 1, columns: 11, spriteWidth: 128, spriteHeight: 128 }
        })

        const idleAnim1 = Animation.fromSpriteSheet(idleSheet, [0, 1, 2, 3, 4, 5], 120)
        idleAnim1.scale = new Vector(1.2, 1.2)

        this.idleAnim2 = Animation.fromSpriteSheet(idleSheet2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 120)
        this.idleAnim2.scale = new Vector(1.2, 1.2)

        this.graphics.add("idle1", idleAnim1)
        this.graphics.add("idle2", this.idleAnim2)

        this.graphics.use("idle1")
        this.applyFacingDirection()

        this.currentState = "idle"
    }

    onPreUpdate(engine) {
        if (!this.player) {
            return
        }

        const nearNow = this.isPlayerInsideRange()

        if (nearNow && !this.isPlayerNear) {
            this.onPlayerEnter()
        }

        if (!nearNow && this.isPlayerNear) {
            this.onPlayerLeave()
        }

        this.isPlayerNear = nearNow

        // Laat introAnim gewoon afmaken, ook als speler is weggelopen
        if (this.introAnimEndTime !== null && Date.now() >= this.introAnimEndTime) {
            this.graphics.use("idle1")
            this.applyFacingDirection()

            this.currentState = "idle"
            this.introAnimEndTime = null

            // Alleen opnieuw naar speler draaien als speler nog dichtbij is
            if (this.isPlayerNear) {
                this.facePlayer()
            }
        }

        if (this.isPlayerNear) {
            this.facePlayer()

            if (engine.input.keyboard.wasPressed(Keys.X)) {
                this.tryReceiveFood()
            }
        }

        this.updateDialoguePosition()
    }

    isPlayerInsideRange() {
        const dx = Math.abs(this.player.pos.x - this.pos.x)
        const dy = Math.abs(this.player.pos.y - this.pos.y)

        return dx <= this.interactRangeX && dy <= this.interactRangeY
    }

    onPlayerEnter() {
        this.facePlayer()

        // Start intro animatie alleen als hij niet al bezig is
        if (this.currentState !== "intro") {
            this.idleAnim2.reset()
            this.graphics.use("idle2")
            this.applyFacingDirection()

            this.currentState = "intro"
            this.introAnimEndTime = Date.now() + 1320
        }

        if (this.hasReceivedFood) {
            this.showDialogue("Thank you again.")
        } else {
            this.showDialogue("Please... I need food.\nPress X to give bread.")
        }
    }

    onPlayerLeave() {
        // Dialogue mag weg, maar animatie NIET meteen terugzetten naar idle
        this.hideDialogue()

        // Als intro bezig is: niks cancelen. Gewoon laten afspelen.
        if (this.currentState === "intro") {
            return
        }

        // Alleen als hij al idle is, blijf idle
        this.graphics.use("idle1")
        this.applyFacingDirection()

        this.currentState = "idle"
        this.introAnimEndTime = null
    }

    facePlayer() {
        if (!this.player) {
            return
        }

        const dx = this.player.pos.x - this.pos.x

        // Deadzone voorkomt twitch als je precies bovenop/naast de NPC staat
        if (Math.abs(dx) < 12) {
            return
        }

        this.facingLeft = dx < 0
        this.applyFacingDirection()
    }

    applyFacingDirection() {
        if (!this.graphics.current) {
            return
        }

        this.graphics.current.flipHorizontal = this.facingLeft
    }

    tryReceiveFood() {
        if (typeof this.onGiveFood !== "function") {
            return
        }

        const resultText = this.onGiveFood(this)

        if (resultText) {
            this.updateDialogueText(resultText)
        }
    }

    showDialogue(text) {
        if (!this.dialogueLabel) {
            this.dialogueLabel = new Label({
                text: text,
                color: Color.Yellow,
                font: new Font({
                    family: "MijnPixelFont",
                    size: 15,
                    unit: FontUnit.Px
                })
            })

            this.dialogueLabel.anchor = new Vector(0.5, 0.5)
            this.dialogueLabel.z = 1003
            this.engine.currentScene.add(this.dialogueLabel)
        } else {
            this.dialogueLabel.text = text
        }

        this.updateDialoguePosition()
    }

    updateDialogueText(text) {
        if (this.dialogueLabel) {
            this.dialogueLabel.text = text
        }
    }

    updateDialoguePosition() {
        if (!this.dialogueLabel) {
            return
        }

        this.dialogueLabel.pos = new Vector(this.pos.x, this.pos.y - 110)
    }

    hideDialogue() {
        if (this.dialogueLabel) {
            this.dialogueLabel.kill()
            this.dialogueLabel = null
        }
    }
}