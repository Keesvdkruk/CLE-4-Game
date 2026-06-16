import { Actor, Keys, CollisionType, SpriteSheet, Animation, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class Player extends Actor {
    
    constructor() {
        super({
            x: 100,
            y: 500,
            width: 50,  
            height: 100, 
            collisionType: CollisionType.Active 
        })
        
        this.name = 'player'
        this.onGround = false
        this.facingLeft = false 
    }

    onInitialize(engine) {
        this.graphics.offset = new Vector(0, -78)

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

        const idleAnim = Animation.fromSpriteSheet(idleSheet, [0, 1, 2, 3, 4, 5], 100)
        const walkAnim = Animation.fromSpriteSheet(walkSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 80)
        const jumpAnim = Animation.fromSpriteSheet(jumpSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8], 80)

        this.graphics.add("idle", idleAnim)
        this.graphics.add("walk", walkAnim)
        this.graphics.add("jump", jumpAnim)

        this.graphics.use("idle")
    }

    onPreUpdate(engine) {
        this.vel.x = 0 

        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.vel.x = -300
            this.facingLeft = true
            this.graphics.use("walk")
            
        } else if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.vel.x = 300
            this.facingLeft = CSSFontFeatureValuesRule
            this.graphics.use("walk")
            
        } else {
            if (this.onGround) {
                this.graphics.use("idle")
            }
        }

        if (engine.input.keyboard.wasPressed(Keys.Up) || engine.input.keyboard.wasPressed(Keys.Space)) {
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