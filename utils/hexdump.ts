function hexDump(buf: Buffer): string {
    let str = '    |   0  1  2  3  4  5  6  7 |  8  9  A  B  C  D  E  F\n';
    str +=    '---------------------------------------------------------------------------';
    const length = buf.byteLength;
    for (let i = 0; i < length; i++) {
        if (i % 16 === 0) {
            if (i !== 0) {
                str += ' | ';
                const s = buf.subarray(i - 16, i).toString('ascii');
                str += s.split('').map(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127 ? c : '.').join('');
            }
            str += `\n ${i.toString(16).padStart(2, '0')} | `;
        }
        if (i % 16 !== 0 && i % 8 === 0) {
            str += ' |';
        }
        str += ` ${buf.readUInt8(i).toString(16).padStart(2, '0')}`;
    }

    const remainder = length % 16;
    if (remainder === 0) {
        str += ' | ';
    } else if (remainder <= 8) {
        str += '   '.repeat(8 - remainder);
        str += ' |' + '   '.repeat(8) + ' | ';
    } else {
        str += '   '.repeat(16 - remainder) + ' | ';
    }
    const offset = remainder === 0 ? 16 : remainder;
    const s = buf.subarray(length - offset).toString('ascii');
    str += s.split('').map(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127 ? c : '.').join('');
    str += `\n ${length.toString(16).padStart(2, '0')}`;
    return str;
}
