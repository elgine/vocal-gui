import Effect, { effectDefaultOptions, effectDescriptor } from './effect';
import { EffectType } from '../effectType';
import Alien, { alienDefaultOptions, alienDescriptor } from './alien';
import Robot1 from './robot1';
import Robot2 from './robot2';
import Astronaut from './astronaut';
import Uncle, { uncleDefaultOptions, uncleDescriptor } from './uncle';
import Female, { femaleDefaultOptions, femaleDescriptor } from './female';
import Child, { childDefaultOptions, childDescriptor } from './child';
import Male, { maleDefaultOptions, maleDescriptor } from './male';
import OldMale, { oldMaleDescriptor, oldMaleDefaultOptions } from './oldMale';
import OldFemale, { oldFemaleDefaultOptions, oldFemaleDescriptor } from './oldFemale';
import Transformer from './transformer';
import Balrog, { balrogDefaultOptions, balrogDescriptor } from './balrog';
import Cave from './cave';
import BroadRoom from './broadRoom';
import UnderWater, { underWaterDefaultOptions, underWaterDescriptor } from './underWater';
import Hall from './hall';
import Muffler from './muffler';
import Telephone from './telephone';
import Radio from './radio';
import Megaphone from './megaphone';
import AudioCache, { FIRE, LARGE_WIDE_ECHO_HALL, LARGE_LONG_ECHO_HALL, UNDER_WATER, CHURCH, MUFFLER, RADIO } from '../audioCache';

export const createEffect = (type: EffectType, ctx: BaseAudioContext, ...args: any[]) => {
    let effect: Effect|null = null;
    switch (type) {
        case EffectType.ALIEN: effect = new Alien(ctx); break;
        case EffectType.ROBOT1: effect = new Robot1(ctx); break;
        case EffectType.ROBOT2: effect = new Robot2(ctx); break;
        case EffectType.ASTRONAUT: effect = new Astronaut(ctx); break;
        case EffectType.UNCLE: effect = new Uncle(ctx); break;
        case EffectType.FEMALE: effect = new Female(ctx); break;
        case EffectType.CHILD: effect = new Child(ctx); break;
        case EffectType.MALE: effect = new Male(ctx); break;
        case EffectType.OLD_MALE: effect = new OldMale(ctx, ...args); break;
        case EffectType.OLD_FEMALE: effect = new OldFemale(ctx, ...args); break;
        case EffectType.TRANSFORMER: effect = new Transformer(ctx); break;
        case EffectType.BALROG:
            effect = new Balrog(ctx, AudioCache.get(LARGE_WIDE_ECHO_HALL), AudioCache.get(FIRE));
            break;
        case EffectType.CAVE:
            effect = new Cave(ctx, AudioCache.get(LARGE_LONG_ECHO_HALL));
            break;
        case EffectType.BROAD_ROOM:
            effect = new BroadRoom(ctx, AudioCache.get(LARGE_WIDE_ECHO_HALL));
            break;
        case EffectType.UNDER_WATER:
            effect = new UnderWater(ctx, AudioCache.get(UNDER_WATER));
            break;
        case EffectType.HALL:
            effect = new Hall(ctx, AudioCache.get(CHURCH));
            break;
        case EffectType.MUFFLER:
            effect = new Muffler(ctx, AudioCache.get(MUFFLER));
            break;
        case EffectType.RADIO:
            effect = new Radio(ctx, AudioCache.get(RADIO));
            break;
        case EffectType.TELEPHONE: effect = new Telephone(ctx); break;
        case EffectType.MEGAPHONE: effect = new Megaphone(ctx); break;
        default:
            effect = new Effect(ctx);
            break;
    }
    return effect;
};

export const getAllDurationApplyEffect = (type: EffectType, options: any, dur: number) => {
    return getDurationApplyEffect(type, options, dur) + getDelayApplyEffect(type, options, dur);
};

export const getDelayApplyEffect = (type: EffectType, options: any, dur: number) => {
    if (type === EffectType.OLD_FEMALE || type === EffectType.OLD_MALE) {
        return Math.max((1 - (options.tempo || 1)), 0) * dur + (options.vibratoDelay || 0);
    }
    return 0;
};

export const getDurationApplyEffect = (type: EffectType, options: any, dur: number) => {
    if (type === EffectType.OLD_FEMALE || type === EffectType.OLD_MALE) {
        return dur * (options.tempo || 1);
    }
    return dur;
};

export const isEffectNeedBuffering = (type: EffectType) => {
    if (type === EffectType.OLD_FEMALE || type === EffectType.OLD_MALE) {
        return true;
    }
    return false;
};

export const getEffectDescriptor = (type: EffectType) => {
    let descriptor: any = {};
    switch (type) {
        case EffectType.ALIEN: descriptor = alienDescriptor; break;
        case EffectType.BALROG: descriptor = balrogDescriptor; break;
        case EffectType.CHILD: descriptor = childDescriptor; break;
        case EffectType.FEMALE: descriptor = femaleDescriptor; break;
        case EffectType.MALE: descriptor = maleDescriptor; break;
        case EffectType.OLD_FEMALE: descriptor = oldFemaleDescriptor; break;
        case EffectType.OLD_MALE: descriptor = oldMaleDescriptor; break;
        case EffectType.UNCLE: descriptor = uncleDescriptor; break;
        case EffectType.UNDER_WATER: descriptor = underWaterDescriptor; break;
        default: descriptor = effectDescriptor; break;
    }
    return descriptor;
};

export const getEffectOptions = (type: EffectType) => {
    let options: any = {};
    switch (type) {
        case EffectType.ALIEN: options = alienDefaultOptions; break;
        case EffectType.BALROG: options = balrogDefaultOptions; break;
        case EffectType.CHILD: options = childDefaultOptions; break;
        case EffectType.FEMALE: options = femaleDefaultOptions; break;
        case EffectType.MALE: options = maleDefaultOptions; break;
        case EffectType.OLD_FEMALE: options = oldFemaleDefaultOptions; break;
        case EffectType.OLD_MALE: options = oldMaleDefaultOptions; break;
        case EffectType.UNCLE: options = uncleDefaultOptions; break;
        case EffectType.UNDER_WATER: options = underWaterDefaultOptions; break;
        default: options = effectDefaultOptions; break;
    }
    return options;
};