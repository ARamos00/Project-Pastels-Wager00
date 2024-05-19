const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const debug = require('debug')('checkFileConsistency');

const filePath = path.resolve(__dirname, '../../data.csv');
const checksumFile = path.resolve(__dirname, 'checksum.txt');

const getFileChecksum = (file) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(file);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
};

const checkFileConsistency = async () => {
    if (!fs.existsSync(filePath)) {
        debug('File not found:', filePath);
        return false;
    }

    const currentChecksum = await getFileChecksum(filePath);
    if (fs.existsSync(checksumFile)) {
        const storedChecksum = fs.readFileSync(checksumFile, 'utf-8');
        if (storedChecksum === currentChecksum) {
            debug('File is consistent');
            return true;
        }
    }

    fs.writeFileSync(checksumFile, currentChecksum);
    debug('File checksum updated');
    return false;
};

module.exports = checkFileConsistency;



