import { ImageSource, FontSource, Loader, Sound } from 'excalibur'

export const Resources = {

    // Player Sprites
    Idle: new ImageSource('/player/Idle.png'),
    Walk: new ImageSource('/player/Walk.png'),
    Jump: new ImageSource('/player/Jump.png'),
    Attack: new ImageSource('/player/Attack_1.png'),
    SpecialBlow2: new ImageSource('/player/Special_Blow_2.png'),
    KO: new ImageSource('/player/K.O..png'),

    //Drone
    DroneWalk: new ImageSource('/drone_sprites/Walk.png'),

    //TraderNpc
    TraderIdle: new ImageSource('/Trader_1/Idle.png'),
    TraderDialogue: new ImageSource('/Trader_1/Dialogue.png'),

    //HomelessNpc
    Npc1Idle1: new ImageSource('/Homeless_1/Idle.png'),
    Npc1Idle2: new ImageSource('/Homeless_1/Idle_2.png'),

    //Kees:
    BgSouthreach: new ImageSource('/southreach/Night/1.png'),
    BgSouthreach2: new ImageSource('/southreach/Night/2.png'),
    BgSouthreach3: new ImageSource('/southreach/Night/3.png'),
    BgSouthreach4: new ImageSource('/southreach/Night/4.png'),
    BgSouthreach5: new ImageSource('/southreach/Night/5.png'),

    //Diana:
    BgIronvale: new ImageSource('/ironvale/ironvale1.png'),
    Bg2Ironvale: new ImageSource('/ironvale/ironvale2.png'),
    Bg3Ironvale: new ImageSource('/ironvale/ironvale3.png'),
    Bg4Ironvale: new ImageSource('/ironvale/ironvale4.png'),

    BgFactory1: new ImageSource('/ironvale/factory1.png'),
    BgFactory2: new ImageSource('/ironvale/factory2.png'),
    BgFactory3: new ImageSource('/ironvale/factory3.png'),

    IronvaleIntro: new ImageSource('/ironvale/ironvale.png'),


    //Efe:
    Eastwatch1: new ImageSource('/eastwatch/Eastwatch1.png'),
    Eastwatch2: new ImageSource('/eastwatch/Eastwatch2.png'),
    Eastwatch3: new ImageSource('/eastwatch/Eastwatch3.png'),
    Eastwatch4: new ImageSource('/eastwatch/Eastwatch4.png'),

    // Objects
    Platform: new ImageSource('/images/Platform.png'),

    // Posters
    IronvalePoster: new ImageSource('/posters/ironvalePoster.png'),
    PropagandaPoster: new ImageSource('/posters/propagandaPoster.png'),

    // Fonts
    PixelFont: new FontSource('/fonts/pixel.ttf', 'MijnPixelFont'),

    // dave
    VestraCity: new ImageSource('/images/vestracity.png'),
    VestraGate: new ImageSource('/images/vestragate.png'),
    GuardVision: new ImageSource('/images/guardvision.png'),
    GameOver: new ImageSource('/images/gameover.png'),

    Keycard: new ImageSource('/images/keycard.png'),
    VestraInside: new ImageSource('/images/vestrainside.png'),
    VestraInsideOpen: new ImageSource('/images/vestrainside_open.png'),

    ProtestantWalk: new ImageSource('/images/protestant_walk.png'),
    SpeechBubble: new ImageSource("/images/speechbubble.png"),
    CityRoad: new ImageSource('/images/CityRoad.png'),
    CityRoad_2: new ImageSource('/images/CityRoad_2.png'),
    CityRoad_3: new ImageSource('/images/CityRoad_3.png'),
    Bullet: new ImageSource('/images/bullet.png'),
    SquareBackground: new ImageSource("/images/square_background.png"),
    SquareBroken: new ImageSource("/images/Square_Broken.png"),
    Npc_1: new ImageSource("/images/Npc_1.png"),
    Npc_2: new ImageSource("/images/Npc_2.png"),
    President: new ImageSource("/images/President.png"),
   President_kneel: new ImageSource("/images/President_kneel.png"),
   EndScreen: new ImageSource("/images/Endscreen.png"),
   StartScreen: new ImageSource("/images/StartScreen.png"),
   Gunshot: new Sound("/Sounds/Gunshot.wav"),

}

export const ResourceLoader = new Loader(Object.values(Resources))