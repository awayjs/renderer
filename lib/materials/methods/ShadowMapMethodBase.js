var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var ShadingMethodBase = require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");
/**
 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
 */
var ShadowMapMethodBase = (function (_super) {
    __extends(ShadowMapMethodBase, _super);
    /**
     * Creates a new ShadowMapMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    function ShadowMapMethodBase(castingLight) {
        _super.call(this);
        this._pEpsilon = .02;
        this._pAlpha = 1;
        this._pCastingLight = castingLight;
        castingLight.castsShadows = true;
        this._pShadowMapper = castingLight.shadowMapper;
    }
    Object.defineProperty(ShadowMapMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.SHADOW_MAP_METHOD;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "alpha", {
        /**
         * The "transparency" of the shadows. This allows making shadows less strong.
         */
        get: function () {
            return this._pAlpha;
        },
        set: function (value) {
            this._pAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "castingLight", {
        /**
         * The light casting the shadows.
         */
        get: function () {
            return this._pCastingLight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "epsilon", {
        /**
         * A small value to counter floating point precision errors when comparing values in the shadow map with the
         * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
         */
        get: function () {
            return this._pEpsilon;
        },
        set: function (value) {
            this._pEpsilon = value;
        },
        enumerable: true,
        configurable: true
    });
    return ShadowMapMethodBase;
})(ShadingMethodBase);
module.exports = ShadowMapMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9zaGFkb3dtYXBtZXRob2RiYXNlLnRzIl0sIm5hbWVzIjpbIlNoYWRvd01hcE1ldGhvZEJhc2UiLCJTaGFkb3dNYXBNZXRob2RCYXNlLmNvbnN0cnVjdG9yIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5hc3NldFR5cGUiLCJTaGFkb3dNYXBNZXRob2RCYXNlLmFscGhhIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5jYXN0aW5nTGlnaHQiLCJTaGFkb3dNYXBNZXRob2RCYXNlLmVwc2lsb24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFNcEUsSUFBTyxpQkFBaUIsV0FBYSwyREFBMkQsQ0FBQyxDQUFDO0FBRWxHLEFBR0E7O0dBREc7SUFDRyxtQkFBbUI7SUFBU0EsVUFBNUJBLG1CQUFtQkEsVUFBMEJBO0lBUWxEQTs7O09BR0dBO0lBQ0hBLFNBWktBLG1CQUFtQkEsQ0FZWkEsWUFBc0JBO1FBRWpDQyxpQkFBT0EsQ0FBQ0E7UUFURkEsY0FBU0EsR0FBVUEsR0FBR0EsQ0FBQ0E7UUFDdkJBLFlBQU9BLEdBQVVBLENBQUNBLENBQUNBO1FBU3pCQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQTtRQUNuQ0EsWUFBWUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBO0lBRWpEQSxDQUFDQTtJQUtERCxzQkFBV0EsMENBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtRQUNwQ0EsQ0FBQ0E7OztPQUFBRjtJQUtEQSxzQkFBV0Esc0NBQUtBO1FBSGhCQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDckJBLENBQUNBO2FBRURILFVBQWlCQSxLQUFZQTtZQUU1QkcsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDdEJBLENBQUNBOzs7T0FMQUg7SUFVREEsc0JBQVdBLDZDQUFZQTtRQUh2QkE7O1dBRUdBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQzVCQSxDQUFDQTs7O09BQUFKO0lBTURBLHNCQUFXQSx3Q0FBT0E7UUFKbEJBOzs7V0FHR0E7YUFDSEE7WUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBO2FBRURMLFVBQW1CQSxLQUFZQTtZQUU5QkssSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FMQUw7SUFNRkEsMEJBQUNBO0FBQURBLENBL0RBLEFBK0RDQSxFQS9EaUMsaUJBQWlCLEVBK0RsRDtBQUVELEFBQTZCLGlCQUFwQixtQkFBbUIsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dNYXBNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcblxuaW1wb3J0IExpZ2h0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaWdodEJhc2VcIik7XG5pbXBvcnQgU2hhZG93TWFwcGVyQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9zaGFkb3dtYXBwZXJzL1NoYWRvd01hcHBlckJhc2VcIik7XG5cbmltcG9ydCBTaGFkaW5nTWV0aG9kQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkaW5nTWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBTaGFkb3dNYXBNZXRob2RCYXNlIHByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgbWV0aG9kIGZvciBzaGFkb3cgbWFwIG1ldGhvZHMuXG4gKi9cbmNsYXNzIFNoYWRvd01hcE1ldGhvZEJhc2UgZXh0ZW5kcyBTaGFkaW5nTWV0aG9kQmFzZSBpbXBsZW1lbnRzIElBc3NldFxue1xuXHRwdWJsaWMgX3BDYXN0aW5nTGlnaHQ6TGlnaHRCYXNlO1xuXHRwdWJsaWMgX3BTaGFkb3dNYXBwZXI6U2hhZG93TWFwcGVyQmFzZTtcblxuXHRwdWJsaWMgX3BFcHNpbG9uOm51bWJlciA9IC4wMjtcblx0cHVibGljIF9wQWxwaGE6bnVtYmVyID0gMTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTaGFkb3dNYXBNZXRob2RCYXNlIG9iamVjdC5cblx0ICogQHBhcmFtIGNhc3RpbmdMaWdodCBUaGUgbGlnaHQgdXNlZCB0byBjYXN0IHNoYWRvd3MuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjYXN0aW5nTGlnaHQ6TGlnaHRCYXNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9wQ2FzdGluZ0xpZ2h0ID0gY2FzdGluZ0xpZ2h0O1xuXHRcdGNhc3RpbmdMaWdodC5jYXN0c1NoYWRvd3MgPSB0cnVlO1xuXHRcdHRoaXMuX3BTaGFkb3dNYXBwZXIgPSBjYXN0aW5nTGlnaHQuc2hhZG93TWFwcGVyO1xuXG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgYXNzZXRUeXBlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gQXNzZXRUeXBlLlNIQURPV19NQVBfTUVUSE9EO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBcInRyYW5zcGFyZW5jeVwiIG9mIHRoZSBzaGFkb3dzLiBUaGlzIGFsbG93cyBtYWtpbmcgc2hhZG93cyBsZXNzIHN0cm9uZy5cblx0ICovXG5cdHB1YmxpYyBnZXQgYWxwaGEoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFscGhhKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BBbHBoYSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBsaWdodCBjYXN0aW5nIHRoZSBzaGFkb3dzLlxuXHQgKi9cblx0cHVibGljIGdldCBjYXN0aW5nTGlnaHQoKTpMaWdodEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQ2FzdGluZ0xpZ2h0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc21hbGwgdmFsdWUgdG8gY291bnRlciBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gZXJyb3JzIHdoZW4gY29tcGFyaW5nIHZhbHVlcyBpbiB0aGUgc2hhZG93IG1hcCB3aXRoIHRoZVxuXHQgKiBjYWxjdWxhdGVkIGRlcHRoIHZhbHVlLiBJbmNyZWFzZSB0aGlzIGlmIHNoYWRvdyBiYW5kaW5nIG9jY3VycywgZGVjcmVhc2UgaXQgaWYgdGhlIHNoYWRvdyBzZWVtcyB0byBiZSB0b28gZGV0YWNoZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGVwc2lsb24oKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wRXBzaWxvbjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZXBzaWxvbih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wRXBzaWxvbiA9IHZhbHVlO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRvd01hcE1ldGhvZEJhc2U7Il19