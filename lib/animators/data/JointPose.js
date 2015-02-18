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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2UudHMiXSwibmFtZXMiOlsiSm9pbnRQb3NlIiwiSm9pbnRQb3NlLmNvbnN0cnVjdG9yIiwiSm9pbnRQb3NlLnRvTWF0cml4M0QiLCJKb2ludFBvc2UuY29weUZyb20iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2pFLElBQU8sVUFBVSxXQUFnQixpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3BFLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBRWpFLEFBUUE7Ozs7Ozs7R0FERztJQUNHLFNBQVM7SUFpQmRBLFNBakJLQSxTQUFTQTtRQU9kQzs7V0FFR0E7UUFDSUEsZ0JBQVdBLEdBQWNBLElBQUlBLFVBQVVBLEVBQUVBLENBQUNBO1FBRWpEQTs7V0FFR0E7UUFDSUEsZ0JBQVdBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO0lBSzdDQSxDQUFDQTtJQUVERDs7Ozs7T0FLR0E7SUFDSUEsOEJBQVVBLEdBQWpCQSxVQUFrQkEsTUFBc0JBO1FBQXRCRSxzQkFBc0JBLEdBQXRCQSxhQUFzQkE7UUFFdkNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBO1lBQ2xCQSxNQUFNQSxHQUFHQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUV6QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDcENBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckZBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO0lBQ2ZBLENBQUNBO0lBRURGOzs7O09BSUdBO0lBQ0lBLDRCQUFRQSxHQUFmQSxVQUFnQkEsSUFBY0E7UUFFN0JHLElBQUlBLEVBQUVBLEdBQWNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBQ3JDQSxJQUFJQSxFQUFFQSxHQUFZQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBQ0ZILGdCQUFDQTtBQUFEQSxDQXZEQSxBQXVEQ0EsSUFBQTtBQUVELEFBQW1CLGlCQUFWLFNBQVMsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9Kb2ludFBvc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcclxuaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xyXG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xyXG5cclxuLyoqXHJcbiAqIENvbnRhaW5zIHRyYW5zZm9ybWF0aW9uIGRhdGEgZm9yIGEgc2tlbGV0b24gam9pbnQsIHVzZWQgZm9yIHNrZWxldG9uIGFuaW1hdGlvbi5cclxuICpcclxuICogQHNlZSBhd2F5LmFuaW1hdGlvbi5Ta2VsZXRvblxyXG4gKiBAc2VlIGF3YXkuYW5pbWF0aW9uLlNrZWxldG9uSm9pbnRcclxuICpcclxuICogdG9kbzogc3VwcG9ydCAodW5pZm9ybSkgc2NhbGVcclxuICovXHJcbmNsYXNzIEpvaW50UG9zZVxyXG57XHJcblx0LyoqXHJcblx0ICogVGhlIG5hbWUgb2YgdGhlIGpvaW50IHRvIHdoaWNoIHRoZSBwb3NlIGlzIGFzc29jaWF0ZWRcclxuXHQgKi9cclxuXHRwdWJsaWMgbmFtZTpzdHJpbmc7IC8vIGludGVudGlvbiBpcyB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWQgb25seSBhdCBsb2FkIHRpbWUsIG5vdCBpbiB0aGUgbWFpbiBsb29wXHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSByb3RhdGlvbiBvZiB0aGUgcG9zZSBzdG9yZWQgYXMgYSBxdWF0ZXJuaW9uXHJcblx0ICovXHJcblx0cHVibGljIG9yaWVudGF0aW9uOlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIHBvc2VcclxuXHQgKi9cclxuXHRwdWJsaWMgdHJhbnNsYXRpb246VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcclxuXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyB0aGUgdHJhbnNmb3JtYXRpb24gdG8gYSBNYXRyaXgzRCByZXByZXNlbnRhdGlvbi5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB0YXJnZXQgQW4gb3B0aW9uYWwgdGFyZ2V0IG1hdHJpeCB0byBzdG9yZSB0aGUgdHJhbnNmb3JtYXRpb24uIElmIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBjcmVhdGUgYSBuZXcgaW5zdGFuY2UuXHJcblx0ICogQHJldHVybiBUaGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IG9mIHRoZSBwb3NlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyB0b01hdHJpeDNEKHRhcmdldDpNYXRyaXgzRCA9IG51bGwpOk1hdHJpeDNEXHJcblx0e1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHR0YXJnZXQgPSBuZXcgTWF0cml4M0QoKTtcclxuXHJcblx0XHR0aGlzLm9yaWVudGF0aW9uLnRvTWF0cml4M0QodGFyZ2V0KTtcclxuXHRcdHRhcmdldC5hcHBlbmRUcmFuc2xhdGlvbih0aGlzLnRyYW5zbGF0aW9uLngsIHRoaXMudHJhbnNsYXRpb24ueSwgdGhpcy50cmFuc2xhdGlvbi56KTtcclxuXHRcdHJldHVybiB0YXJnZXQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDb3BpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIGRhdGEgZnJvbSBhIHNvdXJjZSBwb3NlIG9iamVjdCBpbnRvIHRoZSBleGlzdGluZyBwb3NlIG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBwb3NlIFRoZSBzb3VyY2UgcG9zZSB0byBjb3B5IGZyb20uXHJcblx0ICovXHJcblx0cHVibGljIGNvcHlGcm9tKHBvc2U6Sm9pbnRQb3NlKVxyXG5cdHtcclxuXHRcdHZhciBvcjpRdWF0ZXJuaW9uID0gcG9zZS5vcmllbnRhdGlvbjtcclxuXHRcdHZhciB0cjpWZWN0b3IzRCA9IHBvc2UudHJhbnNsYXRpb247XHJcblx0XHR0aGlzLm9yaWVudGF0aW9uLnggPSBvci54O1xyXG5cdFx0dGhpcy5vcmllbnRhdGlvbi55ID0gb3IueTtcclxuXHRcdHRoaXMub3JpZW50YXRpb24ueiA9IG9yLno7XHJcblx0XHR0aGlzLm9yaWVudGF0aW9uLncgPSBvci53O1xyXG5cdFx0dGhpcy50cmFuc2xhdGlvbi54ID0gdHIueDtcclxuXHRcdHRoaXMudHJhbnNsYXRpb24ueSA9IHRyLnk7XHJcblx0XHR0aGlzLnRyYW5zbGF0aW9uLnogPSB0ci56O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gSm9pbnRQb3NlOyJdfQ==