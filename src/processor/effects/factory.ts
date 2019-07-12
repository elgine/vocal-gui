import Effect from './effect';
import { EffectType } from '../effectType';
import Alien, { alienDefaultOptions } from './alien';
import Robot1 from './robot1';
import Robot2 from './robot2';
import Astronaut from './astronaut';
import Uncle, { uncleDefaultOptions } from './uncle';
import Female, { femaleDefaultOptions } from './female';
import Child, { childDefaultOptions } from './child';
import Male, { maleDefaultOptions } from './male';
import OldMale from './oldMale';
import OldFemale, { oldFemaleDefaultOptions } from './oldFemale';
import Transformer from './transformer';
import Balrog, { balrogDefaultOptions } from './balrog';
import Cave from './cave';
import BroadRoom from './broadRoom';
import UnderWater, { underWaterDefaultOptions } from './underWater';
import Hall from './hall';
import Muffler from './muffler';
import Telephone from './telephone';
import Radio from './radio';
import Megaphone from './megaphone';
import AudioCache, { FIRE, LARGE_WIDE_ECHO_HALL, LARGE_LONG_ECHO_HALL, UNDER_WATER, CHURCH, MUFFLER, RADIO } from '../audioCache';

export const createEffect = async (type: EffectType, ctx: BaseAudioContext) => {
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
        case EffectType.OLD_MALE: effect = new OldMale(ctx); break;
        case EffectType.OLD_FEMALE: effect = new OldFemale(ctx); break;
        case EffectType.TRANSFORMER: effect = new Transformer(ctx); break;
        case EffectType.BALROG:
            effect = new Balrog(ctx, await AudioCache.get(LARGE_WIDE_ECHO_HALL), await AudioCache.get(FIRE));
            break;
        case EffectType.CAVE:
            effect = new Cave(ctx, await AudioCache.get(LARGE_LONG_ECHO_HALL));
            break;
        case EffectType.BROAD_ROOM:
            effect = new BroadRoom(ctx, await AudioCache.get(LARGE_WIDE_ECHO_HALL));
            break;
        case EffectType.UNDER_WATER:
            effect = new UnderWater(ctx, await AudioCache.get(UNDER_WATER));
            break;
        case EffectType.HALL:
            effect = new Hall(ctx, await AudioCache.get(CHURCH));
            break;
        case EffectType.MUFFLER:
            effect = new Muffler(ctx, await AudioCache.get(MUFFLER));
            break;
        case EffectType.RADIO:
            effect = new Radio(ctx, await AudioCache.get(RADIO));
            break;
        case EffectType.TELEPHONE: effect = new Telephone(ctx); break;
        case EffectType.MEGAPHONE: effect = new Megaphone(ctx); break;
    }
    return effect;
};

export const createEffectOptions = (type: EffectType) => {
    let options: any = {};
    switch (type) {
        case EffectType.ALIEN: options = alienDefaultOptions; break;
        case EffectType.BALROG: options = balrogDefaultOptions; break;
        case EffectType.CHILD: options = childDefaultOptions; break;
        case EffectType.FEMALE: options = femaleDefaultOptions; break;
        case EffectType.MALE: options = maleDefaultOptions; break;
        case EffectType.OLD_FEMALE: options = oldFemaleDefaultOptions; break;
        case EffectType.OLD_MALE: options = maleDefaultOptions; break;
        case EffectType.UNCLE: options = uncleDefaultOptions; break;
        case EffectType.UNDER_WATER: options = underWaterDefaultOptions; break;
    }
    options.gain = 1;
    return options;
};