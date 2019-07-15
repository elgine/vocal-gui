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

export const EFFECT_LANG_MAP = {
    [EffectType.ALIEN]: 'ALIEN',
    [EffectType.ROBOT1]: 'ROBOT1',
    [EffectType.ROBOT2]: 'ROBOT2',
    [EffectType.ASTRONAUT]: 'ASTRONAUT',
    [EffectType.UNCLE]: 'UNCLE',
    [EffectType.FEMALE]: 'FEMALE',
    [EffectType.CHILD]: 'CHILD',
    [EffectType.MALE]: 'MALE',
    [EffectType.OLD_MALE]: 'OLD_MALE',
    [EffectType.OLD_FEMALE]: 'OLD_FEMALE',
    [EffectType.TRANSFORMER]: 'TRANSFORMER',
    [EffectType.BALROG]: 'BALROG',
    [EffectType.CAVE]: 'CAVE',
    [EffectType.BROAD_ROOM]: 'BROAD_ROOM',
    [EffectType.UNDER_WATER]: 'UNDER_WATER',
    [EffectType.HALL]: 'HALL',
    [EffectType.MUFFLER]: 'MUFFLER',
    [EffectType.TELEPHONE]: 'TELEPHONE',
    [EffectType.RADIO]: 'RADIO',
    [EffectType.MEGAPHONE]: 'MEGAPHONE'
};

export const EFFECTS = [
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
    EffectType.BALROG,
    EffectType.CAVE,
    EffectType.BROAD_ROOM,
    EffectType.UNDER_WATER,
    EffectType.HALL,
    EffectType.MUFFLER,
    EffectType.TELEPHONE,
    EffectType.RADIO,
    EffectType.MEGAPHONE
];

export const EFFECT_CATEGORIES = [
    'CHARACTER',
    'ENVIRONMENT',
    'TOOL'
];

export const EFFECT_CATEGORY_MAP = {
    [EffectType.ALIEN]: 'CHARACTER',
    [EffectType.ROBOT1]: 'CHARACTER',
    [EffectType.ROBOT2]: 'CHARACTER',
    [EffectType.ASTRONAUT]: 'CHARACTER',
    [EffectType.UNCLE]: 'CHARACTER',
    [EffectType.FEMALE]: 'CHARACTER',
    [EffectType.CHILD]: 'CHARACTER',
    [EffectType.MALE]: 'CHARACTER',
    [EffectType.OLD_MALE]: 'CHARACTER',
    [EffectType.OLD_FEMALE]: 'CHARACTER',
    [EffectType.TRANSFORMER]: 'CHARACTER',
    [EffectType.BALROG]: 'CHARACTER',

    [EffectType.CAVE]: 'ENVIRONMENT',
    [EffectType.BROAD_ROOM]: 'ENVIRONMENT',
    [EffectType.UNDER_WATER]: 'ENVIRONMENT',
    [EffectType.HALL]: 'ENVIRONMENT',

    [EffectType.MUFFLER]: 'TOOL',
    [EffectType.TELEPHONE]: 'TOOL',
    [EffectType.RADIO]: 'TOOL',
    [EffectType.MEGAPHONE]: 'TOOL'
};