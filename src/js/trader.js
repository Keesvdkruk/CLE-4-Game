import { Actor, CollisionType, SpriteSheet, Animation, Vector, Label, Font, FontUnit, Color } from "excalibur"
import { Resources } from "./resources.js"

export class Trader extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 128,
            height: 128,
            collisionType: CollisionType.Passive,
            anchor: new Vector(0.5, 1)
        })

        this.name = "trader"
        this.player = null
        this.currentState = null
        this.isPlayerNear = false
        this.dialoguePlayedThisApproach = false
        this.dialogueLabel = null
        this.dialogueText = "Wanna buy some meth kid?"
        this.dialogueTypeDurationMs = 1000
        this.dialogueFrames = []
        this.dialogueFrameIndex = 0
        this.dialogueFrameDurationMs = 150
        this.dialogueNextFrameAt = null
        this.dialogueResuming = false
    }

    setPlayer(player) {
        this.player = player
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
        this.graphics.add("dialogue", this.dialogueFrames[0])
        this.graphics.use("idle")
        this.currentState = "idle"

        this.on('collisionstart', (evt) => {
            if (evt.other.owner === this.player) {
                this.isPlayerNear = true
                this.showDialogueLabel()
                this.startDialogue()
            }
        })

        this.on('collisionend', (evt) => {
            if (evt.other.owner === this.player) {
                this.isPlayerNear = false
                this.hideDialogueLabel()

                if (!this.dialoguePlayedThisApproach) {
                    this.dialoguePlayedThisApproach = false
                    this.setIdle()
                } else if (this.dialogueFrameIndex >= 9) {
                    this.dialogueResuming = true
                    this.dialogueNextFrameAt = Date.now() + this.dialogueFrameDurationMs
                }
            }
        })
    }

    onPreUpdate(engine) {
        if (!this.player) {
            return
        }

        if (this.dialoguePlayedThisApproach) {
            this.updateDialogueLabel(this.dialogueFrameIndex * this.dialogueFrameDurationMs)
            this.updateDialoguePlayback()
        }

        if (this.graphics.current) {
            this.graphics.current.flipHorizontal = this.player.pos.x < this.pos.x
        }

        if (this.dialogueLabel) {
            this.dialogueLabel.pos = new Vector(this.pos.x, this.pos.y - 92)
        }
    }

    updateDialoguePlayback() {
        if (!this.dialogueFrames.length || this.dialogueNextFrameAt === null) {
            return
        }

        const now = Date.now()

        if (now < this.dialogueNextFrameAt) {
            return
        }

        if (!this.dialogueResuming) {
            if (this.dialogueFrameIndex < 9) {
                this.dialogueFrameIndex += 1
                this.useDialogueFrame(this.dialogueFrameIndex)
                this.dialogueNextFrameAt = now + this.dialogueFrameDurationMs
                return
            }

            if (this.isPlayerNear) {
                this.dialogueNextFrameAt = now + this.dialogueFrameDurationMs
                return
            }

            this.dialogueResuming = true
            this.dialogueNextFrameAt = now + this.dialogueFrameDurationMs
            return
        }

        if (this.dialogueFrameIndex < 15) {
            this.dialogueFrameIndex += 1
            this.useDialogueFrame(this.dialogueFrameIndex)
            this.dialogueNextFrameAt = now + this.dialogueFrameDurationMs
            return
        }

        this.finishDialogue()
    }

    useDialogueFrame(frameIndex) {
        if (this.dialogueFrames[frameIndex]) {
            this.graphics.use(this.dialogueFrames[frameIndex])
            this.currentState = "dialogue"
        }
    }

    showDialogueLabel() {
        if (this.dialogueLabel) {
            return
        }

        this.dialogueLabel = new Label({
            text: "",
            color: Color.White,
            font: new Font({
                family: 'MijnPixelFont',
                size: 15,
                unit: FontUnit.Px
            })
        })

        this.dialogueLabel.anchor = new Vector(0.5, 0.5)
        this.dialogueLabel.z = 1003
        this.engine.currentScene.add(this.dialogueLabel)
        this.updateDialogueLabel(0)
    }

    updateDialogueLabel(elapsedMs) {
        if (!this.dialogueLabel) {
            return
        }

        const progress = Math.min(elapsedMs / this.dialogueTypeDurationMs, 1)
        const visibleCharacters = Math.max(1, Math.floor(this.dialogueText.length * progress))

        this.dialogueLabel.text = this.dialogueText.substring(0, visibleCharacters)
    }

    hideDialogueLabel() {
        if (!this.dialogueLabel) {
            return
        }

        this.dialogueLabel.kill()
        this.dialogueLabel = null
    }

    startDialogue() {
        if (this.dialoguePlayedThisApproach) {
            return
        }

        this.dialoguePlayedThisApproach = true
        this.dialogueResuming = false
        this.dialogueFrameIndex = 0
        this.dialogueNextFrameAt = Date.now() + this.dialogueFrameDurationMs
        this.useDialogueFrame(0)
        this.currentState = "dialogue"
    }

    finishDialogue() {
        this.dialogueResuming = false
        this.dialogueNextFrameAt = null
        this.dialogueFrameIndex = 0

        if (this.currentState !== "idle") {
            this.setIdle()
        }

        if (!this.isPlayerNear) {
            this.dialoguePlayedThisApproach = false
        }
    }

    setIdle() {
        if (this.currentState !== "idle") {
            this.graphics.use("idle")
            this.currentState = "idle"
        }
    }
}