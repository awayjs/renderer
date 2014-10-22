var AssetLoader = require("awayjs-core/lib/core/library/AssetLoader");
var AWDParser = require("awayjs-renderergl/lib/parsers/AWDParser");
var Max3DSParser = require("awayjs-renderergl/lib/parsers/Max3DSParser");
var MD2Parser = require("awayjs-renderergl/lib/parsers/MD2Parser");
var OBJParser = require("awayjs-renderergl/lib/parsers/OBJParser");
/**
 *
 */
var Parsers = (function () {
    function Parsers() {
    }
    /**
     * Short-hand function to enable all bundled parsers for auto-detection. In practice,
     * this is the same as invoking enableParsers(Parsers.ALL_BUNDLED) on any of the
     * loader classes SingleFileLoader, AssetLoader, AssetLibrary or Loader3D.
     *
     * See notes about file size in the documentation for the ALL_BUNDLED constant.
     *
     * @see away.parsers.Parsers.ALL_BUNDLED
     */
    Parsers.enableAllBundled = function () {
        AssetLoader.enableParsers(Parsers.ALL_BUNDLED);
    };
    /**
     * A list of all parsers that come bundled with Away3D. Use this to quickly
     * enable support for all bundled parsers to the file format auto-detection
     * feature, using any of the enableParsers() methods on loaders, e.g.:
     *
     * <code>AssetLibrary.enableParsers(Parsers.ALL_BUNDLED);</code>
     *
     * Beware however that this requires all parser classes to be included in the
     * SWF file, which will add 50-100 kb to the file. When only a limited set of
     * file formats are used, SWF file size can be saved by adding the parsers
     * individually using AssetLibrary.enableParser()
     *
     * A third way is to specify a parser for each loaded file, thereby bypassing
     * the auto-detection mechanisms altogether, while at the same time allowing
     * any properties that are unique to that parser to be set for that load.
     *
     * The bundled parsers are:
     *
     * <ul>
     * <li>AC3D (.ac)</li>
     * <li>Away Data version 1 ASCII and version 2 binary (.awd). AWD1 BSP unsupported</li>
     * <li>3DMax (.3ds)</li>
     * <li>DXF (.dxf)</li>
     * <li>Quake 2 MD2 models (.md2)</li>
     * <li>Doom 3 MD5 animation clips (.md5anim)</li>
     * <li>Doom 3 MD5 meshes (.md5mesh)</li>
     * <li>Wavefront OBJ (.obj)</li>
     * <li>Collada (.dae)</li>
     * <li>Images (.jpg, .png)</li>
     * </ul>
     *
     * @see away.library.AssetLibrary.enableParser
     */
    Parsers.ALL_BUNDLED = Array(AWDParser, Max3DSParser, MD2Parser, OBJParser);
    return Parsers;
})();
module.exports = Parsers;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvcGFyc2Vycy50cyJdLCJuYW1lcyI6WyJQYXJzZXJzIiwiUGFyc2Vycy5jb25zdHJ1Y3RvciIsIlBhcnNlcnMuZW5hYmxlQWxsQnVuZGxlZCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxXQUFXLFdBQWdCLDBDQUEwQyxDQUFDLENBQUM7QUFFOUUsSUFBTyxTQUFTLFdBQWdCLHlDQUF5QyxDQUFDLENBQUM7QUFDM0UsSUFBTyxZQUFZLFdBQWdCLDRDQUE0QyxDQUFDLENBQUM7QUFDakYsSUFBTyxTQUFTLFdBQWdCLHlDQUF5QyxDQUFDLENBQUM7QUFDM0UsSUFBTyxTQUFTLFdBQWdCLHlDQUF5QyxDQUFDLENBQUM7QUFFM0UsQUFHQTs7R0FERztJQUNHLE9BQU87SUFBYkEsU0FBTUEsT0FBT0E7SUFrRGJDLENBQUNBO0lBYkFEOzs7Ozs7OztPQVFHQTtJQUNXQSx3QkFBZ0JBLEdBQTlCQTtRQUVDRSxXQUFXQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtJQUNoREEsQ0FBQ0E7SUEvQ0RGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWdDR0E7SUFDV0EsbUJBQVdBLEdBQWlCQSxLQUFLQSxDQUFTQSxTQUFTQSxFQUFFQSxZQUFZQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQTtJQWV4R0EsY0FBQ0E7QUFBREEsQ0FsREEsQUFrRENBLElBQUE7QUFFRCxBQUFpQixpQkFBUixPQUFPLENBQUMiLCJmaWxlIjoicGFyc2Vycy9QYXJzZXJzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0TG9hZGVyXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9Bc3NldExvYWRlclwiKTtcblxuaW1wb3J0IEFXRFBhcnNlclx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL0FXRFBhcnNlclwiKTtcbmltcG9ydCBNYXgzRFNQYXJzZXJcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9NYXgzRFNQYXJzZXJcIik7XG5pbXBvcnQgTUQyUGFyc2VyXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvTUQyUGFyc2VyXCIpO1xuaW1wb3J0IE9CSlBhcnNlclx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL09CSlBhcnNlclwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBQYXJzZXJzXG57XG5cdC8qKlxuXHQgKiBBIGxpc3Qgb2YgYWxsIHBhcnNlcnMgdGhhdCBjb21lIGJ1bmRsZWQgd2l0aCBBd2F5M0QuIFVzZSB0aGlzIHRvIHF1aWNrbHlcblx0ICogZW5hYmxlIHN1cHBvcnQgZm9yIGFsbCBidW5kbGVkIHBhcnNlcnMgdG8gdGhlIGZpbGUgZm9ybWF0IGF1dG8tZGV0ZWN0aW9uXG5cdCAqIGZlYXR1cmUsIHVzaW5nIGFueSBvZiB0aGUgZW5hYmxlUGFyc2VycygpIG1ldGhvZHMgb24gbG9hZGVycywgZS5nLjpcblx0ICpcblx0ICogPGNvZGU+QXNzZXRMaWJyYXJ5LmVuYWJsZVBhcnNlcnMoUGFyc2Vycy5BTExfQlVORExFRCk7PC9jb2RlPlxuXHQgKlxuXHQgKiBCZXdhcmUgaG93ZXZlciB0aGF0IHRoaXMgcmVxdWlyZXMgYWxsIHBhcnNlciBjbGFzc2VzIHRvIGJlIGluY2x1ZGVkIGluIHRoZVxuXHQgKiBTV0YgZmlsZSwgd2hpY2ggd2lsbCBhZGQgNTAtMTAwIGtiIHRvIHRoZSBmaWxlLiBXaGVuIG9ubHkgYSBsaW1pdGVkIHNldCBvZlxuXHQgKiBmaWxlIGZvcm1hdHMgYXJlIHVzZWQsIFNXRiBmaWxlIHNpemUgY2FuIGJlIHNhdmVkIGJ5IGFkZGluZyB0aGUgcGFyc2Vyc1xuXHQgKiBpbmRpdmlkdWFsbHkgdXNpbmcgQXNzZXRMaWJyYXJ5LmVuYWJsZVBhcnNlcigpXG5cdCAqXG5cdCAqIEEgdGhpcmQgd2F5IGlzIHRvIHNwZWNpZnkgYSBwYXJzZXIgZm9yIGVhY2ggbG9hZGVkIGZpbGUsIHRoZXJlYnkgYnlwYXNzaW5nXG5cdCAqIHRoZSBhdXRvLWRldGVjdGlvbiBtZWNoYW5pc21zIGFsdG9nZXRoZXIsIHdoaWxlIGF0IHRoZSBzYW1lIHRpbWUgYWxsb3dpbmdcblx0ICogYW55IHByb3BlcnRpZXMgdGhhdCBhcmUgdW5pcXVlIHRvIHRoYXQgcGFyc2VyIHRvIGJlIHNldCBmb3IgdGhhdCBsb2FkLlxuXHQgKlxuXHQgKiBUaGUgYnVuZGxlZCBwYXJzZXJzIGFyZTpcblx0ICpcblx0ICogPHVsPlxuXHQgKiA8bGk+QUMzRCAoLmFjKTwvbGk+XG5cdCAqIDxsaT5Bd2F5IERhdGEgdmVyc2lvbiAxIEFTQ0lJIGFuZCB2ZXJzaW9uIDIgYmluYXJ5ICguYXdkKS4gQVdEMSBCU1AgdW5zdXBwb3J0ZWQ8L2xpPlxuXHQgKiA8bGk+M0RNYXggKC4zZHMpPC9saT5cblx0ICogPGxpPkRYRiAoLmR4Zik8L2xpPlxuXHQgKiA8bGk+UXVha2UgMiBNRDIgbW9kZWxzICgubWQyKTwvbGk+XG5cdCAqIDxsaT5Eb29tIDMgTUQ1IGFuaW1hdGlvbiBjbGlwcyAoLm1kNWFuaW0pPC9saT5cblx0ICogPGxpPkRvb20gMyBNRDUgbWVzaGVzICgubWQ1bWVzaCk8L2xpPlxuXHQgKiA8bGk+V2F2ZWZyb250IE9CSiAoLm9iaik8L2xpPlxuXHQgKiA8bGk+Q29sbGFkYSAoLmRhZSk8L2xpPlxuXHQgKiA8bGk+SW1hZ2VzICguanBnLCAucG5nKTwvbGk+XG5cdCAqIDwvdWw+XG5cdCAqXG5cdCAqIEBzZWUgYXdheS5saWJyYXJ5LkFzc2V0TGlicmFyeS5lbmFibGVQYXJzZXJcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgQUxMX0JVTkRMRUQ6QXJyYXk8T2JqZWN0PiA9IEFycmF5PE9iamVjdD4oQVdEUGFyc2VyLCBNYXgzRFNQYXJzZXIsIE1EMlBhcnNlciwgT0JKUGFyc2VyKTtcblxuXHQvKipcblx0ICogU2hvcnQtaGFuZCBmdW5jdGlvbiB0byBlbmFibGUgYWxsIGJ1bmRsZWQgcGFyc2VycyBmb3IgYXV0by1kZXRlY3Rpb24uIEluIHByYWN0aWNlLFxuXHQgKiB0aGlzIGlzIHRoZSBzYW1lIGFzIGludm9raW5nIGVuYWJsZVBhcnNlcnMoUGFyc2Vycy5BTExfQlVORExFRCkgb24gYW55IG9mIHRoZVxuXHQgKiBsb2FkZXIgY2xhc3NlcyBTaW5nbGVGaWxlTG9hZGVyLCBBc3NldExvYWRlciwgQXNzZXRMaWJyYXJ5IG9yIExvYWRlcjNELlxuXHQgKlxuXHQgKiBTZWUgbm90ZXMgYWJvdXQgZmlsZSBzaXplIGluIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgQUxMX0JVTkRMRUQgY29uc3RhbnQuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5wYXJzZXJzLlBhcnNlcnMuQUxMX0JVTkRMRURcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZW5hYmxlQWxsQnVuZGxlZCgpOnZvaWRcblx0e1xuXHRcdEFzc2V0TG9hZGVyLmVuYWJsZVBhcnNlcnMoUGFyc2Vycy5BTExfQlVORExFRCk7XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFyc2VyczsiXX0=