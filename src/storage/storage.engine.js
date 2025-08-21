import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

class HashStorage {
  constructor({ destination, filename }) {
    this.getDestination =
      typeof destination === 'string'
        ? (req, file, cb) => cb(null, destination)
        : destination || this.getOutDestination;
    this.getFilename = filename || this.getOutFilename;
  }

  getOutDestination(req, file, cb) {
    return cb(null, os.tmpdir());
  }

  getOutFilename(req, file, cb) {
    return crypto.randomBytes(16, (err, raw) =>
      cb(err, err ? undefined : raw.toString('hex'))
    );
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, destination) => {
      if (err) return cb(err);

      this.getOutFilename(req, file, (err, filename) => {
        if (err) return cb(err);

        fs.mkdirSync(destination, { recursive: true });

        const outPath = path.join(destination, filename);
        const outStream = fs.createWriteStream(outPath);

        file.stream.pipe(outStream);
        outStream.on('error', cb);
        const hash = crypto.createHash('md5');
        file.stream.pipe(hash);
        outStream.on('finish', () => {
          const fileParams = {
            ...file,
            destination,
            filename,
            path: path.join(destination, filename),
            size: outStream.bytesWritten,
            hash: hash.digest('hex')
          };
          this.getFilename(req, fileParams, (err, finalName) => {
            if (err) return cb(err);

            const finalPath = path.join(destination, finalName);
            fs.rename(outPath, finalPath, () => {
              cb(null, {
                ...fileParams,
                filename: finalName,
                path: finalPath
              });
            });
          });
        });
      });
    });
  }

  _removeFile(req, file, cb) {
    const path = file.path;
    delete file.destination;
    delete file.filename;
    delete file.path;
    fs.unlink(path, cb);
  }
}

export const hashStorage = (opts) => new HashStorage(opts);
