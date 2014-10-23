var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Quaternion = require("awayjs-core/lib/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * Contains transformation data for a skeleton joint, used for skeleton animation.
 *
 * @see away.animation.Skeleton
 * @see away.animation.SkeletonJoint
 *
 * todo: support (uniform) scale
 */
var JointPose = (function () {
    function JointPose() {
        /**
         * The rotation of the pose stored as a quaternion
         */
        this.orientation = new Quaternion();
        /**
         * The translation of the pose
         */
        this.translation = new Vector3D();
    }
    /**
     * Converts the transformation to a Matrix3D representation.
     *
     * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
     * @return The transformation matrix of the pose.
     */
    JointPose.prototype.toMatrix3D = function (target) {
        if (target === void 0) { target = null; }
        if (target == null)
            target = new Matrix3D();
        this.orientation.toMatrix3D(target);
        target.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
        return target;
    };
    /**
     * Copies the transformation data from a source pose object into the existing pose object.
     *
     * @param pose The source pose to copy from.
     */
    JointPose.prototype.copyFrom = function (pose) {
        var or = pose.orientation;
        var tr = pose.translation;
        this.orientation.x = or.x;
        this.orientation.y = or.y;
        this.orientation.z = or.z;
        this.orientation.w = or.w;
        this.translation.x = tr.x;
        this.translation.y = tr.y;
        this.translation.z = tr.z;
    };
    return JointPose;
})();
module.exports = JointPose;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9qb2ludHBvc2UudHMiXSwibmFtZXMiOlsiSm9pbnRQb3NlIiwiSm9pbnRQb3NlLmNvbnN0cnVjdG9yIiwiSm9pbnRQb3NlLnRvTWF0cml4M0QiLCJKb2ludFBvc2UuY29weUZyb20iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2pFLElBQU8sVUFBVSxXQUFnQixpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3BFLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBRWpFLEFBUUE7Ozs7Ozs7R0FERztJQUNHLFNBQVM7SUFpQmRBLFNBakJLQSxTQUFTQTtRQU9kQzs7V0FFR0E7UUFDSUEsZ0JBQVdBLEdBQWNBLElBQUlBLFVBQVVBLEVBQUVBLENBQUNBO1FBRWpEQTs7V0FFR0E7UUFDSUEsZ0JBQVdBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO0lBSzdDQSxDQUFDQTtJQUVERDs7Ozs7T0FLR0E7SUFDSUEsOEJBQVVBLEdBQWpCQSxVQUFrQkEsTUFBc0JBO1FBQXRCRSxzQkFBc0JBLEdBQXRCQSxhQUFzQkE7UUFFdkNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBO1lBQ2xCQSxNQUFNQSxHQUFHQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUV6QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDcENBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckZBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO0lBQ2ZBLENBQUNBO0lBRURGOzs7O09BSUdBO0lBQ0lBLDRCQUFRQSxHQUFmQSxVQUFnQkEsSUFBY0E7UUFFN0JHLElBQUlBLEVBQUVBLEdBQWNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBQ3JDQSxJQUFJQSxFQUFFQSxHQUFZQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBQ0ZILGdCQUFDQTtBQUFEQSxDQXZEQSxBQXVEQ0EsSUFBQTtBQUVELEFBQW1CLGlCQUFWLFNBQVMsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9Kb2ludFBvc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUXVhdGVybmlvblwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5cbi8qKlxuICogQ29udGFpbnMgdHJhbnNmb3JtYXRpb24gZGF0YSBmb3IgYSBza2VsZXRvbiBqb2ludCwgdXNlZCBmb3Igc2tlbGV0b24gYW5pbWF0aW9uLlxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRpb24uU2tlbGV0b25cbiAqIEBzZWUgYXdheS5hbmltYXRpb24uU2tlbGV0b25Kb2ludFxuICpcbiAqIHRvZG86IHN1cHBvcnQgKHVuaWZvcm0pIHNjYWxlXG4gKi9cbmNsYXNzIEpvaW50UG9zZVxue1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIGpvaW50IHRvIHdoaWNoIHRoZSBwb3NlIGlzIGFzc29jaWF0ZWRcblx0ICovXG5cdHB1YmxpYyBuYW1lOnN0cmluZzsgLy8gaW50ZW50aW9uIGlzIHRoYXQgdGhpcyBzaG91bGQgYmUgdXNlZCBvbmx5IGF0IGxvYWQgdGltZSwgbm90IGluIHRoZSBtYWluIGxvb3BcblxuXHQvKipcblx0ICogVGhlIHJvdGF0aW9uIG9mIHRoZSBwb3NlIHN0b3JlZCBhcyBhIHF1YXRlcm5pb25cblx0ICovXG5cdHB1YmxpYyBvcmllbnRhdGlvbjpRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBwb3NlXG5cdCAqL1xuXHRwdWJsaWMgdHJhbnNsYXRpb246VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHRoZSB0cmFuc2Zvcm1hdGlvbiB0byBhIE1hdHJpeDNEIHJlcHJlc2VudGF0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbmFsIHRhcmdldCBtYXRyaXggdG8gc3RvcmUgdGhlIHRyYW5zZm9ybWF0aW9uLiBJZiBub3QgcHJvdmlkZWQsIGl0IHdpbGwgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuXHQgKiBAcmV0dXJuIFRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggb2YgdGhlIHBvc2UuXG5cdCAqL1xuXHRwdWJsaWMgdG9NYXRyaXgzRCh0YXJnZXQ6TWF0cml4M0QgPSBudWxsKTpNYXRyaXgzRFxuXHR7XG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxuXHRcdFx0dGFyZ2V0ID0gbmV3IE1hdHJpeDNEKCk7XG5cblx0XHR0aGlzLm9yaWVudGF0aW9uLnRvTWF0cml4M0QodGFyZ2V0KTtcblx0XHR0YXJnZXQuYXBwZW5kVHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvbi54LCB0aGlzLnRyYW5zbGF0aW9uLnksIHRoaXMudHJhbnNsYXRpb24ueik7XG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIGRhdGEgZnJvbSBhIHNvdXJjZSBwb3NlIG9iamVjdCBpbnRvIHRoZSBleGlzdGluZyBwb3NlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHBvc2UgVGhlIHNvdXJjZSBwb3NlIHRvIGNvcHkgZnJvbS5cblx0ICovXG5cdHB1YmxpYyBjb3B5RnJvbShwb3NlOkpvaW50UG9zZSlcblx0e1xuXHRcdHZhciBvcjpRdWF0ZXJuaW9uID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHR2YXIgdHI6VmVjdG9yM0QgPSBwb3NlLnRyYW5zbGF0aW9uO1xuXHRcdHRoaXMub3JpZW50YXRpb24ueCA9IG9yLng7XG5cdFx0dGhpcy5vcmllbnRhdGlvbi55ID0gb3IueTtcblx0XHR0aGlzLm9yaWVudGF0aW9uLnogPSBvci56O1xuXHRcdHRoaXMub3JpZW50YXRpb24udyA9IG9yLnc7XG5cdFx0dGhpcy50cmFuc2xhdGlvbi54ID0gdHIueDtcblx0XHR0aGlzLnRyYW5zbGF0aW9uLnkgPSB0ci55O1xuXHRcdHRoaXMudHJhbnNsYXRpb24ueiA9IHRyLno7XG5cdH1cbn1cblxuZXhwb3J0ID0gSm9pbnRQb3NlOyJdfQ==