/**
 *
 */
var BitFlags = (function () {
    function BitFlags() {
    }
    BitFlags.test = function (flags, testFlag) {
        return (flags & testFlag) == testFlag;
    };
    BitFlags.FLAG1 = 1;
    BitFlags.FLAG2 = 2;
    BitFlags.FLAG3 = 4;
    BitFlags.FLAG4 = 8;
    BitFlags.FLAG5 = 16;
    BitFlags.FLAG6 = 32;
    BitFlags.FLAG7 = 64;
    BitFlags.FLAG8 = 128;
    BitFlags.FLAG9 = 256;
    BitFlags.FLAG10 = 512;
    BitFlags.FLAG11 = 1024;
    BitFlags.FLAG12 = 2048;
    BitFlags.FLAG13 = 4096;
    BitFlags.FLAG14 = 8192;
    BitFlags.FLAG15 = 16384;
    BitFlags.FLAG16 = 32768;
    return BitFlags;
})();
module.exports = BitFlags;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvYml0ZmxhZ3MudHMiXSwibmFtZXMiOlsiQml0RmxhZ3MiLCJCaXRGbGFncy5jb25zdHJ1Y3RvciIsIkJpdEZsYWdzLnRlc3QiXSwibWFwcGluZ3MiOiJBQUFBLEFBR0E7O0dBREc7SUFDRyxRQUFRO0lBQWRBLFNBQU1BLFFBQVFBO0lBdUJkQyxDQUFDQTtJQUpjRCxhQUFJQSxHQUFsQkEsVUFBbUJBLEtBQVlBLEVBQUVBLFFBQWVBO1FBRS9DRSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxRQUFRQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFwQmFGLGNBQUtBLEdBQVVBLENBQUNBLENBQUNBO0lBQ2pCQSxjQUFLQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNqQkEsY0FBS0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDakJBLGNBQUtBLEdBQVVBLENBQUNBLENBQUNBO0lBQ2pCQSxjQUFLQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUNsQkEsY0FBS0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDbEJBLGNBQUtBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ2xCQSxjQUFLQSxHQUFVQSxHQUFHQSxDQUFDQTtJQUNuQkEsY0FBS0EsR0FBVUEsR0FBR0EsQ0FBQ0E7SUFDbkJBLGVBQU1BLEdBQVVBLEdBQUdBLENBQUNBO0lBQ3BCQSxlQUFNQSxHQUFVQSxJQUFJQSxDQUFDQTtJQUNyQkEsZUFBTUEsR0FBVUEsSUFBSUEsQ0FBQ0E7SUFDckJBLGVBQU1BLEdBQVVBLElBQUlBLENBQUNBO0lBQ3JCQSxlQUFNQSxHQUFVQSxJQUFJQSxDQUFDQTtJQUNyQkEsZUFBTUEsR0FBVUEsS0FBS0EsQ0FBQ0E7SUFDdEJBLGVBQU1BLEdBQVVBLEtBQUtBLENBQUNBO0lBTXJDQSxlQUFDQTtBQUFEQSxDQXZCQSxBQXVCQ0EsSUFBQTtBQUVELEFBQWtCLGlCQUFULFFBQVEsQ0FBQyIsImZpbGUiOiJwYXJzZXJzL2RhdGEvQml0RmxhZ3MuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICovXG5jbGFzcyBCaXRGbGFnc1xue1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxOm51bWJlciA9IDE7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzI6bnVtYmVyID0gMjtcblx0cHVibGljIHN0YXRpYyBGTEFHMzpudW1iZXIgPSA0O1xuXHRwdWJsaWMgc3RhdGljIEZMQUc0Om51bWJlciA9IDg7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzU6bnVtYmVyID0gMTY7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzY6bnVtYmVyID0gMzI7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzc6bnVtYmVyID0gNjQ7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzg6bnVtYmVyID0gMTI4O1xuXHRwdWJsaWMgc3RhdGljIEZMQUc5Om51bWJlciA9IDI1Njtcblx0cHVibGljIHN0YXRpYyBGTEFHMTA6bnVtYmVyID0gNTEyO1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMTpudW1iZXIgPSAxMDI0O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMjpudW1iZXIgPSAyMDQ4O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMzpudW1iZXIgPSA0MDk2O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxNDpudW1iZXIgPSA4MTkyO1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxNTpudW1iZXIgPSAxNjM4NDtcblx0cHVibGljIHN0YXRpYyBGTEFHMTY6bnVtYmVyID0gMzI3Njg7XG5cblx0cHVibGljIHN0YXRpYyB0ZXN0KGZsYWdzOm51bWJlciwgdGVzdEZsYWc6bnVtYmVyKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gKGZsYWdzICYgdGVzdEZsYWcpID09IHRlc3RGbGFnO1xuXHR9XG59XG5cbmV4cG9ydCA9IEJpdEZsYWdzOyJdfQ==