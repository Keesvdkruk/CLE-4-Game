import { ImageSource, FontSource, Loader } from 'excalibur'

export const Resources = {
    Idle: new ImageSource('/images/Idle.png'),
    Walk: new ImageSource('/images/Walk.png'),
    Jump: new ImageSource('/images/Jump.png'),
    Attack: new ImageSource('/images/Attack_1.png'),
    SpecialBlow2: new ImageSource('/player/Special_Blow_2.png'),
    KO: new ImageSource('/player/K.O..png'),
    DroneWalk: new ImageSource('/drone_sprites/Walk.png'),
    TraderIdle: new ImageSource('/Trader_1/Idle.png'),
    TraderDialogue: new ImageSource('/Trader_1/Dialogue.png'),
    PropagandaPoster: new ImageSource('/images/propaganda_poster.png'),
    Npc1Idle1: new ImageSource('/Homeless_1/Idle.png'),
    Npc1Idle2: new ImageSource('/Homeless_1/Idle_2.png'),

    Bg1: new ImageSource('/images/1.png'), 
    Bg2: new ImageSource('/images/2.png'),
    Bg3: new ImageSource('/images/3.png'),
    Bg4: new ImageSource('/images/4.png'),

    BgSouthreach: new ImageSource('/southreach/Night/1.png'),
    BgSouthreach2: new ImageSource('/southreach/Night/2.png'),
    BgSouthreach3: new ImageSource('/southreach/Night/3.png'),
    BgSouthreach4: new ImageSource('/southreach/Night/4.png'),
    BgSouthreach5: new ImageSource('/southreach/Night/5.png'),

    Eastwatch1: new ImageSource('/images/Eastwatch1.png'),
    Eastwatch2: new ImageSource('/images/Eastwatch2.png'),
    Eastwatch3: new ImageSource('/images/Eastwatch3.png'),
    Eastwatch4: new ImageSource('/images/Eastwatch4.png'),

    Platform: new ImageSource('/images/Platform.png'),

    PixelFont: new FontSource('/fonts/pixel.ttf', 'MijnPixelFont') 
}

export const ResourceLoader = new Loader(Object.values(Resources))