import { loadFromUrl } from '../utils/loader';

export const CHURCH = '/audio/church.wav';
export const FIRE = '/audio/fire.mp3';
export const LARGE_LONG_ECHO_HALL = '/audio/large-long-echo-hall.wav';
export const LARGE_WIDE_ECHO_HALL = '/audio/large-wide-echo-hall.wav';
export const MUFFLER = '/audio/muffler.wav';
export const PARKING = '/audio/parking.wav';
export const RADIO = '/audio/radio.wav';
export const SPRING = '/audio/spring.wav';
export const TELEPHONE = '/audio/telephone.wav';
export const UNDER_WATER = '/audio/underwater.mp3';

export default class AudioCache {

    private static _audioCaches: Dictionary<AudioBuffer> = {};

    static async get(url: string) {
        if (Reflect.has(this._audioCaches, url)) return Reflect.get(this._audioCaches, url);
        let audioBuffer = await loadFromUrl(url);
        this._audioCaches[url] = audioBuffer;
        return audioBuffer;
    }
}