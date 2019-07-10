export enum EffectType{
    NONE,
    // Character
    ALIEN,
    ROBOT1,
    ROBOT2,
    ASTRONAUT,
    UNCLE,
    FEMALE,
    CHILD,
    MALE,
    OLD_MALE,
    OLD_FEMALE,
    TRANSFORMER,
    BALROG,
    // Environment
    CAVE,
    BROAD_ROOM,
    UNDER_WATER,
    HALL,
    // Tools
    MUFFLER,
    TELEPHONE,
    RADIO,
    MEGAPHONE
}

export const CHARACTER_EFFECTS = [
    EffectType.ALIEN,
    EffectType.ROBOT1,
    EffectType.ROBOT2,
    EffectType.ASTRONAUT,
    EffectType.UNCLE,
    EffectType.FEMALE,
    EffectType.CHILD,
    EffectType.MALE,
    EffectType.OLD_MALE,
    EffectType.OLD_FEMALE,
    EffectType.TRANSFORMER,
    EffectType.BALROG
];

export const ENVIRONMENT_EFFECTS = [
    EffectType.CAVE,
    EffectType.BROAD_ROOM,
    EffectType.UNDER_WATER,
    EffectType.HALL
];

export const TOOL_EFFECTS = [
    EffectType.MUFFLER,
    EffectType.TELEPHONE,
    EffectType.RADIO,
    EffectType.MEGAPHONE
];

export interface EffectOptions{
    gain: number;
}

export default class Effect {

    protected _audioContext: BaseAudioContext;
    protected _gain: GainNode;

    constructor(audioContext: BaseAudioContext) {
        this._audioContext = audioContext;
        this._gain = this._audioContext.createGain();
    }

    start() {

    }

    stop() {

    }

    set<T extends EffectOptions>(options: AnyOf<T>) {
        if (options.gain !== undefined) {
            this._gain.gain.value = options.gain;
        }
    }

    dispose() {
        this._gain.disconnect();
    }

    get input(): AudioNode {
        return this._gain;
    }

    get output() {
        return this._gain;
    }
}