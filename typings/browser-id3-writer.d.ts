declare module 'browser-id3-writer'{
    export interface ID3WriterSupportFrames{
        /**
         * song title
         * @param {title}
         */
        TIT2?: string;

        /**
         * album title
         * @param {string}
         */
        TALB?: string;

        /**
         * song artists
         * @param {string[]}
         */
        TPE1?: string[];

        /**
         * album artist
         * @param {string}
         */
        TPE2?: string;

        /**
         * conductor/performer refinement
         * @param {string}
         */
        TPE3?: string;

        /**
         * interpreted, remixed, or otherwise modified by
         * @param {string}
         */
        TPE4?: string;

        /**
         * song number in album, ep: '5' or '5/10'
         * @param {string}
         */
        TRCK?: string;

        /**
         * album disc number, ep: '1' or '1/3'
         * @param {string}
         */
        TPOS?: string;

        /**
         * label name
         * @param {string}
         */
        TPUB?: string;

        /**
         * Initial key
         * @param {string}
         */
        TKEY?: string;

        /**
         * Media type
         * @param {string}
         */
        TMED?: string;

        /**
         * isrc - international standard recording code
         * @param {string}
         */
        TSRC?: string;

        /**
         * copyright message
         * @param {string}
         */
        TCOP?: string;

        /**
         * song composers
         * @param {string[]}
         */
        TCOM?: string[];

        /**
         * song genres
         * @param {string[]}
         */
        TCON?: string[];

        /**
         * song duration in milliseconds
         * @param {number}
         */
        TLEN?: number;

        /**
         * album release date expressed as DDMM
         * @param {number}
         */
        TDAT?: number;

        /**
         * album release year
         * @param {number}
         */
        TYER?: number;

        /**
         * beats per minute
         * @param {number}
         */
        TBPM?: number;

        /**
         * commercial information
         * @param {string}
         */
        WCOM?: string;

        /**
         * copyright/Legal information
         * @param {string}
         */
        WCOP?: string;

        /**
         * official audio file webpage
         * @param {string}
         */
        WOAF?: string;

        /**
         * official artist/performer webpage
         * @param {string}
         */
        WOAR?: string;

        /**
         * official audio source webpage
         * @param {string}
         */
        WOAS?: string;

        /**
         * official internet radio station homepage
         * @param {string}
         */
        WORS?: string;

        /**
         * payment
         * @param {string}
         */
        WPAY?: string;

        /**
         * publishers official webpage
         * @param {string}
         */
        WPUB?: string;
    }

    export default class ID3Writer {
        public arrayBuffer: ArrayBuffer;
        public padding: number;
        constructor(arrayBuffer: ArrayBuffer);
        setFrame<T extends keyof ID3WriterSupportFrames>(key: T, frame: ValueType<T, ID3WriterSupportFrames>): ID3Writer;
        addTag(): void;
        revokeURL(): void;
        getBlob(): string;
        getURL(): string;
    }
}