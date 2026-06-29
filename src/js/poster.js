import { Actor, CollisionType, Color, Font, FontUnit, Keys, Label, Rectangle, Vector } from "excalibur"
import { Player } from "./player.js"
import { GameState } from "./state.js"

export class Poster extends Actor {
    // Voeg de nieuwe parameters toe aan de constructor
    constructor(x, y, width, height, posterImage) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            collisionType: CollisionType.Passive, 
            z: -1 
        })

        // Converteer de ImageSource naar een Sprite
        const posterSprite = posterImage.toSprite()
        
        // Bereken de schaal zodat de afbeelding netjes binnen de width en height past
        const scaleX = width / posterSprite.width
        const scaleY = height / posterSprite.height
        
        // Pas de schaal toe op de sprite
        posterSprite.scale = new Vector(scaleX, scaleY)
        
        // Centreer het plaatje op de actor (optioneel, of laat anchor op 0,0)
        // posterSprite.dest = ... (standaard pakt excalibur de center/anchor)
        
        this.graphics.use(posterSprite)
        
        this.isPlayerNear = false 
        this.playerActor = null
        this.holdStartTime = null
        this.progressBarBackground = null
        this.progressBarFill = null
        this.promptLabel = null
        this.barWidth = 52
        this.barHeight = 6
    }

    onInitialize(engine) {
        this.engine = engine

        this.on('collisionstart', (evt) => {
            console.log("Iets raakt de poster!") 
            
            if (evt.other.owner instanceof Player) {
                console.log("Speler is in de buurt!")
                this.isPlayerNear = true
                this.playerActor = evt.other.owner
                this.ensureProgressBar()
            }
        })

        this.on('collisionend', (evt) => {
            if (evt.other.owner instanceof Player) {
                console.log("Speler is weer weggelopen.")
                this.isPlayerNear = false
                this.playerActor = null
                this.holdStartTime = null
                this.setPlayerDestroying(false)
                this.destroyProgressBar()
            }
        })
    }

    onPreUpdate(engine) {
        if (!this.isPlayerNear) {
            this.holdStartTime = null
            this.setPlayerDestroying(false)
            this.destroyProgressBar()
            return
        }

        this.ensureProgressBar()

        let progress = 0

        if (engine.input.keyboard.isHeld(Keys.X)) {
            this.setPlayerDestroying(true)

            if (this.holdStartTime === null) {
                this.holdStartTime = Date.now()
            }

            const holdDuration = Date.now() - this.holdStartTime
            progress = Math.min(holdDuration / 3000, 1)
            this.updateProgressBar(progress)

            if (holdDuration >= 3000) {
                console.log("Poster vernietigd!")
                
                // Haal 1 van de peace stat af (zorg dat hij niet onder de 0 zakt)
                GameState.peace = Math.max(0, GameState.peace - 10)
                console.log("Huidige Peace stat:", GameState.peace)

                this.setPlayerDestroying(false)
                this.destroyProgressBar()
                this.kill() 
                return
            }
        } else {
            this.holdStartTime = null
            this.setPlayerDestroying(false)
        }

        this.updateProgressBar(progress)
    }

    setPlayerDestroying(isDestroying) {
        if (this.playerActor) {
            this.playerActor.setDestroyingPoster(isDestroying)
        }
    }

    ensureProgressBar() {
        if (this.progressBarBackground && this.progressBarFill) {
            return
        }

        this.progressBarBackground = new Actor({
            x: 0,
            y: 0,
            width: this.barWidth,
            height: this.barHeight,
            color: Color.Black,
            collisionType: CollisionType.PreventCollision,
            z: 1000
        })
        this.progressBarBackground.graphics.use(new Rectangle({
            width: this.barWidth,
            height: this.barHeight,
            color: Color.Black
        }))

        this.progressBarFill = new Actor({
            x: 0,
            y: 0,
            width: 1,
            height: this.barHeight - 2,
            color: Color.Green,
            collisionType: CollisionType.PreventCollision,
            z: 1001
        })
        this.progressBarFill.graphics.use(new Rectangle({
            width: 1,
            height: this.barHeight - 2,
            color: Color.Green
        }))

        this.engine.currentScene.add(this.progressBarBackground)
        this.engine.currentScene.add(this.progressBarFill)
        this.createPromptLabel()
        this.updateProgressBar(0)
    }

    createPromptLabel() {
        if (this.promptLabel) {
            return
        }

        this.promptLabel = new Label({
            text: "hold x to destroy",
            color: Color.White,
            font: new Font({
                family: 'MijnPixelFont', 
                size: 15,
                unit: FontUnit.Px
            })
        })

        this.promptLabel.anchor = new Vector(0.5, 0.5)
        this.promptLabel.z = 1002

        this.engine.currentScene.add(this.promptLabel)
    }

    updateProgressBar(progress) {
        if (!this.progressBarBackground || !this.progressBarFill) {
            return
        }

        const barX = this.pos.x
        // Blijft keurig in het midden boven de opgegeven height van de poster actor
        const barY = this.pos.y - (this.height / 2) - 25 
        const fillWidth = this.barWidth * progress
        const labelY = barY - 25

        this.progressBarBackground.pos = new Vector(barX, barY)
        this.progressBarFill.graphics.use(new Rectangle({
            width: Math.max(fillWidth, 1),
            height: this.barHeight - 2,
            color: Color.Green
        }))
        this.progressBarFill.pos = new Vector(barX - (this.barWidth / 2) + (fillWidth / 2), barY)

        if (this.promptLabel) {
            this.promptLabel.pos = new Vector(barX, labelY)
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