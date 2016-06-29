"use strict";
/**
 * @class away.pool.SurfacePool
 */
var SurfacePool = (function () {
    /**
     * //TODO
     *
     * @param surfaceClassGL
     */
    function SurfacePool(elementsClass, stage, surfaceClassGL) {
        if (surfaceClassGL === void 0) { surfaceClassGL = null; }
        this._abstractionPool = new Object();
        this._elementsClass = elementsClass;
        this._stage = stage;
        this._surfaceClassGL = surfaceClassGL;
    }
    Object.defineProperty(SurfacePool.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * //TODO
     *
     * @param elementsOwner
     * @returns IElements
     */
    SurfacePool.prototype.getAbstraction = function (surface) {
        return (this._abstractionPool[surface.id] || (this._abstractionPool[surface.id] = new (this._surfaceClassGL || SurfacePool._abstractionClassPool[surface.assetType])(surface, this._elementsClass, this)));
    };
    /**
     * //TODO
     *
     * @param elementsOwner
     */
    SurfacePool.prototype.clearAbstraction = function (surface) {
        delete this._abstractionPool[surface.id];
    };
    /**
     *
     * @param imageObjectClass
     */
    SurfacePool.registerAbstraction = function (surfaceClassGL, assetClass) {
        SurfacePool._abstractionClassPool[assetClass.assetType] = surfaceClassGL;
    };
    SurfacePool._abstractionClassPool = new Object();
    return SurfacePool;
}());
exports.SurfacePool = SurfacePool;
