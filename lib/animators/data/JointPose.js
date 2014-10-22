var Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
var Quaternion = require("awayjs-core/lib/core/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL2pvaW50cG9zZS50cyJdLCJuYW1lcyI6WyJKb2ludFBvc2UiLCJKb2ludFBvc2UuY29uc3RydWN0b3IiLCJKb2ludFBvc2UudG9NYXRyaXgzRCIsIkpvaW50UG9zZS5jb3B5RnJvbSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFDdEUsSUFBTyxVQUFVLFdBQWdCLHNDQUFzQyxDQUFDLENBQUM7QUFDekUsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFdEUsQUFRQTs7Ozs7OztHQURHO0lBQ0csU0FBUztJQWlCZEEsU0FqQktBLFNBQVNBO1FBT2RDOztXQUVHQTtRQUNJQSxnQkFBV0EsR0FBY0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFFakRBOztXQUVHQTtRQUNJQSxnQkFBV0EsR0FBWUEsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0E7SUFLN0NBLENBQUNBO0lBRUREOzs7OztPQUtHQTtJQUNJQSw4QkFBVUEsR0FBakJBLFVBQWtCQSxNQUFzQkE7UUFBdEJFLHNCQUFzQkEsR0FBdEJBLGFBQXNCQTtRQUV2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDbEJBLE1BQU1BLEdBQUdBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBRXpCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNwQ0EsTUFBTUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNyRkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUFFREY7Ozs7T0FJR0E7SUFDSUEsNEJBQVFBLEdBQWZBLFVBQWdCQSxJQUFjQTtRQUU3QkcsSUFBSUEsRUFBRUEsR0FBY0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7UUFDckNBLElBQUlBLEVBQUVBLEdBQVlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBQ25DQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFDRkgsZ0JBQUNBO0FBQURBLENBdkRBLEFBdURDQSxJQUFBO0FBRUQsQUFBbUIsaUJBQVYsU0FBUyxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL0pvaW50UG9zZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuXG4vKipcbiAqIENvbnRhaW5zIHRyYW5zZm9ybWF0aW9uIGRhdGEgZm9yIGEgc2tlbGV0b24gam9pbnQsIHVzZWQgZm9yIHNrZWxldG9uIGFuaW1hdGlvbi5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0aW9uLlNrZWxldG9uXG4gKiBAc2VlIGF3YXkuYW5pbWF0aW9uLlNrZWxldG9uSm9pbnRcbiAqXG4gKiB0b2RvOiBzdXBwb3J0ICh1bmlmb3JtKSBzY2FsZVxuICovXG5jbGFzcyBKb2ludFBvc2Vcbntcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBqb2ludCB0byB3aGljaCB0aGUgcG9zZSBpcyBhc3NvY2lhdGVkXG5cdCAqL1xuXHRwdWJsaWMgbmFtZTpzdHJpbmc7IC8vIGludGVudGlvbiBpcyB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWQgb25seSBhdCBsb2FkIHRpbWUsIG5vdCBpbiB0aGUgbWFpbiBsb29wXG5cblx0LyoqXG5cdCAqIFRoZSByb3RhdGlvbiBvZiB0aGUgcG9zZSBzdG9yZWQgYXMgYSBxdWF0ZXJuaW9uXG5cdCAqL1xuXHRwdWJsaWMgb3JpZW50YXRpb246UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgcG9zZVxuXHQgKi9cblx0cHVibGljIHRyYW5zbGF0aW9uOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgdHJhbnNmb3JtYXRpb24gdG8gYSBNYXRyaXgzRCByZXByZXNlbnRhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHRhcmdldCBBbiBvcHRpb25hbCB0YXJnZXQgbWF0cml4IHRvIHN0b3JlIHRoZSB0cmFuc2Zvcm1hdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZS5cblx0ICogQHJldHVybiBUaGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IG9mIHRoZSBwb3NlLlxuXHQgKi9cblx0cHVibGljIHRvTWF0cml4M0QodGFyZ2V0Ok1hdHJpeDNEID0gbnVsbCk6TWF0cml4M0Rcblx0e1xuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcblx0XHRcdHRhcmdldCA9IG5ldyBNYXRyaXgzRCgpO1xuXG5cdFx0dGhpcy5vcmllbnRhdGlvbi50b01hdHJpeDNEKHRhcmdldCk7XG5cdFx0dGFyZ2V0LmFwcGVuZFRyYW5zbGF0aW9uKHRoaXMudHJhbnNsYXRpb24ueCwgdGhpcy50cmFuc2xhdGlvbi55LCB0aGlzLnRyYW5zbGF0aW9uLnopO1xuXHRcdHJldHVybiB0YXJnZXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ29waWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBkYXRhIGZyb20gYSBzb3VyY2UgcG9zZSBvYmplY3QgaW50byB0aGUgZXhpc3RpbmcgcG9zZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBwb3NlIFRoZSBzb3VyY2UgcG9zZSB0byBjb3B5IGZyb20uXG5cdCAqL1xuXHRwdWJsaWMgY29weUZyb20ocG9zZTpKb2ludFBvc2UpXG5cdHtcblx0XHR2YXIgb3I6UXVhdGVybmlvbiA9IHBvc2Uub3JpZW50YXRpb247XG5cdFx0dmFyIHRyOlZlY3RvcjNEID0gcG9zZS50cmFuc2xhdGlvbjtcblx0XHR0aGlzLm9yaWVudGF0aW9uLnggPSBvci54O1xuXHRcdHRoaXMub3JpZW50YXRpb24ueSA9IG9yLnk7XG5cdFx0dGhpcy5vcmllbnRhdGlvbi56ID0gb3Iuejtcblx0XHR0aGlzLm9yaWVudGF0aW9uLncgPSBvci53O1xuXHRcdHRoaXMudHJhbnNsYXRpb24ueCA9IHRyLng7XG5cdFx0dGhpcy50cmFuc2xhdGlvbi55ID0gdHIueTtcblx0XHR0aGlzLnRyYW5zbGF0aW9uLnogPSB0ci56O1xuXHR9XG59XG5cbmV4cG9ydCA9IEpvaW50UG9zZTsiXX0=