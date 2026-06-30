import { ImageSource, FontSource, Loader, Sound, SpriteSheet } from 'excalibur'

export const Resources = {

    //UI 
    UiSpriteSheet: new ImageSource('./UI/bars.png'),

    // Player Sprites
    Idle: new ImageSource('./player/Idle.png'),
    Walk: new ImageSource('./player/Walk.png'),
    Jump: new ImageSource('./player/Jump.png'),
    Attack: new ImageSource('./player/Attack_1.png'),
    SpecialBlow2: new ImageSource('./player/Special_Blow_2.png'),
    KO: new ImageSource('./player/KO.png'),

    //Drone
    DroneWalk: new ImageSource('./drone_sprites/Walk.png'),

    //TraderNpc
    TraderIdle: new ImageSource('./Trader_1/Idle.png'),
    TraderDialogue: new ImageSource('./Trader_1/Dialogue.png'),

    //HomelessNpc
    Npc1Idle1: new ImageSource('./Homeless_1/Idle.png'),
    Npc1Idle2: new ImageSource('./Homeless_1/Idle_2.png'),

    //Kees:
    BgSouthreach1: new ImageSource('./southreach/southreach1.png'),
    BgSouthreach: new ImageSource('./southreach/Night/1.png'),
    BgSouthreach2: new ImageSource('./southreach/Night/2.png'),
    BgSouthreach3: new ImageSource('./southreach/Night/3.png'),
    BgSouthreach4: new ImageSource('./southreach/Night/4.png'),
    BgSouthreach5: new ImageSource('./southreach/Night/5.png'),

    //Diana:
    BgIronvale: new ImageSource('./ironvale/ironvale1.png'),

    BgFactory: new ImageSource('./ironvale/factory.png'),

    IronvaleIntro: new ImageSource('./ironvale/ironvale.png'),

    IronvaleDrone1Forward: new ImageSource('./ironvale/Drone1-Forward.png'),
    IronvaleDrone2Forward: new ImageSource('./ironvale/Drone2-Forward.png'),

    Worker: new ImageSource('./ironvale/worker.png'),

    PrisonerCageClosed: new ImageSource('./ironvale/prisoner.png'),
    PrisonerCageOpen: new ImageSource('./ironvale/cage.png'),

    //Efe:
    EastwatchOutside: new ImageSource('./eastwatch/eastwatchoutside.png'),
    EastwatchInside: new ImageSource('./eastwatch/eastwatchinside.png'),
    Guard: new ImageSource('./eastwatch/guard.png'),

    // Objects
    Platform: new ImageSource('./images/Platform.png'),

    // Posters
    IronvalePoster: new ImageSource('./posters/ironvalePoster.png'),
    PropagandaPoster: new ImageSource('./posters/propagandaPoster.png'),
    PropagandaPoster2: new ImageSource('./posters/propagandaPoster2.png'),
    PropagandaPoster3: new ImageSource('./posters/propagandaPoster3.png'),

    // Fonts
    PixelFont: new FontSource('./fonts/pixel.ttf', 'MijnPixelFont'),

    // dave
    VestraCity: new ImageSource('./images/vestracity.png'),
    VestraGate: new ImageSource('./images/vestragate.png'),
    GuardVision: new ImageSource('./images/guardvision.png'),
    GameOver: new ImageSource('./images/gameover.png'),

    Keycard: new ImageSource('./images/keycard.png'),
    VestraInside: new ImageSource('./images/vestrainside.png'),
    VestraInsideOpen: new ImageSource('./images/vestrainside_open.png'),

    ProtestantWalk: new ImageSource('./images/protestant_walk.png'),
    SpeechBubble: new ImageSource("./images/speechbubble.png"),
    CityRoad: new ImageSource('./images/CityRoad.png'),
    CityRoad_2: new ImageSource('./images/CityRoad_2.png'),
    CityRoad_3: new ImageSource('./images/CityRoad_3.png'),
    Bullet: new ImageSource('./images/bullet.png'),
    SquareBackground: new ImageSource("./images/square_background.png"),
    SquareBroken: new ImageSource("./images/Square_Broken.png"),
    Npc_1: new ImageSource("./images/Npc_1.png"),
    Npc_2: new ImageSource("./images/Npc_2.png"),
    President: new ImageSource("./images/President.png"),
   President_kneel: new ImageSource("./images/President_kneel.png"),
   EndScreen: new ImageSource("./images/Endscreen.png"),
   ViolentEndScreen: new ImageSource("./images/ViolentEndscreen.png"),
   StartScreen: new ImageSource("./images/StartScreen.png"),
   Gunshot: new Sound("./Sounds/Gunshot.wav"),

}

export const UiSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.UiSpriteSheet, 
    grid: {
        rows: 6,       
        columns: 5,    
        spriteWidth: 48, 
        spriteHeight: 16 
    }
})

export const ResourceLoader = new Loader(Object.values(Resources))
ResourceLoader.suppressPlayButton = true