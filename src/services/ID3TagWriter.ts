import ID3Writer, { ID3WriterSupportFrames } from 'browser-id3-writer';

export default (buffer: ArrayBuffer, options: ID3WriterSupportFrames = {}) => {
    let writer = new ID3Writer(buffer);
    for (let frameType of Object.getOwnPropertyNames(options)) {
        writer.setFrame(frameType as any, options[frameType]);
    }
    writer.addTag();
    return writer.arrayBuffer;
};