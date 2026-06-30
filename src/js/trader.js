import { Actor, CollisionType, SpriteSheet, Animation, Vector, Label, Font, FontUnit, Color, Keys } from "excalibur"
import { Resources } from "./resources.js"

export class Trader extends Actor {
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

        this.name = "trader"
        this.player = null
        this.engine = null

        this.isPlayerNear = false
        this.interactRangeX = 95
        this.interactRangeY = 110

        this.dialogueLabel = null
        this.dialogueText = "Bread for sale. Press X to buy."
        this.dialogueTypeDurationMs = 1000

        this.dialogueFrames = []
        this.frameIndex = 0
        this.frameDurationMs = 150
        this.nextFrameAt = null

        // idle, opening, holdOpen, closing
        this.state = "idle"

        this.onBuyFood = null

        // Onthoudt welke kant de trader op kijkt
        this.facingLeft = false
    }

    setPlayer(player) {
        this.player = player
    }

    setBuyFoodCallback(callback) {
        this.onBuyFood = callback
    }

    onInitialize(engine) {
        this.engine = engine

        const idleSheet = SpriteSheet.fromImageSource({
            image: Resources.TraderIdle,
            grid: { rows: 1, columns: 6, spriteWidth: 128, spriteHeight: 128 }
        })

        const dialogueSheet = SpriteSheet.fromImageSource({
            image: Resources.TraderDialogue,
            grid: { rows: 1, columns: 16, spriteWidth: 128, spriteHeight: 128 }
        })

        const idleAnim = Animation.fromSpriteSheet(idleSheet, [0, 1, 2, 3, 4, 5], 120)
        idleAnim.scale = new Vector(1.2, 1.2)

        this.dialogueFrames = Array.from({ length: 16 }, (_, index) => {
            const sprite = dialogueSheet.getSprite(index, 0)
            sprite.scale = new Vector(1.2, 1.2)
            return sprite
        })

        this.graphics.add("idle", idleAnim)
        this.graphics.use("idle")
        this.applyFacingDirection()

        this.state = "idle"
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

        if (this.isPlayerNear) {
            this.facePlayer()

            if (engine.input.keyboard.wasPressed(Keys.X)) {
                this.tryBuyFood()
            }
        }

        this.updateAnimationState()
        this.updateDialoguePosition()
    }

    isPlayerInsideRange() {
        const dx = Math.abs(this.player.pos.x - this.pos.x)
        const dy = Math.abs(this.player.pos.y - this.pos.y)

        return dx <= this.interactRangeX && dy <= this.interactRangeY
    }

    onPlayerEnter() {
        this.facePlayer()
        this.dialogueText = "Bread for sale. Press X to buy."
        this.showDialogueLabel()
        this.startOpening()
    }

    onPlayerLeave() {
        this.hideDialogueLabel()

        if (this.state === "opening" || this.state === "holdOpen") {
            this.startClosing()
        }
    }

    startOpening() {
        this.state = "opening"
        this.frameIndex = 0
        this.nextFrameAt = Date.now() + this.frameDurationMs
        this.useDialogueFrame(this.frameIndex)
    }

    startClosing() {
        this.state = "closing"

        if (this.frameIndex < 9) {
            this.frameIndex = 9
        }

        this.nextFrameAt = Date.now() + this.frameDurationMs
        this.useDialogueFrame(this.frameIndex)
    }

    updateAnimationState() {
        if (this.state !== "opening" && this.state !== "closing") {
            return
        }

        const now = Date.now()

        if (this.nextFrameAt === null || now < this.nextFrameAt) {
            return
        }

        if (this.state === "opening") {
            if (this.frameIndex < 9) {
                this.frameIndex += 1
                this.useDialogueFrame(this.frameIndex)
                this.nextFrameAt = now + this.frameDurationMs
                return
            }

            // Stop op frame 9: jas open
            this.state = "holdOpen"
            this.nextFrameAt = null
            this.useDialogueFrame(9)
            return
        }

        if (this.state === "closing") {
            if (this.frameIndex < 15) {
                this.frameIndex += 1
                this.useDialogueFrame(this.frameIndex)
                this.nextFrameAt = now + this.frameDurationMs
                return
            }

            this.setIdle()
        }
    }

    useDialogueFrame(frameIndex) {
        if (!this.dialogueFrames[frameIndex]) {
            return
        }

        this.graphics.use(this.dialogueFrames[frameIndex])
        this.applyFacingDirection()
    }

    setIdle() {
        this.state = "idle"
        this.frameIndex = 0
        this.nextFrameAt = null
        this.graphics.use("idle")
        this.applyFacingDirection()
    }

    facePlayer() {
        if (!this.player) {
            return
        }

        const dx = this.player.pos.x - this.pos.x

        // Deadzone voorkomt links/rechts twitch als je precies op dezelfde x staat
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

    tryBuyFood() {
        if (typeof this.onBuyFood !== "function") {
            return
        }

        const resultText = this.onBuyFood()

        if (resultText) {
            this.dialogueText = resultText
            this.showDialogueLabel()
            this.updateDialogueLabel(this.dialogueTypeDurationMs)
        }
    }

    showDialogueLabel() {
        if (this.dialogueLabel) {
            this.updateDialogueLabel(this.dialogueTypeDurationMs)
            return
        }

        this.dialogueLabel = new Label({
            text: "",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 15,
                unit: FontUnit.Px
            })
        })

        this.dialogueLabel.anchor = new Vector(0.5, 0.5)
        this.dialogueLabel.z = 1003
        this.engine.currentScene.add(this.dialogueLabel)

        this.updateDialogueLabel(this.dialogueTypeDurationMs)
        this.updateDialoguePosition()
    }

    updateDialogueLabel(elapsedMs) {
        if (!this.dialogueLabel) {
            return
        }

        const progress = Math.min(elapsedMs / this.dialogueTypeDurationMs, 1)
        const visibleCharacters = Math.max(1, Math.floor(this.dialogueText.length * progress))

        this.dialogueLabel.text = this.dialogueText.substring(0, visibleCharacters)
    }

    updateDialoguePosition() {
        if (!this.dialogueLabel) {
            return
        }

        this.dialogueLabel.pos = new Vector(this.pos.x, this.pos.y - 92)
    }

    hideDialogueLabel() {
        if (!this.dialogueLabel) {
            return
        }

        this.dialogueLabel.kill()
        this.dialogueLabel = null
    }
}