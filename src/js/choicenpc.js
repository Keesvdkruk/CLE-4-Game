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
        
        // Timer om de animatie na precies 1 loop te stoppen
        this.introAnimEndTime = null
    }

    setPlayer(player) {
        this.player = player
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

        // Sla de idleAnim2 op als class property (this.idleAnim2) zodat we hem later kunnen resetten
        this.idleAnim2 = Animation.fromSpriteSheet(idleSheet2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 120)
        this.idleAnim2.scale = new Vector(1.2, 1.2)
        
        this.graphics.add("idle2", this.idleAnim2)
        this.graphics.add("idle1", idleAnim1)
        this.graphics.use("idle1")

        this.on('collisionstart', (evt) => {
            if (evt.other.owner === this.player) {
                this.isPlayerNear = true
                
                if (this.dialogueState === 0) {
                    this.dialogueState = 1
                    
                    // 1. Zorg dat de animatie weer vanaf frame 0 begint!
                    this.idleAnim2.reset()
                    this.graphics.use("idle2")
                    
                    // 2. Bereken wanneer de animatie precies klaar is (11 frames * 120ms = 1320ms)
                    this.introAnimEndTime = Date.now() + 1320
                    
                    this.showDialogue("Hey rebel... will you help us?\n[Y]es or [N]o")
                }
            }
        })

        // --- SPELER LOOPT WEG ---
        this.on('collisionend', (evt) => {
            if (evt.other.owner === this.player) {
                this.graphics.use("idle1")
                this.isPlayerNear = false
                this.dialogueState = 0
                this.introAnimEndTime = null // Annuleer de timer voor het geval de speler halverwege de animatie wegloopt
                this.hideDialogue()
            }
        })
    }

    onPreUpdate(engine) {
        if (!this.player) return

        // --- ANIMATIE TIMER CHECK ---
        // Als de timer loopt EN de huidige tijd is voorbij de eindtijd:
        if (this.introAnimEndTime !== null && Date.now() >= this.introAnimEndTime) {
            this.graphics.use("idle1") // Schakel terug naar de standaard idle
            this.introAnimEndTime = null // Zet de timer weer uit
        }

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