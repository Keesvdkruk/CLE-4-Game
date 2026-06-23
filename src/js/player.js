import { Actor, Keys, CollisionType, SpriteSheet, Animation, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class Player extends Actor {
    
    constructor() {
        super({
            x: 100,
            y: 500,
            width: 34,  
            height: 80, 
            collisionType: CollisionType.Active,
            anchor: new Vector(0.5, 1)
        })
        
        this.onGround = false
        this.facingLeft = false 
        this.isDestroyingPoster = false
        this.isKnockedOut = false
        this.hasBeenKnockedOutThisLevel = false
        this.knockoutStartTime = null
        this.knockoutAnimationDurationMs = 1170
        this.knockoutHoldDurationMs = 1000
        this.knockoutTotalDurationMs = this.knockoutAnimationDurationMs + this.knockoutHoldDurationMs
        this.knockoutIsHoldingFrame = false
        this.onKnockoutComplete = null
        
        this.isPlayer = true 
    }

    onInitialize(engine) {
        const playerScale = 0.75

        this.on('collisionstart', (evt) => {
            this.onGround = true
        })

        // Jouw 6 frames voor Idle
        const idleSheet = SpriteSheet.fromImageSource({
            image: Resources.Idle,
            grid: { rows: 1, columns: 6, spriteWidth: 256, spriteHeight: 256 }
        })

        const walkSheet = SpriteSheet.fromImageSource({
            image: Resources.Walk,
            grid: { rows: 1, columns: 10, spriteWidth: 256, spriteHeight: 256 }
        })

        const jumpSheet = SpriteSheet.fromImageSource({
            image: Resources.Jump,
            grid: { rows: 1, columns: 9, spriteWidth: 256, spriteHeight: 256 }
        })

        const specialBlowSheet = SpriteSheet.fromImageSource({
            image: Resources.SpecialBlow2,
            grid: { rows: 1, columns: 10, spriteWidth: 256, spriteHeight: 256 }
        })

        const koSheet = SpriteSheet.fromImageSource({
            image: Resources.KO,
            grid: { rows: 1, columns: 9, spriteWidth: 256, spriteHeight: 256 }
        })

        const idleAnim = Animation.fromSpriteSheet(idleSheet, [0, 1, 2, 3, 4, 5], 100)
        const walkAnim = Animation.fromSpriteSheet(walkSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 80)
        const jumpAnim = Animation.fromSpriteSheet(jumpSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8], 80)
        const specialBlowAnim = Animation.fromSpriteSheet(specialBlowSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 100)
        const koAnim = Animation.fromSpriteSheet(koSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8], 120)
        const koHoldSprite = koSheet.getSprite(8, 0)

        idleAnim.scale = new Vector(playerScale, playerScale)
        walkAnim.scale = new Vector(playerScale, playerScale)
        jumpAnim.scale = new Vector(playerScale, playerScale)
        specialBlowAnim.scale = new Vector(playerScale, playerScale)
        koAnim.scale = new Vector(playerScale, playerScale)
        koHoldSprite.scale = new Vector(playerScale, playerScale)

        this.graphics.add("idle", idleAnim)
        this.graphics.add("walk", walkAnim)
        this.graphics.add("jump", jumpAnim)
        this.graphics.add("specialBlow", specialBlowAnim)
        this.graphics.add("ko", koAnim)
        this.graphics.add("koHold", koHoldSprite)

        this.graphics.use("idle")
    }

    setDestroyingPoster(isDestroying) {
        if (this.isKnockedOut) {
            return
        }

        this.isDestroyingPoster = isDestroying
    }

    startKnockout() {
        if (this.isKnockedOut || this.hasBeenKnockedOutThisLevel) {
            return
        }

        this.isKnockedOut = true
        this.hasBeenKnockedOutThisLevel = true
        this.isDestroyingPoster = false
        this.knockoutIsHoldingFrame = false
        this.knockoutStartTime = Date.now()
        this.collisionType = CollisionType.PreventCollision
        this.vel = new Vector(0, 0)
        this.graphics.use("ko")
    }

    finishKnockout() {
        this.isKnockedOut = false
        this.knockoutStartTime = null
        this.knockoutIsHoldingFrame = false
        this.pos = new Vector(100, 500)
        this.vel = new Vector(0, 0)
        this.onGround = false
        this.collisionType = CollisionType.Active
        this.graphics.use("idle")

        if (typeof this.onKnockoutComplete === "function") {
            this.onKnockoutComplete()
        }
    }

    onPreUpdate(engine) {
        this.vel.x = 0 

        if (this.isKnockedOut) {
            this.vel.y = 0

            const knockoutElapsed = Date.now() - this.knockoutStartTime

            if (knockoutElapsed >= this.knockoutAnimationDurationMs && !this.knockoutIsHoldingFrame) {
                this.graphics.use("koHold")
                this.knockoutIsHoldingFrame = true
            }

            this.graphics.current.flipHorizontal = this.facingLeft

            if (this.knockoutStartTime !== null && knockoutElapsed >= this.knockoutTotalDurationMs) {
                this.finishKnockout()
            }

            return
        }

        if (this.isDestroyingPoster) {
            this.graphics.use("specialBlow")
            this.graphics.current.flipHorizontal = this.facingLeft
            return
        }

        if (engine.input.keyboard.isHeld(Keys.Left) || engine.input.keyboard.isHeld(Keys.A)) {
            this.vel.x = -300
            this.facingLeft = true
            this.graphics.use("walk")
            
        } else if (engine.input.keyboard.isHeld(Keys.Right) || engine.input.keyboard.isHeld(Keys.D)) {
            this.vel.x = 300
            this.facingLeft = false
            this.graphics.use("walk")
            
        } else {
            if (this.onGround) {
                this.graphics.use("idle")
            }
        }

        if (engine.input.keyboard.wasPressed(Keys.Up) || engine.input.keyboard.wasPressed(Keys.Space) || engine.input.keyboard.wasPressed(Keys.W)) {
            if (this.onGround) {
                this.vel.y = -850
                this.onGround = false 
                this.graphics.use("jump")
            }
        }

        if (!this.onGround) {
            this.graphics.use("jump")
        }

        this.graphics.current.flipHorizontal = this.facingLeft
    }
}