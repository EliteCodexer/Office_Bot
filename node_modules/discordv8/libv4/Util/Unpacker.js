"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pako = require("pako");

var _pako2 = _interopRequireDefault(_pako);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var erlpack = false;
try {
  erlpack = require("erlpack");
  console.log("using erlpack");
} catch (error) {
  console.log("erlpack failed to load, falling back to json, for performance reasons please consider installing erlpack");
  // no erlpack
}
var ZlibSuffix = 0xFFFF;

var Unpacker = function () {
  function Unpacker(useErlpack, useZlib, onPacket) {
    var _this = this;

    _classCallCheck(this, Unpacker);

    this.useErlpack = useErlpack;
    this.useZlib = useZlib;
    this.onPacket = onPacket;

    if (this.useZlib) {
      var chunks = [];

      this.inflate = new _pako2.default.Inflate({
        chunkSize: 65535,
        flush: _pako2.default.Z_SYNC_FLUSH,
        to: this.useErlpack ? '' : 'string'
      });

      this.inflate.onData = function (chunk) {
        return chunks.push(chunk);
      };
      this.inflate.onEnd = function () {
        if (chunks.length === 0) return;
        var data = chunks.length === 1 ? chunks[0] : _this.useErlpack ? Buffer.concat(chunks) : chunks.join('');
        chunks.length = 0;
        var unpacked = void 0;
        try {
          unpacked = _this.unpack(data);
        } catch (err) {
          return;
        }
        onPacket(unpacked);
      };
    }
  }

  _createClass(Unpacker, [{
    key: "unpack",
    value: function unpack(data) {
      if (!this.useErlpack && data instanceof Buffer) {
        data = _zlib2.default.inflateSync(data).toString();
      }
      if (!this.useErlpack || data[0] === '{') return JSON.parse(data);
      if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));
      return erlpack.unpack(data);
    }
  }, {
    key: "onMessage",
    value: function onMessage(buffer) {
      if (this.useZlib) {
        var end = void 0;
        if (buffer instanceof ArrayBuffer) {
          var view = new DataView(buffer);
          end = view.byteLength >= 4 && view.getUint32(view.byteLength - 4) === ZlibSuffix;
        } else {
          end = buffer.length >= 4 && buffer.readUInt32BE(buffer.length - 4) === ZlibSuffix;
        }
        this.inflate.push(buffer, end && _pako2.default.Z_SYNC_FLUSH);
      } else {
        this.onPacket(this.unpack(buffer));
      }
    }
  }]);

  return Unpacker;
}();

exports.default = Unpacker;
//# sourceMappingURL=Unpacker.js.map
