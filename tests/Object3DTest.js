var away;
(function (away) {
    (function (math) {
        /**
        * MathConsts provides some commonly used mathematical constants
        */
        var MathConsts = (function () {
            function MathConsts() {
            }
            MathConsts.RADIANS_TO_DEGREES = 180 / Math.PI;

            MathConsts.DEGREES_TO_RADIANS = Math.PI / 180;
            return MathConsts;
        })();
        math.MathConsts = MathConsts;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * @author Gary Paluk
    * @created 6/29/13
    * @module away.geom
    */
    (function (geom) {
        var Vector3D = (function () {
            /**
            * Creates an instance of a Vector3D object.
            */
            function Vector3D(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 0; }
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Object.defineProperty(Vector3D.prototype, "length", {
                get: /**
                * [read-only] The length, magnitude, of the current Vector3D object from the origin (0,0,0) to the object's
                * x, y, and z coordinates.
                * @returns The length of the Vector3D
                */
                function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3D.prototype, "lengthSquared", {
                get: /**
                * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z
                * properties.
                * @returns The squared length of the vector
                */
                function () {
                    return (this.x * this.x + this.y * this.y + this.z + this.z);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Adds the value of the x, y, and z elements of the current Vector3D object to the values of the x, y, and z
            * elements of another Vector3D object.
            */
            Vector3D.prototype.add = function (a) {
                return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
            };

            Vector3D.angleBetween = /**
            * [static] Returns the angle in radians between two vectors.
            */
            function (a, b) {
                return Math.acos(a.dotProduct(b) / (a.length * b.length));
            };

            /**
            * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
            */
            Vector3D.prototype.clone = function () {
                return new Vector3D(this.x, this.y, this.z, this.w);
            };

            /**
            * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
            */
            Vector3D.prototype.copyFrom = function (src) {
                return new Vector3D(src.x, src.y, src.z, src.w);
            };

            /**
            * Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another
            * Vector3D object.
            */
            Vector3D.prototype.crossProduct = function (a) {
                return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
            };

            /**
            * Decrements the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
            * and z elements of specified Vector3D object.
            */
            Vector3D.prototype.decrementBy = function (a) {
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
            };

            Vector3D.distance = /**
            * [static] Returns the distance between two Vector3D objects.
            */
            function (pt1, pt2) {
                var x = (pt1.x - pt2.x);
                var y = (pt1.y - pt2.y);
                var z = (pt1.z - pt2.z);
                return Math.sqrt(x * x + y * y + z * z);
            };

            /**
            * If the current Vector3D object and the one specified as the parameter are unit vertices, this method returns
            * the cosine of the angle between the two vertices.
            */
            Vector3D.prototype.dotProduct = function (a) {
                return this.x * a.x + this.y * a.y + this.z * a.z;
            };

            /**
            * Determines whether two Vector3D objects are equal by comparing the x, y, and z elements of the current
            * Vector3D object with a specified Vector3D object.
            */
            Vector3D.prototype.equals = function (cmp, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                return (this.x == cmp.x && this.y == cmp.y && this.z == cmp.z && (!allFour || this.w == cmp.w));
            };

            /**
            * Increments the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
            * and z elements of a specified Vector3D object.
            */
            Vector3D.prototype.incrementBy = function (a) {
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
            };

            /**
            * Compares the elements of the current Vector3D object with the elements of a specified Vector3D object to
            * determine whether they are nearly equal.
            */
            Vector3D.prototype.nearEquals = function (cmp, epsilon, allFour) {
                if (typeof allFour === "undefined") { allFour = true; }
                return ((Math.abs(this.x - cmp.x) < epsilon) && (Math.abs(this.y - cmp.y) < epsilon) && (Math.abs(this.z - cmp.z) < epsilon) && (!allFour || Math.abs(this.w - cmp.w) < epsilon));
            };

            /**
            * Sets the current Vector3D object to its inverse.
            */
            Vector3D.prototype.negate = function () {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            };

            /**
            * Converts a Vector3D object to a unit vector by dividing the first three elements (x, y, z) by the length of
            * the vector.
            */
            Vector3D.prototype.normalize = function () {
                var invLength = 1 / this.length;
                if (invLength != 0) {
                    this.x *= invLength;
                    this.y *= invLength;
                    this.z *= invLength;
                    return;
                }
                throw "Cannot divide by zero.";
            };

            /**
            * Divides the value of the x, y, and z properties of the current Vector3D object by the value of its w
            * property.
            */
            Vector3D.prototype.project = function () {
                this.x /= this.w;
                this.y /= this.w;
                this.z /= this.w;
            };

            /**
            * Scales the current Vector3D object by a scalar, a magnitude.
            */
            Vector3D.prototype.scaleBy = function (s) {
                this.x *= s;
                this.y *= s;
                this.z *= s;
            };

            /**
            * Sets the members of Vector3D to the specified values
            */
            Vector3D.prototype.setTo = function (xa, ya, za) {
                this.x = xa;
                this.y = ya;
                this.z = za;
            };

            /**
            * Subtracts the value of the x, y, and z elements of the current Vector3D object from the values of the x, y,
            * and z elements of another Vector3D object.
            */
            Vector3D.prototype.subtract = function (a) {
                return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
            };

            /**
            * Returns a string representation of the current Vector3D object.
            */
            Vector3D.prototype.toString = function () {
                return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
            };
            return Vector3D;
        })();
        geom.Vector3D = Vector3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    (function (errors) {
        var Error = (function () {
            function Error(message, id, _name) {
                if (typeof message === "undefined") { message = ''; }
                if (typeof id === "undefined") { id = 0; }
                if (typeof _name === "undefined") { _name = ''; }
                this._errorID = 0;
                this._messsage = '';
                this._name = '';
                this._messsage = message;
                this._name = name;
                this._errorID = id;
            }
            Object.defineProperty(Error.prototype, "message", {
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._messsage;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
                    this._messsage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "name", {
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._name;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "errorID", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._errorID;
                },
                enumerable: true,
                configurable: true
            });
            return Error;
        })();
        errors.Error = Error;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var away;
(function (away) {
    ///<reference path="Error.ts" />
    (function (errors) {
        /**
        * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
        * by a concrete subclass.
        */
        var ArgumentError = (function (_super) {
            __extends(ArgumentError, _super);
            /**
            * Create a new AbstractMethodError.
            * @param message An optional message to override the default error message.
            * @param id The id of the error.
            */
            function ArgumentError(message, id) {
                if (typeof message === "undefined") { message = null; }
                if (typeof id === "undefined") { id = 0; }
                _super.call(this, message || "ArgumentError", id);
            }
            return ArgumentError;
        })(errors.Error);
        errors.ArgumentError = ArgumentError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="Vector3D.ts" />
    ///<reference path="../errors/ArgumentError.ts" />
    (function (geom) {
        var Matrix3D = (function () {
            /**
            * Creates a Matrix3D object.
            */
            function Matrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                if (v != null && v.length == 16) {
                    this.rawData = v;
                } else {
                    this.rawData = [
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1
                    ];
                }
            }
            /**
            * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
            */
            Matrix3D.prototype.append = function (lhs) {
                var m111 = this.rawData[0], m121 = this.rawData[4], m131 = this.rawData[8], m141 = this.rawData[12], m112 = this.rawData[1], m122 = this.rawData[5], m132 = this.rawData[9], m142 = this.rawData[13], m113 = this.rawData[2], m123 = this.rawData[6], m133 = this.rawData[10], m143 = this.rawData[14], m114 = this.rawData[3], m124 = this.rawData[7], m134 = this.rawData[11], m144 = this.rawData[15], m211 = lhs.rawData[0], m221 = lhs.rawData[4], m231 = lhs.rawData[8], m241 = lhs.rawData[12], m212 = lhs.rawData[1], m222 = lhs.rawData[5], m232 = lhs.rawData[9], m242 = lhs.rawData[13], m213 = lhs.rawData[2], m223 = lhs.rawData[6], m233 = lhs.rawData[10], m243 = lhs.rawData[14], m214 = lhs.rawData[3], m224 = lhs.rawData[7], m234 = lhs.rawData[11], m244 = lhs.rawData[15];

                this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
                this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
                this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
                this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;

                this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
                this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
                this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
                this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;

                this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
                this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
                this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
                this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;

                this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
                this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
                this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
                this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
            };

            /**
            * Appends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);

                if (pivotPoint != null) {
                    var p = pivotPoint;
                    m.appendTranslation(p.x, p.y, p.z);
                }

                this.append(m);
            };

            /**
            * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
                this.append(new Matrix3D([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zScale, 0.0, 0.0, 0.0, 0.0, 1.0]));
            };

            /**
            * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.appendTranslation = function (x, y, z) {
                this.rawData[12] += x;
                this.rawData[13] += y;
                this.rawData[14] += z;
            };

            /**
            * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
            */
            Matrix3D.prototype.clone = function () {
                return new Matrix3D(this.rawData.slice(0));
            };

            /**
            * Copies a Vector3D object into specific column of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
                switch (column) {
                    case 0:
                        vector3D.x = this.rawData[0];
                        vector3D.y = this.rawData[4];
                        vector3D.z = this.rawData[8];
                        vector3D.w = this.rawData[12];
                        break;
                    case 1:
                        vector3D.x = this.rawData[1];
                        vector3D.y = this.rawData[5];
                        vector3D.z = this.rawData[9];
                        vector3D.w = this.rawData[13];
                        break;
                    case 2:
                        vector3D.x = this.rawData[2];
                        vector3D.y = this.rawData[6];
                        vector3D.z = this.rawData[10];
                        vector3D.w = this.rawData[14];
                        break;
                    case 3:
                        vector3D.x = this.rawData[3];
                        vector3D.y = this.rawData[7];
                        vector3D.z = this.rawData[11];
                        vector3D.w = this.rawData[15];
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific column of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
                switch (column) {
                    case 0:
                        this.rawData[0] = vector3D.x;
                        this.rawData[4] = vector3D.y;
                        this.rawData[8] = vector3D.z;
                        this.rawData[12] = vector3D.w;
                        break;
                    case 1:
                        this.rawData[1] = vector3D.x;
                        this.rawData[5] = vector3D.y;
                        this.rawData[9] = vector3D.z;
                        this.rawData[13] = vector3D.w;
                        break;
                    case 2:
                        this.rawData[2] = vector3D.x;
                        this.rawData[6] = vector3D.y;
                        this.rawData[10] = vector3D.z;
                        this.rawData[14] = vector3D.w;
                        break;
                    case 3:
                        this.rawData[3] = vector3D.x;
                        this.rawData[7] = vector3D.y;
                        this.rawData[11] = vector3D.z;
                        this.rawData[15] = vector3D.w;
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
            */
            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                this.rawData = sourceMatrix3D.rawData.slice(0);
            };

            Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                //TODO fully implement
                this.rawData = vector.splice(0);
            };

            /* TODO implement copyRawDataTo
            public copyRawDataTo( vector:number[], index:number = 0, transpose:boolean = false )
            {
            }
            */
            /**
            * Copies a Vector3D object into specific row of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
                switch (row) {
                    case 0:
                        vector3D.x = this.rawData[0];
                        vector3D.y = this.rawData[1];
                        vector3D.z = this.rawData[2];
                        vector3D.w = this.rawData[3];
                        break;
                    case 1:
                        vector3D.x = this.rawData[4];
                        vector3D.y = this.rawData[5];
                        vector3D.z = this.rawData[6];
                        vector3D.w = this.rawData[7];
                        break;
                    case 2:
                        vector3D.x = this.rawData[8];
                        vector3D.y = this.rawData[9];
                        vector3D.z = this.rawData[10];
                        vector3D.w = this.rawData[11];
                        break;
                    case 3:
                        vector3D.x = this.rawData[12];
                        vector3D.y = this.rawData[13];
                        vector3D.z = this.rawData[14];
                        vector3D.w = this.rawData[15];
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific row of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyRowTo = function (row, vector3D) {
                switch (row) {
                    case 0:
                        this.rawData[0] = vector3D.x;
                        this.rawData[1] = vector3D.y;
                        this.rawData[2] = vector3D.z;
                        this.rawData[3] = vector3D.w;
                        break;
                    case 1:
                        this.rawData[4] = vector3D.x;
                        this.rawData[5] = vector3D.y;
                        this.rawData[6] = vector3D.z;
                        this.rawData[7] = vector3D.w;
                        break;
                    case 2:
                        this.rawData[8] = vector3D.x;
                        this.rawData[9] = vector3D.y;
                        this.rawData[10] = vector3D.z;
                        this.rawData[11] = vector3D.w;
                        break;
                    case 3:
                        this.rawData[12] = vector3D.x;
                        this.rawData[13] = vector3D.y;
                        this.rawData[14] = vector3D.z;
                        this.rawData[15] = vector3D.w;
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies this Matrix3D object into a destination Matrix3D object.
            */
            Matrix3D.prototype.copyToMatrix3D = function (dest) {
                dest.rawData = this.rawData.slice(0);
            };

            // TODO orientationStyle:string = "eulerAngles"
            /**
            * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
            */
            Matrix3D.prototype.decompose = function () {
                var vec = [];
                var m = this.clone();
                var mr = m.rawData;

                var pos = new geom.Vector3D(mr[12], mr[13], mr[14]);
                mr[12] = 0;
                mr[13] = 0;
                mr[14] = 0;

                var scale = new geom.Vector3D();

                scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
                scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
                scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);

                if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) {
                    scale.z = -scale.z;
                }

                mr[0] /= scale.x;
                mr[1] /= scale.x;
                mr[2] /= scale.x;
                mr[4] /= scale.y;
                mr[5] /= scale.y;
                mr[6] /= scale.y;
                mr[8] /= scale.z;
                mr[9] /= scale.z;
                mr[10] /= scale.z;

                var rot = new geom.Vector3D();
                rot.y = Math.asin(-mr[2]);
                var cos = Math.cos(rot.y);

                if (cos > 0) {
                    rot.x = Math.atan2(mr[6], mr[10]);
                    rot.z = Math.atan2(mr[1], mr[0]);
                } else {
                    rot.z = 0;
                    rot.x = Math.atan2(mr[4], mr[5]);
                }

                vec.push(pos);
                vec.push(rot);
                vec.push(scale);

                return vec;
            };

            /**
            * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
            * coordinate to another.
            */
            Matrix3D.prototype.deltaTransformVector = function (v) {
                var x = v.x, y = v.y, z = v.z;
                return new geom.Vector3D((x * this.rawData[0] + y * this.rawData[1] + z * this.rawData[2] + this.rawData[3]), (x * this.rawData[4] + y * this.rawData[5] + z * this.rawData[6] + this.rawData[7]), (x * this.rawData[8] + y * this.rawData[9] + z * this.rawData[10] + this.rawData[11]), 0);
            };

            /**
            * Converts the current matrix to an identity or unit matrix.
            */
            Matrix3D.prototype.identity = function () {
                this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            };

            Matrix3D.interpolate = /**
            * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
            */
            function (thisMat, toMat, percent) {
                var m = new Matrix3D();
                for (var i = 0; i < 16; ++i) {
                    m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
                }
                return m;
            };

            /**
            * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
            */
            Matrix3D.prototype.interpolateTo = function (toMat, percent) {
                for (var i = 0; i < 16; ++i) {
                    this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
                }
            };

            /**
            * Inverts the current matrix.
            */
            Matrix3D.prototype.invert = function () {
                var d = this.determinant;
                var invertable = Math.abs(d) > 0.00000000001;

                if (invertable) {
                    d = -1 / d;
                    var m11 = this.rawData[0];
                    var m21 = this.rawData[4];
                    var m31 = this.rawData[8];
                    var m41 = this.rawData[12];
                    var m12 = this.rawData[1];
                    var m22 = this.rawData[5];
                    var m32 = this.rawData[9];
                    var m42 = this.rawData[13];
                    var m13 = this.rawData[2];
                    var m23 = this.rawData[6];
                    var m33 = this.rawData[10];
                    var m43 = this.rawData[14];
                    var m14 = this.rawData[3];
                    var m24 = this.rawData[7];
                    var m34 = this.rawData[11];
                    var m44 = this.rawData[15];

                    this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
                    this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
                    this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
                    this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
                    this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
                    this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
                    this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
                    this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
                    this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
                    this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
                    this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
                    this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
                    this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
                    this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
                    this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
                    this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
                }
                return invertable;
            };

            /* TODO implement pointAt
            public pointAt( pos:Vector3D, at:Vector3D = null, up:Vector3D = null )
            {
            }
            */
            /**
            * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
            */
            Matrix3D.prototype.prepend = function (rhs) {
                var m111 = rhs.rawData[0], m121 = rhs.rawData[4], m131 = rhs.rawData[8], m141 = rhs.rawData[12], m112 = rhs.rawData[1], m122 = rhs.rawData[5], m132 = rhs.rawData[9], m142 = rhs.rawData[13], m113 = rhs.rawData[2], m123 = rhs.rawData[6], m133 = rhs.rawData[10], m143 = rhs.rawData[14], m114 = rhs.rawData[3], m124 = rhs.rawData[7], m134 = rhs.rawData[11], m144 = rhs.rawData[15], m211 = this.rawData[0], m221 = this.rawData[4], m231 = this.rawData[8], m241 = this.rawData[12], m212 = this.rawData[1], m222 = this.rawData[5], m232 = this.rawData[9], m242 = this.rawData[13], m213 = this.rawData[2], m223 = this.rawData[6], m233 = this.rawData[10], m243 = this.rawData[14], m214 = this.rawData[3], m224 = this.rawData[7], m234 = this.rawData[11], m244 = this.rawData[15];

                this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
                this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
                this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
                this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;

                this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
                this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
                this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
                this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;

                this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
                this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
                this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
                this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;

                this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
                this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
                this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
                this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
            };

            /**
            * Prepends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);
                if (pivotPoint != null) {
                    var p = pivotPoint;
                    m.appendTranslation(p.x, p.y, p.z);
                }
                this.prepend(m);
            };

            /**
            * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
                this.prepend(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
            };

            /**
            * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                var m = new Matrix3D();
                m.position = new geom.Vector3D(x, y, z);
                this.prepend(m);
            };

            // TODO orientationStyle
            /**
            * Sets the transformation matrix's translation, rotation, and scale settings.
            */
            Matrix3D.prototype.recompose = function (components) {
                if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0)
                    return false;

                this.identity();
                this.appendScale(components[2].x, components[2].y, components[2].z);

                var angle;
                angle = -components[1].x;
                this.append(new Matrix3D([1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 0]));
                angle = -components[1].y;
                this.append(new Matrix3D([Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 0]));
                angle = -components[1].z;
                this.append(new Matrix3D([Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]));

                this.position = components[0];
                this.rawData[15] = 1;

                return true;
            };

            /**
            * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
            */
            Matrix3D.prototype.transformVectors = function (vin, vout) {
                var i = 0;
                var x = 0, y = 0, z = 0;

                while (i + 3 <= vin.length) {
                    x = vin[i];
                    y = vin[i + 1];
                    z = vin[i + 2];
                    vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
                    vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
                    vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
                    i += 3;
                }
            };

            /**
            * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
            */
            Matrix3D.prototype.transpose = function () {
                var oRawData = this.rawData.slice(0);

                this.rawData[1] = oRawData[4];
                this.rawData[2] = oRawData[8];
                this.rawData[3] = oRawData[12];
                this.rawData[4] = oRawData[1];
                this.rawData[6] = oRawData[9];
                this.rawData[7] = oRawData[13];
                this.rawData[8] = oRawData[2];
                this.rawData[9] = oRawData[6];
                this.rawData[11] = oRawData[14];
                this.rawData[12] = oRawData[3];
                this.rawData[13] = oRawData[7];
                this.rawData[14] = oRawData[11];
            };

            Matrix3D.getAxisRotation = function (x, y, z, degrees) {
                var m = new Matrix3D();

                var a1 = new geom.Vector3D(x, y, z);
                var rad = -degrees * (Math.PI / 180);
                var c = Math.cos(rad);
                var s = Math.sin(rad);
                var t = 1.0 - c;

                m.rawData[0] = c + a1.x * a1.x * t;
                m.rawData[5] = c + a1.y * a1.y * t;
                m.rawData[10] = c + a1.z * a1.z * t;

                var tmp1 = a1.x * a1.y * t;
                var tmp2 = a1.z * s;
                m.rawData[4] = tmp1 + tmp2;
                m.rawData[1] = tmp1 - tmp2;
                tmp1 = a1.x * a1.z * t;
                tmp2 = a1.y * s;
                m.rawData[8] = tmp1 - tmp2;
                m.rawData[2] = tmp1 + tmp2;
                tmp1 = a1.y * a1.z * t;
                tmp2 = a1.x * s;
                m.rawData[9] = tmp1 + tmp2;
                m.rawData[6] = tmp1 - tmp2;

                return m;
            };

            Object.defineProperty(Matrix3D.prototype, "determinant", {
                get: /**
                * [read-only] A Number that determines whether a matrix is invertible.
                */
                function () {
                    return -1 * ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Matrix3D.prototype, "position", {
                get: /**
                * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
                * transformation's frame of reference.
                */
                function () {
                    return new geom.Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
                },
                set: function (value) {
                    this.rawData[12] = value.x;
                    this.rawData[13] = value.y;
                    this.rawData[14] = value.z;
                },
                enumerable: true,
                configurable: true
            });

            return Matrix3D;
        })();
        geom.Matrix3D = Matrix3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../math/MathConsts.ts" />
    (function (math) {
        //import flash.geom.Matrix3D;
        //import flash.geom.Orientation3D;
        //import flash.geom.Vector3D;
        /**
        * A Quaternion object which can be used to represent rotations.
        */
        var Quaternion = (function () {
            /**
            * Creates a new Quaternion object.
            * @param x The x value of the quaternion.
            * @param y The y value of the quaternion.
            * @param z The z value of the quaternion.
            * @param w The w value of the quaternion.
            */
            function Quaternion(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 1; }
                /**
                * The x value of the quaternion.
                */
                this.x = 0;
                /**
                * The y value of the quaternion.
                */
                this.y = 0;
                /**
                * The z value of the quaternion.
                */
                this.z = 0;
                /**
                * The w value of the quaternion.
                */
                this.w = 1;
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Object.defineProperty(Quaternion.prototype, "magnitude", {
                get: /**
                * Returns the magnitude of the quaternion object.
                */
                function () {
                    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Fills the quaternion object with the result from a multiplication of two quaternion objects.
            *
            * @param    qa    The first quaternion in the multiplication.
            * @param    qb    The second quaternion in the multiplication.
            */
            Quaternion.prototype.multiply = function (qa, qb) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;

                this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            };

            Quaternion.prototype.multiplyVector = function (vector, target) {
                if (typeof target === "undefined") { target = null; }
                if (target === null) {
                    target = new Quaternion();
                }

                var x2 = vector.x;
                var y2 = vector.y;
                var z2 = vector.z;

                target.w = -this.x * x2 - this.y * y2 - this.z * z2;
                target.x = this.w * x2 + this.y * z2 - this.z * y2;
                target.y = this.w * y2 - this.x * z2 + this.z * x2;
                target.z = this.w * z2 + this.x * y2 - this.y * x2;

                return target;
            };

            /**
            * Fills the quaternion object with values representing the given rotation around a vector.
            *
            * @param    axis    The axis around which to rotate
            * @param    angle    The angle in radians of the rotation.
            */
            Quaternion.prototype.fromAxisAngle = function (axis, angle) {
                var sin_a = Math.sin(angle / 2);
                var cos_a = Math.cos(angle / 2);

                this.x = axis.x * sin_a;
                this.y = axis.y * sin_a;
                this.z = axis.z * sin_a;
                this.w = cos_a;

                this.normalize();
            };

            /**
            * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
            * @param qa The first quaternion to interpolate.
            * @param qb The second quaternion to interpolate.
            * @param t The interpolation weight, a value between 0 and 1.
            */
            Quaternion.prototype.slerp = function (qa, qb, t) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
                var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

                if (dot < 0) {
                    dot = -dot;
                    w2 = -w2;
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                }

                if (dot < 0.95) {
                    // interpolate angle linearly
                    var angle = Math.acos(dot);
                    var s = 1 / Math.sin(angle);
                    var s1 = Math.sin(angle * (1 - t)) * s;
                    var s2 = Math.sin(angle * t) * s;
                    this.w = w1 * s1 + w2 * s2;
                    this.x = x1 * s1 + x2 * s2;
                    this.y = y1 * s1 + y2 * s2;
                    this.z = z1 * s1 + z2 * s2;
                } else {
                    // nearly identical angle, interpolate linearly
                    this.w = w1 + t * (w2 - w1);
                    this.x = x1 + t * (x2 - x1);
                    this.y = y1 + t * (y2 - y1);
                    this.z = z1 + t * (z2 - z1);
                    var len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                    this.w *= len;
                    this.x *= len;
                    this.y *= len;
                    this.z *= len;
                }
            };

            /**
            * Linearly interpolates between two quaternions.
            * @param qa The first quaternion to interpolate.
            * @param qb The second quaternion to interpolate.
            * @param t The interpolation weight, a value between 0 and 1.
            */
            Quaternion.prototype.lerp = function (qa, qb, t) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
                var len;

                if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                    w2 = -w2;
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                }

                this.w = w1 + t * (w2 - w1);
                this.x = x1 + t * (x2 - x1);
                this.y = y1 + t * (y2 - y1);
                this.z = z1 + t * (z2 - z1);

                len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                this.w *= len;
                this.x *= len;
                this.y *= len;
                this.z *= len;
            };

            /**
            * Fills the quaternion object with values representing the given euler rotation.
            *
            * @param    ax        The angle in radians of the rotation around the ax axis.
            * @param    ay        The angle in radians of the rotation around the ay axis.
            * @param    az        The angle in radians of the rotation around the az axis.
            */
            Quaternion.prototype.fromEulerAngles = function (ax, ay, az) {
                var halfX = ax * .5, halfY = ay * .5, halfZ = az * .5;
                var cosX = Math.cos(halfX), sinX = Math.sin(halfX);
                var cosY = Math.cos(halfY), sinY = Math.sin(halfY);
                var cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);

                this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
                this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
                this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
                this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
            };

            /**
            * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
            * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
            * @return The Vector3D containing the Euler angles.
            */
            Quaternion.prototype.toEulerAngles = function (target) {
                if (typeof target === "undefined") { target = null; }
                if (target === null) {
                    target = new away.geom.Vector3D();
                }

                target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
                target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
                target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));

                return target;
            };

            /**
            * Normalises the quaternion object.
            */
            Quaternion.prototype.normalize = function (val) {
                if (typeof val === "undefined") { val = 1; }
                var mag = val / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

                this.x *= mag;
                this.y *= mag;
                this.z *= mag;
                this.w *= mag;
            };

            /**
            * Used to trace the values of a quaternion.
            *
            * @return A string representation of the quaternion object.
            */
            Quaternion.prototype.toString = function () {
                return "{x:" + this.x + " y:" + this.y + " z:" + this.z + " w:" + this.w + "}";
            };

            /**
            * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
            * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
            * @return A Matrix3D object representing an equivalent rotation.
            */
            Quaternion.prototype.toMatrix3D = function (target) {
                if (typeof target === "undefined") { target = null; }
                var rawData = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
                var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
                var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
                var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

                rawData[0] = xx - yy - zz + ww;
                rawData[4] = xy2 - zw2;
                rawData[8] = xz2 + yw2;
                rawData[12] = 0;
                rawData[1] = xy2 + zw2;
                rawData[5] = -xx + yy - zz + ww;
                rawData[9] = yz2 - xw2;
                rawData[13] = 0;
                rawData[2] = xz2 - yw2;
                rawData[6] = yz2 + xw2;
                rawData[10] = -xx - yy + zz + ww;
                rawData[14] = 0;
                rawData[3] = 0.0;
                rawData[7] = 0.0;
                rawData[11] = 0;
                rawData[15] = 1;

                if (!target)
                    return new away.geom.Matrix3D(rawData);

                target.copyRawDataFrom(rawData);

                return target;
            };

            /**
            * Extracts a quaternion rotation matrix out of a given Matrix3D object.
            * @param matrix The Matrix3D out of which the rotation will be extracted.
            */
            Quaternion.prototype.fromMatrix = function (matrix) {
                // todo: this isn't right, doesn't take into account transforms
                //var v:away.geom.Vector3D = matrix.decompose(Orientation3D.QUATERNION)[1];
                var v = matrix.decompose()[1];
                this.x = v.x;
                this.y = v.y;
                this.z = v.z;
                this.w = v.w;
            };

            /**
            * Converts the quaternion to a Vector.&lt;Number&gt; matrix representation of a rotation equivalent to this quaternion.
            * @param target The Vector.&lt;Number&gt; to contain the raw matrix data.
            * @param exclude4thRow If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
            */
            Quaternion.prototype.toRawData = function (target, exclude4thRow) {
                if (typeof exclude4thRow === "undefined") { exclude4thRow = false; }
                var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
                var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
                var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

                target[0] = xx - yy - zz + ww;
                target[1] = xy2 - zw2;
                target[2] = xz2 + yw2;
                target[4] = xy2 + zw2;
                target[5] = -xx + yy - zz + ww;
                target[6] = yz2 - xw2;
                target[8] = xz2 - yw2;
                target[9] = yz2 + xw2;
                target[10] = -xx - yy + zz + ww;
                target[3] = target[7] = target[11] = 0;

                if (!exclude4thRow) {
                    target[12] = target[13] = target[14] = 0;
                    target[15] = 1;
                }
            };

            /**
            * Clones the quaternion.
            * @return An exact duplicate of the current Quaternion.
            */
            Quaternion.prototype.clone = function () {
                return new Quaternion(this.x, this.y, this.z, this.w);
            };

            /**
            * Rotates a point.
            * @param vector The Vector3D object to be rotated.
            * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
            * @return A Vector3D object containing the rotated point.
            */
            Quaternion.prototype.rotatePoint = function (vector, target) {
                if (typeof target === "undefined") { target = null; }
                var x1, y1, z1, w1;
                var x2 = vector.x, y2 = vector.y, z2 = vector.z;

                if (target === null) {
                    target = new away.geom.Vector3D();
                }

                // p*q'
                w1 = -this.x * x2 - this.y * y2 - this.z * z2;
                x1 = this.w * x2 + this.y * z2 - this.z * y2;
                y1 = this.w * y2 - this.x * z2 + this.z * x2;
                z1 = this.w * z2 + this.x * y2 - this.y * x2;

                target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
                target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
                target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;

                return target;
            };

            /**
            * Copies the data from a quaternion into this instance.
            * @param q The quaternion to copy from.
            */
            Quaternion.prototype.copyFrom = function (q) {
                this.x = q.x;
                this.y = q.y;
                this.z = q.z;
                this.w = q.w;
            };
            return Quaternion;
        })();
        math.Quaternion = Quaternion;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    (function (math) {
        var PlaneClassification = (function () {
            function PlaneClassification() {
            }
            PlaneClassification.BACK = 0;
            PlaneClassification.FRONT = 1;

            PlaneClassification.IN = 0;
            PlaneClassification.OUT = 1;
            PlaneClassification.INTERSECT = 2;
            return PlaneClassification;
        })();
        math.PlaneClassification = PlaneClassification;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../math/PlaneClassification.ts" />
    ///<reference path="../geom/Vector3D.ts" />
    (function (math) {
        var Plane3D = (function () {
            /**
            * Create a Plane3D with ABCD coefficients
            */
            function Plane3D(a, b, c, d) {
                if (typeof a === "undefined") { a = 0; }
                if (typeof b === "undefined") { b = 0; }
                if (typeof c === "undefined") { c = 0; }
                if (typeof d === "undefined") { d = 0; }
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;

                if (a == 0 && b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (b == 0 && c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (a == 0 && c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            }
            /**
            * Fills this Plane3D with the coefficients from 3 points in 3d space.
            * @param p0 Vector3D
            * @param p1 Vector3D
            * @param p2 Vector3D
            */
            Plane3D.prototype.fromPoints = function (p0, p1, p2) {
                var d1x = p1.x - p0.x;
                var d1y = p1.y - p0.y;
                var d1z = p1.z - p0.z;

                var d2x = p2.x - p0.x;
                var d2y = p2.y - p0.y;
                var d2z = p2.z - p0.z;

                this.a = d1y * d2z - d1z * d2y;
                this.b = d1z * d2x - d1x * d2z;
                this.c = d1x * d2y - d1y * d2x;
                this.d = this.a * p0.x + this.b * p0.y + this.c * p0.z;

                if (this.a == 0 && this.b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (this.b == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (this.a == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            };

            /**
            * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
            * @param normal Vector3D
            * @param point  Vector3D
            */
            Plane3D.prototype.fromNormalAndPoint = function (normal, point) {
                this.a = normal.x;
                this.b = normal.y;
                this.c = normal.z;
                this.d = this.a * point.x + this.b * point.y + this.c * point.z;
                if (this.a == 0 && this.b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (this.b == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (this.a == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            };

            /**
            * Normalize this Plane3D
            * @return Plane3D This Plane3D.
            */
            Plane3D.prototype.normalize = function () {
                var len = 1 / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
                this.a *= len;
                this.b *= len;
                this.c *= len;
                this.d *= len;
                return this;
            };

            /**
            * Returns the signed distance between this Plane3D and the point p.
            * @param p Vector3D
            * @returns Number
            */
            Plane3D.prototype.distance = function (p) {
                if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS) {
                    return this.a * p.x - this.d;
                } else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS) {
                    return this.b * p.y - this.d;
                } else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS) {
                    return this.c * p.z - this.d;
                } else {
                    return this.a * p.x + this.b * p.y + this.c * p.z - this.d;
                }
            };

            /**
            * Classify a point against this Plane3D. (in front, back or intersecting)
            * @param p Vector3D
            * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
            */
            Plane3D.prototype.classifyPoint = function (p, epsilon) {
                if (typeof epsilon === "undefined") { epsilon = 0.01; }
                if (this.d != this.d)
                    return away.math.PlaneClassification.FRONT;

                var len;
                if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS)
                    len = this.a * p.x - this.d; else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS)
                    len = this.b * p.y - this.d; else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS)
                    len = this.c * p.z - this.d; else
                    len = this.a * p.x + this.b * p.y + this.c * p.z - this.d;

                if (len < -epsilon)
                    return away.math.PlaneClassification.BACK; else if (len > epsilon)
                    return away.math.PlaneClassification.FRONT; else
                    return away.math.PlaneClassification.INTERSECT;
            };

            Plane3D.prototype.toString = function () {
                return "Plane3D [a:" + this.a + ", b:" + this.b + ", c:" + this.c + ", d:" + this.d + "]";
            };
            Plane3D.ALIGN_ANY = 0;
            Plane3D.ALIGN_XY_AXIS = 1;
            Plane3D.ALIGN_YZ_AXIS = 2;
            Plane3D.ALIGN_XZ_AXIS = 3;
            return Plane3D;
        })();
        math.Plane3D = Plane3D;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../math/Quaternion.ts" />
    ///<reference path="../math/Plane3D.ts" />
    (function (math) {
        //import flash.geom.*;
        /**
        * away3d.math.Matrix3DUtils provides additional Matrix3D math functions.
        */
        var Matrix3DUtils = (function () {
            function Matrix3DUtils() {
            }
            Matrix3DUtils.quaternion2matrix = /**
            * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
            *
            * @param    quarternion    The quarterion object to convert.
            */
            function (quarternion, m) {
                if (typeof m === "undefined") { m = null; }
                var x = quarternion.x;
                var y = quarternion.y;
                var z = quarternion.z;
                var w = quarternion.w;

                var xx = x * x;
                var xy = x * y;
                var xz = x * z;
                var xw = x * w;

                var yy = y * y;
                var yz = y * z;
                var yw = y * w;

                var zz = z * z;
                var zw = z * w;

                var raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
                raw[0] = 1 - 2 * (yy + zz);
                raw[1] = 2 * (xy + zw);
                raw[2] = 2 * (xz - yw);
                raw[4] = 2 * (xy - zw);
                raw[5] = 1 - 2 * (xx + zz);
                raw[6] = 2 * (yz + xw);
                raw[8] = 2 * (xz + yw);
                raw[9] = 2 * (yz - xw);
                raw[10] = 1 - 2 * (xx + yy);
                raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
                raw[15] = 1;

                if (m) {
                    m.copyRawDataFrom(raw);
                    return m;
                } else
                    return new away.geom.Matrix3D(raw);
            };

            Matrix3DUtils.getForward = /**
            * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the forward vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The forward vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(2, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.getUp = /**
            * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the up vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The up vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(1, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.getRight = /**
            * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the right vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The right vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(0, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.lookAt = /**
            * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
            */
            /* TODO: implement - dependent on Matrix3D.copyRawDataTo
            public static compare(m1:away.geom.Matrix3D, m2:away.geom.Matrix3D):boolean
            {
            var r1:number[] = away.math.Matrix3DUtils.Matrix3DUtils.RAW_DATA_CONTAINER;
            var r2:number[] = m2.rawData;
            m1.copyRawDataTo(r1);
            
            for (var i:number = 0; i < 16; ++i) {
            if (r1[i] != r2[i])
            return false;
            }
            
            return true;
            }
            */
            function (matrix, pos, dir, up) {
                var dirN;
                var upN;
                var lftN;
                var raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;

                lftN = dir.crossProduct(up);
                lftN.normalize();

                upN = lftN.crossProduct(dir);
                upN.normalize();
                dirN = dir.clone();
                dirN.normalize();

                raw[0] = lftN.x;
                raw[1] = upN.x;
                raw[2] = -dirN.x;
                raw[3] = 0.0;

                raw[4] = lftN.y;
                raw[5] = upN.y;
                raw[6] = -dirN.y;
                raw[7] = 0.0;

                raw[8] = lftN.z;
                raw[9] = upN.z;
                raw[10] = -dirN.z;
                raw[11] = 0.0;

                raw[12] = -lftN.dotProduct(pos);
                raw[13] = -upN.dotProduct(pos);
                raw[14] = dirN.dotProduct(pos);
                raw[15] = 1.0;

                matrix.copyRawDataFrom(raw);
            };

            Matrix3DUtils.reflection = function (plane, target) {
                if (typeof target === "undefined") { target = null; }
                if (target === null) {
                    target = new away.geom.Matrix3D();
                }

                var a = plane.a, b = plane.b, c = plane.c, d = plane.d;
                var rawData = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
                var ab2 = -2 * a * b;
                var ac2 = -2 * a * c;
                var bc2 = -2 * b * c;

                // reflection matrix
                rawData[0] = 1 - 2 * a * a;
                rawData[4] = ab2;
                rawData[8] = ac2;
                rawData[12] = -2 * a * d;
                rawData[1] = ab2;
                rawData[5] = 1 - 2 * b * b;
                rawData[9] = bc2;
                rawData[13] = -2 * b * d;
                rawData[2] = ac2;
                rawData[6] = bc2;
                rawData[10] = 1 - 2 * c * c;
                rawData[14] = -2 * c * d;
                rawData[3] = 0;
                rawData[7] = 0;
                rawData[11] = 0;
                rawData[15] = 1;
                target.copyRawDataFrom(rawData);

                return target;
            };
            Matrix3DUtils.RAW_DATA_CONTAINER = new Array(16);

            Matrix3DUtils.CALCULATION_MATRIX = new away.geom.Matrix3D();
            return Matrix3DUtils;
        })();
        math.Matrix3DUtils = Matrix3DUtils;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
//<reference path="../src/away/base/Object3D.ts" />
///<reference path="../src/away/math/MathConsts.ts" />
///<reference path="../src/away/math/Quaternion.ts" />
///<reference path="../src/away/math/Matrix3DUtils.ts" />
///<reference path="../src/away/math/Plane3D.ts" />
///<reference path="../src/away/geom/Matrix3D.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/Object3DTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/Object3DTest.js
//------------------------------------------------------------------------------------------------
var Object3DTest = (function () {
    function Object3DTest() {
        var q = new away.math.Quaternion();

        var m = new away.geom.Matrix3D();
        away.math.Matrix3DUtils;

        //console.log( away.math.MathConsts.DEGREES_TO_RADIANS );
        //console.log( away.math.MathConsts.RADIANS_TO_DEGREES );
        var rdc = new Array(16);
        console.log(rdc.length);
    }
    return Object3DTest;
})();

var test;
window.onload = function () {
    test = new Object3DTest();
};
//@ sourceMappingURL=Object3DTest.js.map
