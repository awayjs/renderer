var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (geom) {
        var Point = (function () {
            function Point(x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                this.x = x;
                this.y = y;
            }
            return Point;
        })();
        geom.Point = Point;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
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
    ///<reference path="Point.ts" />
    ///<reference path="Vector3D.ts" />
    ///<reference path="../errors/ArgumentError.ts" />
    (function (geom) {
        var Matrix = (function () {
            function Matrix(a, b, c, d, tx, ty) {
                if (typeof a === "undefined") { a = 1; }
                if (typeof b === "undefined") { b = 0; }
                if (typeof c === "undefined") { c = 0; }
                if (typeof d === "undefined") { d = 1; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }
            /**
            *
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.clone = function () {
                return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
            };

            /**
            *
            * @param m
            */
            Matrix.prototype.concat = function (m) {
                var a1 = this.a * m.a + this.b * m.c;
                this.b = this.a * m.b + this.b * m.d;
                this.a = a1;

                var c1 = this.c * m.a + this.d * m.c;
                this.d = this.c * m.b + this.d * m.d;

                this.c = c1;

                var tx1 = this.tx * m.a + this.ty * m.c + m.tx;
                this.ty = this.tx * m.b + this.ty * m.d + m.ty;
                this.tx = tx1;
            };

            /**
            *
            * @param column
            * @param vector3D
            */
            Matrix.prototype.copyColumnFrom = function (column, vector3D) {
                if (column > 2) {
                    throw "Column " + column + " out of bounds (2)";
                } else if (column == 0) {
                    this.a = vector3D.x;
                    this.c = vector3D.y;
                } else if (column == 1) {
                    this.b = vector3D.x;
                    this.d = vector3D.y;
                } else {
                    this.tx = vector3D.x;
                    this.ty = vector3D.y;
                }
            };

            /**
            *
            * @param column
            * @param vector3D
            */
            Matrix.prototype.copyColumnTo = function (column, vector3D) {
                if (column > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");
                } else if (column == 0) {
                    vector3D.x = this.a;
                    vector3D.y = this.c;
                    vector3D.z = 0;
                } else if (column == 1) {
                    vector3D.x = this.b;
                    vector3D.y = this.d;
                    vector3D.z = 0;
                } else {
                    vector3D.x = this.tx;
                    vector3D.y = this.ty;
                    vector3D.z = 1;
                }
            };

            /**
            *
            * @param other
            */
            Matrix.prototype.copyFrom = function (other) {
                this.a = other.a;
                this.b = other.b;
                this.c = other.c;
                this.d = other.d;
                this.tx = other.tx;
                this.ty = other.ty;
            };

            /**
            *
            * @param row
            * @param vector3D
            */
            Matrix.prototype.copyRowFrom = function (row, vector3D) {
                if (row > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
                } else if (row == 0) {
                    this.a = vector3D.x;
                    this.c = vector3D.y;
                } else if (row == 1) {
                    this.b = vector3D.x;
                    this.d = vector3D.y;
                } else {
                    this.tx = vector3D.x;
                    this.ty = vector3D.y;
                }
            };

            /**
            *
            * @param row
            * @param vector3D
            */
            Matrix.prototype.copyRowTo = function (row, vector3D) {
                if (row > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
                } else if (row == 0) {
                    vector3D.x = this.a;
                    vector3D.y = this.b;
                    vector3D.z = this.tx;
                } else if (row == 1) {
                    vector3D.x = this.c;
                    vector3D.y = this.d;
                    vector3D.z = this.ty;
                } else {
                    vector3D.setTo(0, 0, 1);
                }
            };

            /**
            *
            * @param scaleX
            * @param scaleY
            * @param rotation
            * @param tx
            * @param ty
            */
            Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
                if (typeof rotation === "undefined") { rotation = 0; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = scaleX;
                this.d = scaleY;
                this.b = rotation;
                this.tx = tx;
                this.ty = ty;
            };

            /**
            *
            * @param width
            * @param height
            * @param rotation
            * @param tx
            * @param ty
            */
            Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
                if (typeof rotation === "undefined") { rotation = 0; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = width / 1638.4;
                this.d = height / 1638.4;

                if (rotation != 0.0) {
                    var cos = Math.cos(rotation);
                    var sin = Math.sin(rotation);

                    this.b = sin * this.d;
                    this.c = -sin * this.a;
                    this.a *= cos;
                    this.d *= cos;
                } else {
                    this.b = this.c = 0;
                }

                this.tx = tx + width / 2;
                this.ty = ty + height / 2;
            };

            /**
            *
            * @param point
            * @returns {away.geom.Point}
            */
            Matrix.prototype.deltaTransformPoint = function (point) {
                return new away.geom.Point(point.x * this.a + point.y * this.c, point.x * this.b + point.y * this.d);
            };

            /**
            *
            */
            Matrix.prototype.identity = function () {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            };

            /**
            *
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.invert = function () {
                var norm = this.a * this.d - this.b * this.c;

                if (norm == 0) {
                    this.a = this.b = this.c = this.d = 0;
                    this.tx = -this.tx;
                    this.ty = -this.ty;
                } else {
                    norm = 1.0 / norm;
                    var a1 = this.d * norm;
                    this.d = this.a * norm;
                    this.a = a1;
                    this.b *= -norm;
                    this.c *= -norm;

                    var tx1 = -this.a * this.tx - this.c * this.ty;
                    this.ty = -this.b * this.tx - this.d * this.ty;
                    this.tx = tx1;
                }

                return this;
            };

            /**
            *
            * @param m
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.mult = function (m) {
                var result = new Matrix();

                result.a = this.a * m.a + this.b * m.c;
                result.b = this.a * m.b + this.b * m.d;
                result.c = this.c * m.a + this.d * m.c;
                result.d = this.c * m.b + this.d * m.d;

                result.tx = this.tx * m.a + this.ty * m.c + m.tx;
                result.ty = this.tx * m.b + this.ty * m.d + m.ty;

                return result;
            };

            /**
            *
            * @param angle
            */
            Matrix.prototype.rotate = function (angle) {
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);

                var a1 = this.a * cos - this.b * sin;
                this.b = this.a * sin + this.b * cos;
                this.a = a1;

                var c1 = this.c * cos - this.d * sin;
                this.d = this.c * sin + this.d * cos;
                this.c = c1;

                var tx1 = this.tx * cos - this.ty * sin;
                this.ty = this.tx * sin + this.ty * cos;
                this.tx = tx1;
            };

            /**
            *
            * @param x
            * @param y
            */
            Matrix.prototype.scale = function (x, y) {
                this.a *= x;
                this.b *= y;

                this.c *= x;
                this.d *= y;

                this.tx *= x;
                this.ty *= y;
            };

            /**
            *
            * @param angle
            * @param scale
            */
            Matrix.prototype.setRotation = function (angle, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                this.a = Math.cos(angle) * scale;
                this.c = Math.sin(angle) * scale;
                this.b = -this.c;
                this.d = this.a;
            };

            /**
            *
            * @param a
            * @param b
            * @param c
            * @param d
            * @param tx
            * @param ty
            */
            Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            };

            /**
            *
            * @returns {string}
            */
            Matrix.prototype.toString = function () {
                return "[Matrix] (a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
            };

            /**
            *
            * @param point
            * @returns {away.geom.Point}
            */
            Matrix.prototype.transformPoint = function (point) {
                return new away.geom.Point(point.x * this.a + point.y * this.c + this.tx, point.x * this.b + point.y * this.d + this.ty);
            };

            /**
            *
            * @param x
            * @param y
            */
            Matrix.prototype.translate = function (x, y) {
                this.tx += x;
                this.ty += y;
            };
            return Matrix;
        })();
        geom.Matrix = Matrix;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../src/away/geom/Matrix.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/MatrixTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/MatrixTest.js
//------------------------------------------------------------------------------------------------
var MatrixTest = (function () {
    function MatrixTest() {
        this.ma = new away.geom.Matrix(10, 11, 12, 13, 14, 15);
        this.mb = new away.geom.Matrix(0, 1, 2, 3, 4, 5);
        this.ma.concat(this.mb);
        console.log(this.ma);
    }
    return MatrixTest;
})();

window.onload = function () {
    try  {
        var test = new MatrixTest();
    } catch (e) {
        console.log(e);
    }
};
//@ sourceMappingURL=MatrixTest.js.map
