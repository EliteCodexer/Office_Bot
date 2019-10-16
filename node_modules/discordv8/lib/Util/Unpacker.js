"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pako = require("pako");

var _pako2 = _interopRequireDefault(_pako);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let erlpack = false;
try {
  erlpack = require("erlpack");
  console.log("using erlpack");
} catch (error) {
  console.log("erlpack failed to load, falling back to json, for performance reasons please consider installing erlpack");
  // no erlpack
}
const ZlibSuffix = 0xFFFF;

class Unpacker {
  constructor(useErlpack, useZlib, onPacket) {
    this.useErlpack = useErlpack;
    this.useZlib = useZlib;
    this.onPacket = onPacket;

    if (this.useZlib) {
      const chunks = [];

      this.inflate = new _pako2.default.Inflate({
        chunkSize: 65535,
        flush: _pako2.default.Z_SYNC_FLUSH,
        to: this.useErlpack ? '' : 'string'
      });

      this.inflate.onData = chunk => chunks.push(chunk);
      this.inflate.onEnd = () => {
        if (chunks.length === 0) return;
        const data = chunks.length === 1 ? chunks[0] : this.useErlpack ? Buffer.concat(chunks) : chunks.join('');
        chunks.length = 0;
        let unpacked;
        try {
          unpacked = this.unpack(data);
        } catch (err) {
          return;
        }
        onPacket(unpacked);
      };
    }
  }

  unpack(data) {
    if (!this.useErlpack && data instanceof Buffer) {
      data = _zlib2.default.inflateSync(data).toString();
    }
    if (!this.useErlpack || data[0] === '{') return JSON.parse(data);
    if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));
    return erlpack.unpack(data);
  }

  onMessage(buffer) {
    if (this.useZlib) {
      let end;
      if (buffer instanceof ArrayBuffer) {
        const view = new DataView(buffer);
        end = view.byteLength >= 4 && view.getUint32(view.byteLength - 4) === ZlibSuffix;
      } else {
        end = buffer.length >= 4 && buffer.readUInt32BE(buffer.length - 4) === ZlibSuffix;
      }
      this.inflate.push(buffer, end && _pako2.default.Z_SYNC_FLUSH);
    } else {
      this.onPacket(this.unpack(buffer));
    }
  }
}
exports.default = Unpacker;
//# sourceMappingURL=Unpacker.js.map
