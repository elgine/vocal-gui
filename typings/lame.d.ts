declare module 'lamejs'{
    class Mp3Encoder {
        constructor(channels: number, sampleRate: number, bitRate: number);
        encodeBuffer(left: Float32Array, right?: Float32Array): Int8Array;
        flush(): Int8Array;
    }

    class WavHeader {
        static readHeader(): WavHeader;

        public dataOffset: number;
        public dataLen: number;
        public channels: number;
        public sampleRate: number;
    }
}