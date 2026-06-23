import { Actor, CollisionType, SpriteSheet, Animation, Vector, Label, Font, FontUnit, Color, Keys } from "excalibur"
import { Resources } from "./resources.js"

export class ChoiceNpc extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 128,
            height: 128,
            collisionType: CollisionType.Passive,
            anchor: new Vector(0.5, 1)
        })

        this.player = null
        this.isPlayerNear = false
        this.dialogueLabel = null

        // State tracker: 
        // 0 = Not talking
        // 1 = Asking question
        // 2 = Answered
        this.dialogueState = 0 
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

        const idleAnim = Animation.fromSpriteSheet(idleSheet, [0, 1, 2, 3, 4, 5], 120)
        idleAnim.scale = new Vector(1.2, 1.2)
        this.graphics.use(idleAnim)

        this.on('collisionstart', (evt) => {
            if (evt.other.owner === this.player) {
                this.isPlayerNear = true
                
                if (this.dialogueState === 0) {
                    this.dialogueState = 1
                    this.showDialogue("Hey rebel... will you help us?\n[Y]es or [N]o")
                }
            }
        })

        // --- SPELER LOOPT WEG ---
        this.on('collisionend', (evt) => {
            if (evt.other.owner === this.player) {
                this.isPlayerNear = false
                this.dialogueState = 0
                this.hideDialogue()
            }
        })
    }

    onPreUpdate(engine) {
        if (!this.player) return

        if (this.graphics.current) {
            this.graphics.current.flipHorizontal = this.player.pos.x < this.pos.x
        }

        if (this.dialogueLabel) {
            this.dialogueLabel.pos = new Vector(this.pos.x, this.pos.y - 110)
        }

        if (this.isPlayerNear && this.dialogueState === 1) {
            
            if (engine.input.keyboard.wasPressed(Keys.Y)) {
                this.dialogueState = 2 
                this.updateDialogueText("Thank you. The resistance will remember this.")
                
            } else if (engine.input.keyboard.wasPressed(Keys.N)) {
                this.dialogueState = 2
                this.updateDialogueText("Coward. Get out of my sight.")
            }
        }
    }

    showDialogue(text) {
        if (!this.dialogueLabel) {
            this.dialogueLabel = new Label({
                text: text,
                color: Color.Yellow,
                font: new Font({
                    family: 'MijnPixelFont',
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
    }

    updateDialogueText(text) {
        if (this.dialogueLabel) {
            this.dialogueLabel.text = text
        }
    }

    hideDialogue() {
        if (this.dialogueLabel) {
            this.dialogueLabel.kill()
            this.dialogueLabel = null
        }
    }
}