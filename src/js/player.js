import { Actor, Keys, CollisionType, SpriteSheet, Animation, Vector, Side } from "excalibur"
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
        this.groundContacts = new Set()

        this.oneWayPlatforms = []
        this.previousBottom = this.pos.y
        this.dropThroughTimer = 0

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

    addOneWayPlatform(platform) {
        this.oneWayPlatforms.push(platform)
    }

    addGroundContact(actor) {
        this.groundContacts.add(actor)
        this.onGround = true
    }

    removeGroundContact(actor) {
        if (this.groundContacts.has(actor)) {
            this.groundContacts.delete(actor)
        }

        this.onGround = this.groundContacts.size > 0
    }

    isStandingOnOneWayPlatform() {
        for (const contact of this.groundContacts) {
            if (contact.isOneWayPlatform) {
                return true
            }
        }

        return false
    }

    removeOneWayGroundContacts() {
        for (const platform of this.oneWayPlatforms) {
            this.removeGroundContact(platform)
        }
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

        this.groundContacts.clear()
        this.onGround = false

        this.graphics.use("ko")
    }

    finishKnockout() {
        this.isKnockedOut = false
        this.hasBeenKnockedOutThisLevel = false
        
        this.knockoutStartTime = null
        this.knockoutIsHoldingFrame = false

        this.pos = new Vector(100, 500)
        this.vel = new Vector(0, 0)

        this.groundContacts.clear()
        this.onGround = false
        this.previousBottom = this.pos.y
        this.dropThroughTimer = 0

        this.collisionType = CollisionType.Active
        this.graphics.use("idle")

        if (typeof this.onKnockoutComplete === "function") {
            this.onKnockoutComplete()
        }
    }

    onPreUpdate(engine, delta) {
        this.previousBottom = this.pos.y

        if (this.dropThroughTimer > 0) {
            this.dropThroughTimer -= delta
        }

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

        const links =
            engine.input.keyboard.isHeld(Keys.Left) ||
            engine.input.keyboard.isHeld(Keys.A)

        const rechts =
            engine.input.keyboard.isHeld(Keys.Right) ||
            engine.input.keyboard.isHeld(Keys.D)

        const spring =
            engine.input.keyboard.wasPressed(Keys.Up) ||
            engine.input.keyboard.wasPressed(Keys.Space) ||
            engine.input.keyboard.wasPressed(Keys.W)

        const wilOmlaag =
            engine.input.keyboard.isHeld(Keys.S) ||
            engine.input.keyboard.isHeld(Keys.Down)

        if (links) {
            this.vel.x = -300
            this.facingLeft = true
        } else if (rechts) {
            this.vel.x = 300
            this.facingLeft = false
        }

        if (wilOmlaag && this.isStandingOnOneWayPlatform()) {
            this.dropThroughTimer = 250
            this.removeOneWayGroundContacts()
            this.pos.y += 5
        }

        if (spring && this.onGround && this.dropThroughTimer <= 0) {
            this.vel.y = -850

            this.groundContacts.clear()
            this.onGround = false

            this.graphics.use("jump")
        }

        if (!this.onGround) {
            this.graphics.use("jump")
        } else if (links || rechts) {
            this.graphics.use("walk")
        } else {
            this.graphics.use("idle")
        }

        this.graphics.current.flipHorizontal = this.facingLeft
    }

    onPostUpdate(engine, delta) {
        if (this.isKnockedOut) {
            return
        }

        this.checkOneWayPlatforms()
    }

    checkOneWayPlatforms() {
        if (this.dropThroughTimer > 0) {
            this.removeOneWayGroundContacts()
            return
        }

        const playerBottom = this.pos.y
        const playerLeft = this.pos.x - this.width / 2
        const playerRight = this.pos.x + this.width / 2

        for (const platform of this.oneWayPlatforms) {
            const platformTop = platform.getTop()
            const platformLeft = platform.getLeft()
            const platformRight = platform.getRight()

            const overlapX =
                playerRight > platformLeft + 4 &&
                playerLeft < platformRight - 4

            const spelerValtOfStaat = this.vel.y >= 0

            const kwamVanBoven =
                this.previousBottom <= platformTop + 10

            const isNuBijPlatform =
                playerBottom >= platformTop - 10 &&
                playerBottom <= platformTop + 25

            if (overlapX && spelerValtOfStaat && kwamVanBoven && isNuBijPlatform) {
                this.pos.y = platformTop
                this.vel.y = 0
                this.addGroundContact(platform)
            } else {
                this.removeGroundContact(platform)
            }
        }
    }

    onCollisionStart(self, other, side, contact) {
        if (side === Side.Bottom) {
            this.addGroundContact(other)
        }
    }

    onCollisionEnd(self, other, side, contact) {
        this.removeGroundContact(other)
    }
}