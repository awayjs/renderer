///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Sampler = (function () {
        function Sampler() {
            this.lodbias = 0;
            this.dim = 0;
            this.readmode = 0;
            this.special = 0;
            this.wrap = 0;
            this.mipmap = 0;
            this.filter = 0;
        }
        return Sampler;
    })();
    aglsl.Sampler = Sampler;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Token = (function () {
        function Token() {
            this.dest = new aglsl.Destination();
            this.opcode = 0;
            this.a = new aglsl.Destination();
            this.b = new aglsl.Destination();
        }
        return Token;
    })();
    aglsl.Token = Token;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Header = (function () {
        function Header() {
            this.progid = 0;
            this.version = 0;
            this.type = "";
        }
        return Header;
    })();
    aglsl.Header = Header;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var OpLUT = (function () {
        function OpLUT(s, flags, dest, a, b, matrixwidth, matrixheight, ndwm, scaler, dm, lod) {
            this.s = s;
            this.flags = flags;
            this.dest = dest;
            this.a = a;
            this.b = b;
            this.matrixwidth = matrixwidth;
            this.matrixheight = matrixheight;
            this.ndwm = ndwm;
            this.scalar = scaler;
            this.dm = dm;
            this.lod = lod;
        }
        return OpLUT;
    })();
    aglsl.OpLUT = OpLUT;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Description = (function () {
        function Description() {
            this.regread = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            this.regwrite = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            this.hasindirect = false;
            this.writedepth = false;
            this.hasmatrix = false;
            this.samplers = [];
            // added due to dynamic assignment 3*0xFFFFFFuuuu
            this.tokens = [];
            this.header = new aglsl.Header();
        }
        return Description;
    })();
    aglsl.Description = Description;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Destination = (function () {
        function Destination() {
            this.mask = 0;
            this.regnum = 0;
            this.regtype = 0;
            this.dim = 0;
        }
        return Destination;
    })();
    aglsl.Destination = Destination;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var ContextGL = (function () {
        function ContextGL() {
            this.enableErrorChecking = false;
            this.resources = [];
            this.driverInfo = "Call getter function instead";
        }
        ContextGL.maxvertexconstants = 128;
        ContextGL.maxfragconstants = 28;
        ContextGL.maxtemp = 8;
        ContextGL.maxstreams = 8;
        ContextGL.maxtextures = 8;
        ContextGL.defaultsampler = new aglsl.Sampler();
        return ContextGL;
    })();
    aglsl.ContextGL = ContextGL;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Mapping = (function () {
        function Mapping() {
        }
        Mapping.agal2glsllut = [
            new aglsl.OpLUT("%dest = %cast(%a);\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a + %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a - %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a * %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a / %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(1.0) / %a;\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(min(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(max(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(fract(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(sqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(inversesqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(pow(abs(%a),%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(log2(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(exp2(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(normalize(vec3( %a ) ));\n", 0, true, true, false, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(sin(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(cos(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(cross(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(abs(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a * -1.0);\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(clamp(%a,0.0,1.0));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", null, true, true, true, 3, 3, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 4, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 3, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("if (float(%a)==float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)!=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)>=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)<float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("} else {;\n", 0, false, false, false, null, null, null, null, null, null), new aglsl.OpLUT("};\n", 0, false, false, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n", null, true, true, true, null, null, null, null, true, null), new aglsl.OpLUT("if ( float(%a)<0.0 ) discard;\n", null, false, true, false, null, null, null, true, null, null), new aglsl.OpLUT("%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n", null, true, true, true, null, null, true, null, true, true), new aglsl.OpLUT("%dest = %cast(greaterThanEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(lessThan(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(sign(%a));\n", 0, true, true, false, null, null, null, null, null, null), new aglsl.OpLUT("%dest = %cast(equal(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(notEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null)
        ];
        return Mapping;
    })();
    aglsl.Mapping = Mapping;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Opcode = (function () {
            function Opcode(dest, aformat, asize, bformat, bsize, opcode, simple, horizontal, fragonly, matrix) {
                this.a = new aglsl.assembler.FS();
                this.b = new aglsl.assembler.FS();
                this.flags = new aglsl.assembler.Flags();

                this.dest = dest;
                this.a.format = aformat;
                this.a.size = asize;
                this.b.format = bformat;
                this.b.size = bsize;
                this.opcode = opcode;
                this.flags.simple = simple;
                this.flags.horizontal = horizontal;
                this.flags.fragonly = fragonly;
                this.flags.matrix = matrix;
            }
            return Opcode;
        })();
        assembler.Opcode = Opcode;

        var FS = (function () {
            function FS() {
            }
            return FS;
        })();
        assembler.FS = FS;

        var Flags = (function () {
            function Flags() {
            }
            return Flags;
        })();
        assembler.Flags = Flags;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var OpcodeMap = (function () {
            function OpcodeMap() {
            }
            Object.defineProperty(OpcodeMap, "map", {
                get: function () {
                    if (!OpcodeMap._map) {
                        OpcodeMap._map = new Array();
                        OpcodeMap._map['mov'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x00, true, null, null, null);
                        OpcodeMap._map['add'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x01, true, null, null, null);
                        OpcodeMap._map['sub'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x02, true, null, null, null);
                        OpcodeMap._map['mul'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x03, true, null, null, null);
                        OpcodeMap._map['div'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x04, true, null, null, null);
                        OpcodeMap._map['rcp'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x05, true, null, null, null);
                        OpcodeMap._map['min'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x06, true, null, null, null);
                        OpcodeMap._map['max'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x07, true, null, null, null);
                        OpcodeMap._map['frc'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x08, true, null, null, null);
                        OpcodeMap._map['sqt'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x09, true, null, null, null);
                        OpcodeMap._map['rsq'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0a, true, null, null, null);
                        OpcodeMap._map['pow'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x0b, true, null, null, null);
                        OpcodeMap._map['log'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0c, true, null, null, null);
                        OpcodeMap._map['exp'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0d, true, null, null, null);
                        OpcodeMap._map['nrm'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0e, true, null, null, null);
                        OpcodeMap._map['sin'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0f, true, null, null, null);
                        OpcodeMap._map['cos'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x10, true, null, null, null);
                        OpcodeMap._map['crs'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x11, true, true, null, null);
                        OpcodeMap._map['dp3'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x12, true, true, null, null);
                        OpcodeMap._map['dp4'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x13, true, true, null, null);
                        OpcodeMap._map['abs'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x14, true, null, null, null);
                        OpcodeMap._map['neg'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x15, true, null, null, null);
                        OpcodeMap._map['sat'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x16, true, null, null, null);

                        OpcodeMap._map['ted'] = new aglsl.assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x26, true, null, true, null);
                        OpcodeMap._map['kil'] = new aglsl.assembler.Opcode("none", "scalar", 1, "none", 0, 0x27, true, null, true, null);
                        OpcodeMap._map['tex'] = new aglsl.assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x28, true, null, true, null);

                        OpcodeMap._map['m33'] = new aglsl.assembler.Opcode("vector", "matrix", 3, "vector", 3, 0x17, true, null, null, true);
                        OpcodeMap._map['m44'] = new aglsl.assembler.Opcode("vector", "matrix", 4, "vector", 4, 0x18, true, null, null, true);
                        OpcodeMap._map['m43'] = new aglsl.assembler.Opcode("vector", "matrix", 3, "vector", 4, 0x19, true, null, null, true);

                        OpcodeMap._map['sge'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x29, true, null, null, null);
                        OpcodeMap._map['slt'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2a, true, null, null, null);
                        OpcodeMap._map['sgn'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2b, true, null, null, null);
                        OpcodeMap._map['seq'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2c, true, null, null, null);
                        OpcodeMap._map['sne'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2d, true, null, null, null);
                    }

                    return OpcodeMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return OpcodeMap;
        })();
        assembler.OpcodeMap = OpcodeMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Part = (function () {
            function Part(name, version) {
                if (typeof name === "undefined") { name = null; }
                if (typeof version === "undefined") { version = null; }
                this.name = "";
                this.version = 0;
                this.name = name;
                this.version = version;
                this.data = new away.utils.ByteArray();
            }
            return Part;
        })();
        assembler.Part = Part;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Reg = (function () {
            function Reg(code, desc) {
                this.code = code;
                this.desc = desc;
            }
            return Reg;
        })();
        assembler.Reg = Reg;

        var RegMap = (function () {
            /*
            public static va:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x00, "vertex attribute" );
            public static fc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "fragment constant" );
            public static vc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "vertex constant" );
            public static ft:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "fragment temporary" );
            public static vt:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "vertex temporary" );
            public static vo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
            public static op:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
            public static fd:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment depth output" );
            public static fo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
            public static oc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
            public static v: aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying" );
            public static vi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying output" );
            public static fi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying input" );
            public static fs:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x05, "sampler" );
            */
            function RegMap() {
            }
            Object.defineProperty(RegMap, "map", {
                get: function () {
                    if (!RegMap._map) {
                        RegMap._map = new Array();
                        RegMap._map['va'] = new aglsl.assembler.Reg(0x00, "vertex attribute");
                        RegMap._map['fc'] = new aglsl.assembler.Reg(0x01, "fragment constant");
                        RegMap._map['vc'] = new aglsl.assembler.Reg(0x01, "vertex constant");
                        RegMap._map['ft'] = new aglsl.assembler.Reg(0x02, "fragment temporary");
                        RegMap._map['vt'] = new aglsl.assembler.Reg(0x02, "vertex temporary");
                        RegMap._map['vo'] = new aglsl.assembler.Reg(0x03, "vertex output");
                        RegMap._map['op'] = new aglsl.assembler.Reg(0x03, "vertex output");
                        RegMap._map['fd'] = new aglsl.assembler.Reg(0x03, "fragment depth output");
                        RegMap._map['fo'] = new aglsl.assembler.Reg(0x03, "fragment output");
                        RegMap._map['oc'] = new aglsl.assembler.Reg(0x03, "fragment output");
                        RegMap._map['v'] = new aglsl.assembler.Reg(0x04, "varying");
                        RegMap._map['vi'] = new aglsl.assembler.Reg(0x04, "varying output");
                        RegMap._map['fi'] = new aglsl.assembler.Reg(0x04, "varying input");
                        RegMap._map['fs'] = new aglsl.assembler.Reg(0x05, "sampler");
                    }

                    return RegMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return RegMap;
        })();
        assembler.RegMap = RegMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Sampler = (function () {
            function Sampler(shift, mask, value) {
                this.shift = shift;
                this.mask = mask;
                this.value = value;
            }
            return Sampler;
        })();
        assembler.Sampler = Sampler;

        var SamplerMap = (function () {
            /*
            public static map =     [ new aglsl.assembler.Sampler( 8, 0xf, 0 ),
            new aglsl.assembler.Sampler( 8, 0xf, 5 ),
            new aglsl.assembler.Sampler( 8, 0xf, 4 ),
            new aglsl.assembler.Sampler( 8, 0xf, 1 ),
            new aglsl.assembler.Sampler( 8, 0xf, 2 ),
            new aglsl.assembler.Sampler( 8, 0xf, 1 ),
            new aglsl.assembler.Sampler( 8, 0xf, 2 ),
            
            // dimension
            new aglsl.assembler.Sampler( 12, 0xf, 0 ),
            new aglsl.assembler.Sampler( 12, 0xf, 1 ),
            new aglsl.assembler.Sampler( 12, 0xf, 2 ),
            
            // special
            new aglsl.assembler.Sampler( 16, 1, 1 ),
            new aglsl.assembler.Sampler( 16, 4, 4 ),
            
            // repeat
            new aglsl.assembler.Sampler( 20, 0xf, 0 ),
            new aglsl.assembler.Sampler( 20, 0xf, 1 ),
            new aglsl.assembler.Sampler( 20, 0xf, 1 ),
            
            // mip
            new aglsl.assembler.Sampler( 24, 0xf, 0 ),
            new aglsl.assembler.Sampler( 24, 0xf, 0 ),
            new aglsl.assembler.Sampler( 24, 0xf, 1 ),
            new aglsl.assembler.Sampler( 24, 0xf, 2 ),
            
            // filter
            new aglsl.assembler.Sampler( 28, 0xf, 0 ),
            new aglsl.assembler.Sampler( 28, 0xf, 1 ) ]
            */
            /*
            public static rgba: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 0 );
            public static rg: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 5 );
            public static r: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 4 );
            public static compressed: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
            public static compressed_alpha: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );
            public static dxt1: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
            public static dxt5: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );
            
            // dimension
            public static sampler2d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 0 );
            public static cube: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 1 );
            public static sampler3d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 2 );
            
            // special
            public static centroid: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 1, 1 );
            public static ignoresampler: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 4, 4 );
            
            // repeat
            public static clamp: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 0 );
            public static repeat: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );
            public static wrap: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );
            
            // mip
            public static nomip: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
            public static mipnone: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
            public static mipnearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 1 );
            public static miplinear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 2 );
            
            // filter
            public static nearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 0 );
            public static linear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 1 );
            */
            function SamplerMap() {
            }
            Object.defineProperty(SamplerMap, "map", {
                get: function () {
                    if (!SamplerMap._map) {
                        SamplerMap._map = new Array();
                        SamplerMap._map['rgba'] = new aglsl.assembler.Sampler(8, 0xf, 0);
                        SamplerMap._map['rg'] = new aglsl.assembler.Sampler(8, 0xf, 5);
                        SamplerMap._map['r'] = new aglsl.assembler.Sampler(8, 0xf, 4);
                        SamplerMap._map['compressed'] = new aglsl.assembler.Sampler(8, 0xf, 1);
                        SamplerMap._map['compressed_alpha'] = new aglsl.assembler.Sampler(8, 0xf, 2);
                        SamplerMap._map['dxt1'] = new aglsl.assembler.Sampler(8, 0xf, 1);
                        SamplerMap._map['dxt5'] = new aglsl.assembler.Sampler(8, 0xf, 2);

                        // dimension
                        SamplerMap._map['2d'] = new aglsl.assembler.Sampler(12, 0xf, 0);
                        SamplerMap._map['cube'] = new aglsl.assembler.Sampler(12, 0xf, 1);
                        SamplerMap._map['3d'] = new aglsl.assembler.Sampler(12, 0xf, 2);

                        // special
                        SamplerMap._map['centroid'] = new aglsl.assembler.Sampler(16, 1, 1);
                        SamplerMap._map['ignoresampler'] = new aglsl.assembler.Sampler(16, 4, 4);

                        // repeat
                        SamplerMap._map['clamp'] = new aglsl.assembler.Sampler(20, 0xf, 0);
                        SamplerMap._map['repeat'] = new aglsl.assembler.Sampler(20, 0xf, 1);
                        SamplerMap._map['wrap'] = new aglsl.assembler.Sampler(20, 0xf, 1);

                        // mip
                        SamplerMap._map['nomip'] = new aglsl.assembler.Sampler(24, 0xf, 0);
                        SamplerMap._map['mipnone'] = new aglsl.assembler.Sampler(24, 0xf, 0);
                        SamplerMap._map['mipnearest'] = new aglsl.assembler.Sampler(24, 0xf, 1);
                        SamplerMap._map['miplinear'] = new aglsl.assembler.Sampler(24, 0xf, 2);

                        // filter
                        SamplerMap._map['nearest'] = new aglsl.assembler.Sampler(28, 0xf, 0);
                        SamplerMap._map['linear'] = new aglsl.assembler.Sampler(28, 0xf, 1);
                    }

                    return SamplerMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return SamplerMap;
        })();
        assembler.SamplerMap = SamplerMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var AGALMiniAssembler = (function () {
            function AGALMiniAssembler() {
                this.r = {};
                this.cur = new aglsl.assembler.Part();
            }
            AGALMiniAssembler.prototype.assemble = function (source, ext_part, ext_version) {
                if (typeof ext_part === "undefined") { ext_part = null; }
                if (typeof ext_version === "undefined") { ext_version = null; }
                if (!ext_version) {
                    ext_version = 1;
                }

                if (ext_part) {
                    this.addHeader(ext_part, ext_version);
                }

                var lines = source.replace(/[\f\n\r\v]+/g, "\n").split("\n");

                for (var i in lines) {
                    this.processLine(lines[i], i);
                }

                return this.r;
            };

            AGALMiniAssembler.prototype.processLine = function (line, linenr) {
                var startcomment = line.search("//");
                if (startcomment != -1) {
                    line = line.slice(0, startcomment);
                }
                line = line.replace(/^\s+|\s+$/g, ""); // remove outer space
                if (!(line.length > 0)) {
                    return;
                }
                var optsi = line.search(/<.*>/g);
                var opts = null;
                if (optsi != -1) {
                    opts = line.slice(optsi).match(/([\w\.\-\+]+)/gi);
                    line = line.slice(0, optsi);
                }

                // get opcode/command
                var tokens = line.match(/([\w\.\+\[\]]+)/gi);
                if (!tokens || tokens.length < 1) {
                    if (line.length >= 3) {
                        console.log("Warning: bad line " + linenr + ": " + line);
                    }
                    return;
                }

                switch (tokens[0]) {
                    case "part":
                        this.addHeader(tokens[1], Number(tokens[2]));
                        break;
                    case "endpart":
                        if (!this.cur) {
                            throw "Unexpected endpart";
                        }
                        this.cur.data.position = 0;
                        this.cur = null;
                        return;
                    default:
                        if (!this.cur) {
                            console.log("Warning: bad line " + linenr + ": " + line + " (Outside of any part definition)");
                            return;
                        }
                        if (this.cur.name == "comment") {
                            return;
                        }
                        var op = assembler.OpcodeMap.map[tokens[0]];
                        if (!op) {
                            throw "Bad opcode " + tokens[0] + " " + linenr + ": " + line;
                        }

                        // console.log( 'AGALMiniAssembler' , 'op' , op );
                        this.emitOpcode(this.cur, op.opcode);
                        var ti = 1;
                        if (op.dest && op.dest != "none") {
                            if (!this.emitDest(this.cur, tokens[ti++], op.dest)) {
                                throw "Bad destination register " + tokens[ti - 1] + " " + linenr + ": " + line;
                            }
                        } else {
                            this.emitZeroDword(this.cur);
                        }

                        if (op.a && op.a.format != "none") {
                            if (!this.emitSource(this.cur, tokens[ti++], op.a))
                                throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                        } else {
                            this.emitZeroQword(this.cur);
                        }

                        if (op.b && op.b.format != "none") {
                            if (op.b.format == "sampler") {
                                if (!this.emitSampler(this.cur, tokens[ti++], op.b, opts)) {
                                    throw "Bad sampler register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                }
                            } else {
                                if (!this.emitSource(this.cur, tokens[ti++], op.b)) {
                                    throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                }
                            }
                        } else {
                            this.emitZeroQword(this.cur);
                        }
                        break;
                }
            };

            AGALMiniAssembler.prototype.emitHeader = function (pr) {
                pr.data.writeUnsignedByte(0xa0); // tag version
                pr.data.writeUnsignedInt(pr.version);
                if (pr.version >= 0x10) {
                    pr.data.writeUnsignedByte(0); // align, for higher versions
                }
                pr.data.writeUnsignedByte(0xa1); // tag program id
                switch (pr.name) {
                    case "fragment":
                        pr.data.writeUnsignedByte(1);
                        break;
                    case "vertex":
                        pr.data.writeUnsignedByte(0);
                        break;
                    case "cpu":
                        pr.data.writeUnsignedByte(2);
                        break;
                    default:
                        pr.data.writeUnsignedByte(0xff);
                        break;
                }
            };

            AGALMiniAssembler.prototype.emitOpcode = function (pr, opcode) {
                pr.data.writeUnsignedInt(opcode);
                //console.log ( "Emit opcode: ", opcode );
            };

            AGALMiniAssembler.prototype.emitZeroDword = function (pr) {
                pr.data.writeUnsignedInt(0);
            };

            AGALMiniAssembler.prototype.emitZeroQword = function (pr) {
                pr.data.writeUnsignedInt(0);
                pr.data.writeUnsignedInt(0);
            };

            AGALMiniAssembler.prototype.emitDest = function (pr, token, opdest) {
                //console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map' , RegMap.map);
                var reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i);

                // console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'reg' , reg , reg[1] , RegMap.map[reg[1]] );
                // console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map[reg[1]]' , RegMap.map[reg[1]] , 'bool' , !RegMap.map[reg[1]] ) ;
                if (!assembler.RegMap.map[reg[1]])
                    return false;
                var em = { num: reg[2] ? reg[2] : 0, code: assembler.RegMap.map[reg[1]].code, mask: this.stringToMask(reg[3]) };
                pr.data.writeUnsignedShort(em.num);
                pr.data.writeUnsignedByte(em.mask);
                pr.data.writeUnsignedByte(em.code);

                //console.log ( "  Emit dest: ", em );
                return true;
            };

            AGALMiniAssembler.prototype.stringToMask = function (s) {
                if (!s)
                    return 0xf;
                var r = 0;
                if (s.indexOf("x") != -1)
                    r |= 1;
                if (s.indexOf("y") != -1)
                    r |= 2;
                if (s.indexOf("z") != -1)
                    r |= 4;
                if (s.indexOf("w") != -1)
                    r |= 8;
                return r;
            };

            AGALMiniAssembler.prototype.stringToSwizzle = function (s) {
                if (!s) {
                    return 0xe4;
                }
                var chartoindex = { x: 0, y: 1, z: 2, w: 3 };
                var sw = 0;

                if (s.charAt(0) != ".") {
                    throw "Missing . for swizzle";
                }

                if (s.length > 1) {
                    sw |= chartoindex[s.charAt(1)];
                }

                if (s.length > 2) {
                    sw |= chartoindex[s.charAt(2)] << 2;
                } else {
                    sw |= (sw & 3) << 2;
                }

                if (s.length > 3) {
                    sw |= chartoindex[s.charAt(3)] << 4;
                } else {
                    sw |= (sw & (3 << 2)) << 2;
                }

                if (s.length > 4) {
                    sw |= chartoindex[s.charAt(4)] << 6;
                } else {
                    sw |= (sw & (3 << 4)) << 2;
                }

                return sw;
            };

            AGALMiniAssembler.prototype.emitSampler = function (pr, token, opsrc, opts) {
                var reg = token.match(/fs(\d*)/i);
                if (!reg || !reg[1]) {
                    return false;
                }
                pr.data.writeUnsignedShort(parseInt(reg[1]));
                pr.data.writeUnsignedByte(0); // bias
                pr.data.writeUnsignedByte(0);

                /*
                pr.data.writeUnsignedByte ( 0x5 );
                pr.data.writeUnsignedByte ( 0 );   // readmode, dim
                pr.data.writeUnsignedByte ( 0 );   // special, wrap
                pr.data.writeUnsignedByte ( 0 );   // mip, filter
                */
                var samplerbits = 0x5;
                var sampleroptset = 0;
                for (var i = 0; i < opts.length; i++) {
                    var o = assembler.SamplerMap.map[opts[i].toLowerCase()];

                    //console.log( 'AGALMiniAssembler' , 'emitSampler' , 'SampleMap opt:' , o , '<-------- WATCH FOR THIS');
                    if (o) {
                        if (((sampleroptset >> o.shift) & o.mask) != 0) {
                            console.log("Warning, duplicate sampler option");
                        }
                        sampleroptset |= o.mask << o.shift;
                        samplerbits &= ~(o.mask << o.shift);
                        samplerbits |= o.value << o.shift;
                    } else {
                        console.log("Warning, unknown sampler option: ", opts[i]);
                        // todo bias
                    }
                }
                pr.data.writeUnsignedInt(samplerbits);
                return true;
            };

            AGALMiniAssembler.prototype.emitSource = function (pr, token, opsrc) {
                var indexed = token.match(/vc\[(v[tcai])(\d+)\.([xyzw])([\+\-]\d+)?\](\.[xyzw]{1,4})?/i);
                var reg;
                if (indexed) {
                    if (!assembler.RegMap.map[indexed[1]]) {
                        return false;
                    }
                    var selindex = { x: 0, y: 1, z: 2, w: 3 };
                    var em = { num: indexed[2] | 0, code: assembler.RegMap.map[indexed[1]].code, swizzle: this.stringToSwizzle(indexed[5]), select: selindex[indexed[3]], offset: indexed[4] | 0 };
                    pr.data.writeUnsignedShort(em.num);
                    pr.data.writeByte(em.offset);
                    pr.data.writeUnsignedByte(em.swizzle);
                    pr.data.writeUnsignedByte(0x1); // constant reg
                    pr.data.writeUnsignedByte(em.code);
                    pr.data.writeUnsignedByte(em.select);
                    pr.data.writeUnsignedByte(1 << 7);
                } else {
                    reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i); // g1: regname, g2:regnum, g3:swizzle
                    if (!assembler.RegMap.map[reg[1]]) {
                        return false;
                    }
                    var em = { num: reg[2] | 0, code: assembler.RegMap.map[reg[1]].code, swizzle: this.stringToSwizzle(reg[3]) };
                    pr.data.writeUnsignedShort(em.num);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(em.swizzle);
                    pr.data.writeUnsignedByte(em.code);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(0);
                    //console.log ( "  Emit source: ", em, pr.data.length );
                }
                return true;
            };

            AGALMiniAssembler.prototype.addHeader = function (partname, version) {
                if (!version) {
                    version = 1;
                }
                if (this.r[partname] == undefined) {
                    this.r[partname] = new aglsl.assembler.Part(partname, version);
                    this.emitHeader(this.r[partname]);
                } else if (this.r[partname].version != version) {
                    throw "Multiple versions for part " + partname;
                }
                this.cur = this.r[partname];
            };
            return AGALMiniAssembler;
        })();
        assembler.AGALMiniAssembler = AGALMiniAssembler;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGALTokenizer = (function () {
        function AGALTokenizer() {
        }
        AGALTokenizer.prototype.decribeAGALByteArray = function (bytes) {
            var header = new aglsl.Header();

            if (bytes.readUnsignedByte() != 0xa0) {
                throw "Bad AGAL: Missing 0xa0 magic byte.";
            }

            header.version = bytes.readUnsignedInt();
            if (header.version >= 0x10) {
                bytes.readUnsignedByte();
                header.version >>= 1;
            }
            if (bytes.readUnsignedByte() != 0xa1) {
                throw "Bad AGAL: Missing 0xa1 magic byte.";
            }

            header.progid = bytes.readUnsignedByte();
            switch (header.progid) {
                case 1:
                    header.type = "fragment";
                    break;
                case 0:
                    header.type = "vertex";
                    break;
                case 2:
                    header.type = "cpu";
                    break;
                default:
                    header.type = "";
                    break;
            }

            var desc = new aglsl.Description();
            var tokens = [];
            while (bytes.position < bytes.length) {
                var token = new aglsl.Token();

                token.opcode = bytes.readUnsignedInt();
                var lutentry = aglsl.Mapping.agal2glsllut[token.opcode];
                if (!lutentry) {
                    throw "Opcode not valid or not implemented yet: " + token.opcode;
                }
                if (lutentry.matrixheight) {
                    desc.hasmatrix = true;
                }
                if (lutentry.dest) {
                    token.dest.regnum = bytes.readUnsignedShort();
                    token.dest.mask = bytes.readUnsignedByte();
                    token.dest.regtype = bytes.readUnsignedByte();
                    desc.regwrite[token.dest.regtype][token.dest.regnum] |= token.dest.mask;
                } else {
                    token.dest = null;
                    bytes.readUnsignedInt();
                }
                if (lutentry.a) {
                    this.readReg(token.a, 1, desc, bytes);
                } else {
                    token.a = null;
                    bytes.readUnsignedInt();
                    bytes.readUnsignedInt();
                }
                if (lutentry.b) {
                    this.readReg(token.b, lutentry.matrixheight | 0, desc, bytes);
                } else {
                    token.b = null;
                    bytes.readUnsignedInt();
                    bytes.readUnsignedInt();
                }
                tokens.push(token);
            }
            desc.header = header;
            desc.tokens = tokens;

            return desc;
        };

        AGALTokenizer.prototype.readReg = function (s, mh, desc, bytes) {
            s.regnum = bytes.readUnsignedShort();
            s.indexoffset = bytes.readByte();
            s.swizzle = bytes.readUnsignedByte();
            s.regtype = bytes.readUnsignedByte();
            desc.regread[s.regtype][s.regnum] = 0xf; // sould be swizzle to mask? should be |=
            if (s.regtype == 0x5) {
                // sampler
                s.lodbiad = s.indexoffset;
                s.indexoffset = undefined;
                s.swizzle = undefined;

                // sampler
                s.readmode = bytes.readUnsignedByte();
                s.dim = s.readmode >> 4;
                s.readmode &= 0xf;
                s.special = bytes.readUnsignedByte();
                s.wrap = s.special >> 4;
                s.special &= 0xf;
                s.mipmap = bytes.readUnsignedByte();
                s.filter = s.mipmap >> 4;
                s.mipmap &= 0xf;
                desc.samplers[s.regnum] = s;
            } else {
                s.indexregtype = bytes.readUnsignedByte();
                s.indexselect = bytes.readUnsignedByte();
                s.indirectflag = bytes.readUnsignedByte();
            }
            if (s.indirectflag) {
                desc.hasindirect = true;
            }
            if (!s.indirectflag && mh) {
                for (var mhi = 0; mhi < mh; mhi++) {
                    desc.regread[s.regtype][s.regnum + mhi] = desc.regread[s.regtype][s.regnum];
                }
            }
        };
        return AGALTokenizer;
    })();
    aglsl.AGALTokenizer = AGALTokenizer;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGLSLParser = (function () {
        function AGLSLParser() {
        }
        AGLSLParser.prototype.parse = function (desc) {
            var header = "";
            var body = "";

            header += "precision highp float;\n";
            var tag = desc.header.type[0];

            // declare uniforms
            if (desc.header.type == "vertex") {
                header += "uniform float yflip;\n";
            }
            if (!desc.hasindirect) {
                for (var i = 0; i < desc.regread[0x1].length; i++) {
                    if (desc.regread[0x1][i]) {
                        header += "uniform vec4 " + tag + "c" + i + ";\n";
                    }
                }
            } else {
                header += "uniform vec4 " + tag + "carrr[" + aglsl.ContextGL.maxvertexconstants + "];\n"; // use max const count instead
            }

            for (var i = 0; i < desc.regread[0x2].length || i < desc.regwrite[0x2].length; i++) {
                if (desc.regread[0x2][i] || desc.regwrite[0x2][i]) {
                    header += "vec4 " + tag + "t" + i + ";\n";
                }
            }

            for (var i = 0; i < desc.regread[0x0].length; i++) {
                if (desc.regread[0x0][i]) {
                    header += "attribute vec4 va" + i + ";\n";
                }
            }

            for (var i = 0; i < desc.regread[0x4].length || i < desc.regwrite[0x4].length; i++) {
                if (desc.regread[0x4][i] || desc.regwrite[0x4][i]) {
                    header += "varying vec4 vi" + i + ";\n";
                }
            }

            // declare samplers
            var samptype = ["2D", "Cube", "3D", ""];
            for (var i = 0; i < desc.samplers.length; i++) {
                if (desc.samplers[i]) {
                    header += "uniform sampler" + samptype[desc.samplers[i].dim & 3] + " fs" + i + ";\n";
                }
            }

            // extra gl fluff: setup position and depth adjust temps
            if (desc.header.type == "vertex") {
                header += "vec4 outpos;\n";
            }
            if (desc.writedepth) {
                header += "vec4 tmp_FragDepth;\n";
            }

            //if ( desc.hasmatrix )
            //    header += "vec4 tmp_matrix;\n";
            // start body of code
            body += "void main() {\n";

            for (var i = 0; i < desc.tokens.length; i++) {
                var lutentry = aglsl.Mapping.agal2glsllut[desc.tokens[i].opcode];
                if (!lutentry) {
                    throw "Opcode not valid or not implemented yet: ";
                    /*+token.opcode;*/
                }
                var sublines = lutentry.matrixheight || 1;

                for (var sl = 0; sl < sublines; sl++) {
                    var line = "  " + lutentry.s;
                    if (desc.tokens[i].dest) {
                        if (lutentry.matrixheight) {
                            if (((desc.tokens[i].dest.mask >> sl) & 1) != 1) {
                                continue;
                            }
                            var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                            var destcaststring = "float";
                            var destmaskstring = ["x", "y", "z", "w"][sl];
                            destregstring += "." + destmaskstring;
                        } else {
                            var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                            var destcaststring;
                            var destmaskstring;
                            if (desc.tokens[i].dest.mask != 0xf) {
                                var ndest = 0;
                                destmaskstring = "";
                                if (desc.tokens[i].dest.mask & 1) {
                                    ndest++;
                                    destmaskstring += "x";
                                }
                                if (desc.tokens[i].dest.mask & 2) {
                                    ndest++;
                                    destmaskstring += "y";
                                }
                                if (desc.tokens[i].dest.mask & 4) {
                                    ndest++;
                                    destmaskstring += "z";
                                }
                                if (desc.tokens[i].dest.mask & 8) {
                                    ndest++;
                                    destmaskstring += "w";
                                }
                                destregstring += "." + destmaskstring;
                                switch (ndest) {
                                    case 1:
                                        destcaststring = "float";
                                        break;
                                    case 2:
                                        destcaststring = "vec2";
                                        break;
                                    case 3:
                                        destcaststring = "vec3";
                                        break;
                                    default:
                                        throw "Unexpected destination mask";
                                }
                            } else {
                                destcaststring = "vec4";
                                destmaskstring = "xyzw";
                            }
                        }
                        line = line.replace("%dest", destregstring);
                        line = line.replace("%cast", destcaststring);
                        line = line.replace("%dm", destmaskstring);
                    }
                    var dwm = 0xf;
                    if (!lutentry.ndwm && lutentry.dest && desc.tokens[i].dest) {
                        dwm = desc.tokens[i].dest.mask;
                    }
                    if (desc.tokens[i].a) {
                        line = line.replace("%a", this.sourcetostring(desc.tokens[i].a, 0, dwm, lutentry.scalar, desc, tag));
                    }
                    if (desc.tokens[i].b) {
                        line = line.replace("%b", this.sourcetostring(desc.tokens[i].b, sl, dwm, lutentry.scalar, desc, tag));
                        if (desc.tokens[i].b.regtype == 0x5) {
                            // sampler dim
                            var texdim = ["2D", "Cube", "3D"][desc.tokens[i].b.dim];
                            var texsize = ["vec2", "vec3", "vec3"][desc.tokens[i].b.dim];
                            line = line.replace("%texdim", texdim);
                            line = line.replace("%texsize", texsize);
                            var texlod = "";
                            line = line.replace("%lod", texlod);
                        }
                    }
                    body += line;
                }
            }

            // adjust z from opengl range of -1..1 to 0..1 as in d3d, this also enforces a left handed coordinate system
            if (desc.header.type == "vertex") {
                body += "  gl_Position = vec4(outpos.x, outpos.y, outpos.z*2.0 - outpos.w, outpos.w);\n";
            }

            // clamp fragment depth
            if (desc.writedepth) {
                body += "  gl_FragDepth = clamp(tmp_FragDepth,0.0,1.0);\n";
            }

            // close main
            body += "}\n";

            return header + body;
        };

        AGLSLParser.prototype.regtostring = function (regtype, regnum, desc, tag) {
            switch (regtype) {
                case 0x0:
                    return "va" + regnum;
                case 0x1:
                    if (desc.hasindirect && desc.header.type == "vertex") {
                        return "vcarrr[" + regnum + "]";
                    } else {
                        return tag + "c" + regnum;
                    }
                case 0x2:
                    return tag + "t" + regnum;
                case 0x3:
                    return desc.header.type == "vertex" ? "outpos" : "gl_FragColor";
                case 0x4:
                    return "vi" + regnum;
                case 0x5:
                    return "fs" + regnum;
                case 0x6:
                    return "tmp_FragDepth";
                default:
                    throw "Unknown register type";
            }
        };

        AGLSLParser.prototype.sourcetostring = function (s, subline, dwm, isscalar, desc, tag) {
            var swiz = ["x", "y", "z", "w"];
            var r;

            if (s.indirectflag) {
                r = "vcarrr[int(" + this.regtostring(s.indexregtype, s.regnum, desc, tag) + "." + swiz[s.indexselect] + ")";
                var realofs = subline + s.indexoffset;
                if (realofs < 0)
                    r += realofs.toString();
                if (realofs > 0)
                    r += "+" + realofs.toString();
                r += "]";
            } else {
                r = this.regtostring(s.regtype, s.regnum + subline, desc, tag);
            }

            // samplers never add swizzle
            if (s.regtype == 0x5) {
                return r;
            }

            // scalar, first component only
            if (isscalar) {
                return r + "." + swiz[(s.swizzle >> 0) & 3];
            }

            // identity
            if (s.swizzle == 0xe4 && dwm == 0xf) {
                return r;
            }

            // with destination write mask folded in
            r += ".";
            if (dwm & 1)
                r += swiz[(s.swizzle >> 0) & 3];
            if (dwm & 2)
                r += swiz[(s.swizzle >> 2) & 3];
            if (dwm & 4)
                r += swiz[(s.swizzle >> 4) & 3];
            if (dwm & 8)
                r += swiz[(s.swizzle >> 6) & 3];
            return r;
        };
        return AGLSLParser;
    })();
    aglsl.AGLSLParser = AGLSLParser;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGLSLCompiler = (function () {
        function AGLSLCompiler() {
        }
        AGLSLCompiler.prototype.compile = function (programType, source) {
            var agalMiniAssembler = new aglsl.assembler.AGALMiniAssembler();
            var tokenizer = new aglsl.AGALTokenizer();

            var data;
            var concatSource;
            switch (programType) {
                case "vertex":
                    concatSource = "part vertex 1\n" + source + "endpart";
                    agalMiniAssembler.assemble(concatSource);
                    data = agalMiniAssembler.r['vertex'].data;
                    break;
                case "fragment":
                    concatSource = "part fragment 1\n" + source + "endpart";
                    agalMiniAssembler.assemble(concatSource);
                    data = agalMiniAssembler.r['fragment'].data;
                    break;
                default:
                    throw "Unknown ContextGLProgramType";
            }

            var description = tokenizer.decribeAGALByteArray(data);

            var parser = new aglsl.AGLSLParser();
            this.glsl = parser.parse(description);

            return this.glsl;
        };
        return AGLSLCompiler;
    })();
    aglsl.AGLSLCompiler = AGLSLCompiler;
})(aglsl || (aglsl = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var ContextGLClearMask = (function () {
            function ContextGLClearMask() {
            }
            ContextGLClearMask.COLOR = 8 << 11;
            ContextGLClearMask.DEPTH = 8 << 5;
            ContextGLClearMask.STENCIL = 8 << 7;
            ContextGLClearMask.ALL = ContextGLClearMask.COLOR | ContextGLClearMask.DEPTH | ContextGLClearMask.STENCIL;
            return ContextGLClearMask;
        })();
        gl.ContextGLClearMask = ContextGLClearMask;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (_gl) {
        var VertexBuffer = (function () {
            function VertexBuffer(gl, numVertices, data32PerVertex) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
            }
            VertexBuffer.prototype.uploadFromArray = function (vertices, startVertex, numVertices) {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);

                //console.log( "** WARNING upload not fully implemented, startVertex & numVertices not considered." );
                // TODO add offsets , startVertex, numVertices * this._data32PerVertex
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
            };

            Object.defineProperty(VertexBuffer.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer.prototype, "data32PerVertex", {
                get: function () {
                    return this._data32PerVertex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });

            VertexBuffer.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };
            return VertexBuffer;
        })();
        _gl.VertexBuffer = VertexBuffer;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (_gl) {
        var IndexBuffer = (function () {
            function IndexBuffer(gl, numIndices) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numIndices = numIndices;
            }
            IndexBuffer.prototype.uploadFromArray = function (data, startOffset, count) {
                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);

                // TODO add index offsets
                this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this._gl.STATIC_DRAW);
            };

            IndexBuffer.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };

            Object.defineProperty(IndexBuffer.prototype, "numIndices", {
                get: function () {
                    return this._numIndices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IndexBuffer.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            return IndexBuffer;
        })();
        _gl.IndexBuffer = IndexBuffer;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (_gl) {
        var Program = (function () {
            function Program(gl) {
                this._gl = gl;
                this._program = this._gl.createProgram();
            }
            Program.prototype.upload = function (vertexProgram, fragmentProgram) {
                this._vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
                this._fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

                this._gl.shaderSource(this._vertexShader, vertexProgram);
                this._gl.compileShader(this._vertexShader);

                if (!this._gl.getShaderParameter(this._vertexShader, this._gl.COMPILE_STATUS)) {
                    alert(this._gl.getShaderInfoLog(this._vertexShader));
                    return null;
                }

                this._gl.shaderSource(this._fragmentShader, fragmentProgram);
                this._gl.compileShader(this._fragmentShader);

                if (!this._gl.getShaderParameter(this._fragmentShader, this._gl.COMPILE_STATUS)) {
                    alert(this._gl.getShaderInfoLog(this._fragmentShader));
                    return null;
                }

                this._gl.attachShader(this._program, this._vertexShader);
                this._gl.attachShader(this._program, this._fragmentShader);
                this._gl.linkProgram(this._program);

                if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
                    alert("Could not link the program."); //TODO throw errors
                }
            };

            Program.prototype.dispose = function () {
                this._gl.deleteProgram(this._program);
            };

            Program.prototype.focusProgram = function () {
                this._gl.useProgram(this._program);
            };

            Object.defineProperty(Program.prototype, "glProgram", {
                get: function () {
                    return this._program;
                },
                enumerable: true,
                configurable: true
            });
            return Program;
        })();
        _gl.Program = Program;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var SamplerState = (function () {
            function SamplerState() {
            }
            return SamplerState;
        })();
        gl.SamplerState = SamplerState;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLTextureFormat = (function () {
            function ContextGLTextureFormat() {
            }
            ContextGLTextureFormat.BGRA = "bgra";
            ContextGLTextureFormat.BGRA_PACKED = "bgraPacked4444";
            ContextGLTextureFormat.BGR_PACKED = "bgrPacked565";
            ContextGLTextureFormat.COMPRESSED = "compressed";
            ContextGLTextureFormat.COMPRESSED_ALPHA = "compressedAlpha";
            return ContextGLTextureFormat;
        })();
        gl.ContextGLTextureFormat = ContextGLTextureFormat;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (_gl) {
        var TextureBase = (function () {
            function TextureBase(gl) {
                this.textureType = "";
                this._gl = gl;
            }
            TextureBase.prototype.dispose = function () {
                throw "Abstract method must be overridden.";
            };

            Object.defineProperty(TextureBase.prototype, "glTexture", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });
            return TextureBase;
        })();
        _gl.TextureBase = TextureBase;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var away;
(function (away) {
    (function (_gl) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(gl, width, height) {
                _super.call(this, gl);
                this.textureType = "texture2d";
                this._width = width;
                this._height = height;

                this._glTexture = this._gl.createTexture();
            }
            Texture.prototype.dispose = function () {
                this._gl.deleteTexture(this._glTexture);
            };

            Object.defineProperty(Texture.prototype, "width", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Texture.prototype, "height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Texture.prototype, "frameBuffer", {
                get: function () {
                    return this._frameBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Texture.prototype.uploadFromData = function (data, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData)
                    data = data.imageData;

                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);
                this._gl.texImage2D(this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            };

            Texture.prototype.uploadCompressedTextureFromByteArray = function (data, byteArrayOffset /*uint*/ , async) {
                if (typeof async === "undefined") { async = false; }
                var ext = this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
                //this._gl.compressedTexImage2D(this._gl.TEXTURE_2D, 0, this)
            };

            Object.defineProperty(Texture.prototype, "glTexture", {
                get: function () {
                    return this._glTexture;
                },
                enumerable: true,
                configurable: true
            });

            Texture.prototype.generateFromRenderBuffer = function () {
                this._frameBuffer = this._gl.createFramebuffer();
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);
                this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._width, this._height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);

                var renderBuffer = this._gl.createRenderbuffer();
                this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, renderBuffer);
                this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);

                this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._glTexture, 0);
                this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, renderBuffer);

                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
                this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            };

            Texture.prototype.generateMipmaps = function () {
                //TODO: implement generating mipmaps
                //this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
                //this._gl.generateMipmap(this._gl.TEXTURE_2D);
                //this._gl.bindTexture( this._gl.TEXTURE_2D, null );
            };
            return Texture;
        })(_gl.TextureBase);
        _gl.Texture = Texture;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (_gl) {
        var CubeTexture = (function (_super) {
            __extends(CubeTexture, _super);
            function CubeTexture(gl, size) {
                _super.call(this, gl);
                this._textureSelectorDictionary = new Array(6);
                this.textureType = "textureCube";
                this._size = size;
                this._texture = this._gl.createTexture();

                this._textureSelectorDictionary[0] = gl.TEXTURE_CUBE_MAP_POSITIVE_X;
                this._textureSelectorDictionary[1] = gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
                this._textureSelectorDictionary[2] = gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
                this._textureSelectorDictionary[3] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
                this._textureSelectorDictionary[4] = gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
                this._textureSelectorDictionary[5] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
            }
            CubeTexture.prototype.dispose = function () {
                this._gl.deleteTexture(this._texture);
            };

            CubeTexture.prototype.uploadFromData = function (data, side, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData)
                    data = data.imageData;

                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                this._gl.texImage2D(this._textureSelectorDictionary[side], miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data);
                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
            };

            CubeTexture.prototype.uploadCompressedTextureFromByteArray = function (data, byteArrayOffset /*uint*/ , async) {
                if (typeof async === "undefined") { async = false; }
            };

            Object.defineProperty(CubeTexture.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CubeTexture.prototype, "glTexture", {
                get: function () {
                    return this._texture;
                },
                enumerable: true,
                configurable: true
            });
            return CubeTexture;
        })(_gl.TextureBase);
        _gl.CubeTexture = CubeTexture;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLTriangleFace = (function () {
            function ContextGLTriangleFace() {
            }
            ContextGLTriangleFace.BACK = "back";
            ContextGLTriangleFace.FRONT = "front";
            ContextGLTriangleFace.FRONT_AND_BACK = "frontAndBack";
            ContextGLTriangleFace.NONE = "none";
            return ContextGLTriangleFace;
        })();
        gl.ContextGLTriangleFace = ContextGLTriangleFace;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var ContextGLVertexBufferFormat = (function () {
            function ContextGLVertexBufferFormat() {
            }
            ContextGLVertexBufferFormat.BYTES_4 = "bytes4";
            ContextGLVertexBufferFormat.FLOAT_1 = "float1";
            ContextGLVertexBufferFormat.FLOAT_2 = "float2";
            ContextGLVertexBufferFormat.FLOAT_3 = "float3";
            ContextGLVertexBufferFormat.FLOAT_4 = "float4";
            return ContextGLVertexBufferFormat;
        })();
        gl.ContextGLVertexBufferFormat = ContextGLVertexBufferFormat;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var ContextGLProgramType = (function () {
            function ContextGLProgramType() {
            }
            ContextGLProgramType.FRAGMENT = "fragment";
            ContextGLProgramType.VERTEX = "vertex";
            return ContextGLProgramType;
        })();
        gl.ContextGLProgramType = ContextGLProgramType;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLBlendFactor = (function () {
            function ContextGLBlendFactor() {
            }
            ContextGLBlendFactor.DESTINATION_ALPHA = "destinationAlpha";
            ContextGLBlendFactor.DESTINATION_COLOR = "destinationColor";
            ContextGLBlendFactor.ONE = "one";
            ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA = "oneMinusDestinationAlpha";
            ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR = "oneMinusDestinationColor";
            ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA = "oneMinusSourceAlpha";
            ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR = "oneMinusSourceColor";
            ContextGLBlendFactor.SOURCE_ALPHA = "sourceAlpha";
            ContextGLBlendFactor.SOURCE_COLOR = "sourceColor";
            ContextGLBlendFactor.ZERO = "zero";
            return ContextGLBlendFactor;
        })();
        gl.ContextGLBlendFactor = ContextGLBlendFactor;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLCompareMode = (function () {
            function ContextGLCompareMode() {
            }
            ContextGLCompareMode.ALWAYS = "always";
            ContextGLCompareMode.EQUAL = "equal";
            ContextGLCompareMode.GREATER = "greater";
            ContextGLCompareMode.GREATER_EQUAL = "greaterEqual";
            ContextGLCompareMode.LESS = "less";
            ContextGLCompareMode.LESS_EQUAL = "lessEqual";
            ContextGLCompareMode.NEVER = "never";
            ContextGLCompareMode.NOT_EQUAL = "notEqual";
            return ContextGLCompareMode;
        })();
        gl.ContextGLCompareMode = ContextGLCompareMode;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLMipFilter = (function () {
            function ContextGLMipFilter() {
            }
            ContextGLMipFilter.MIPLINEAR = "miplinear";
            ContextGLMipFilter.MIPNEAREST = "mipnearest";
            ContextGLMipFilter.MIPNONE = "mipnone";
            return ContextGLMipFilter;
        })();
        gl.ContextGLMipFilter = ContextGLMipFilter;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLProfile = (function () {
            function ContextGLProfile() {
            }
            ContextGLProfile.BASELINE = "baseline";
            ContextGLProfile.BASELINE_CONSTRAINED = "baselineConstrained";
            ContextGLProfile.BASELINE_EXTENDED = "baselineExtended";
            return ContextGLProfile;
        })();
        gl.ContextGLProfile = ContextGLProfile;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLStencilAction = (function () {
            function ContextGLStencilAction() {
            }
            ContextGLStencilAction.DECREMENT_SATURATE = "decrementSaturate";
            ContextGLStencilAction.DECREMENT_WRAP = "decrementWrap";
            ContextGLStencilAction.INCREMENT_SATURATE = "incrementSaturate";
            ContextGLStencilAction.INCREMENT_WRAP = "incrementWrap";
            ContextGLStencilAction.INVERT = "invert";
            ContextGLStencilAction.KEEP = "keep";
            ContextGLStencilAction.SET = "set";
            ContextGLStencilAction.ZERO = "zero";
            return ContextGLStencilAction;
        })();
        gl.ContextGLStencilAction = ContextGLStencilAction;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (gl) {
        var ContextGLTextureFilter = (function () {
            function ContextGLTextureFilter() {
            }
            ContextGLTextureFilter.LINEAR = "linear";
            ContextGLTextureFilter.NEAREST = "nearest";
            return ContextGLTextureFilter;
        })();
        gl.ContextGLTextureFilter = ContextGLTextureFilter;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var ContextGLWrapMode = (function () {
            function ContextGLWrapMode() {
            }
            ContextGLWrapMode.CLAMP = "clamp";
            ContextGLWrapMode.REPEAT = "repeat";
            return ContextGLWrapMode;
        })();
        gl.ContextGLWrapMode = ContextGLWrapMode;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var ContextGL = (function () {
            function ContextGL(canvas) {
                this._blendFactorDictionary = new Object();
                this._depthTestDictionary = new Object();
                this._textureIndexDictionary = new Array(8);
                this._textureTypeDictionary = new Object();
                this._wrapDictionary = new Object();
                this._filterDictionary = new Object();
                this._mipmapFilterDictionary = new Object();
                this._uniformLocationNameDictionary = new Object();
                this._vertexBufferDimensionDictionary = new Object();
                this._indexBufferList = new Array();
                this._vertexBufferList = new Array();
                this._textureList = new Array();
                this._programList = new Array();
                this._samplerStates = new Array(8);
                try  {
                    this._gl = canvas.getContext("experimental-webgl", { premultipliedAlpha: false, alpha: false });

                    if (!this._gl)
                        this._gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: false });
                } catch (e) {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                }

                if (this._gl) {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
                    //setup shortcut dictionaries
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE] = this._gl.ONE;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.DESTINATION_ALPHA] = this._gl.DST_ALPHA;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.DESTINATION_COLOR] = this._gl.DST_COLOR;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE] = this._gl.ONE;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA] = this._gl.ONE_MINUS_DST_ALPHA;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR] = this._gl.ONE_MINUS_DST_COLOR;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA] = this._gl.ONE_MINUS_SRC_ALPHA;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR] = this._gl.ONE_MINUS_SRC_COLOR;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.SOURCE_ALPHA] = this._gl.SRC_ALPHA;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.SOURCE_COLOR] = this._gl.SRC_COLOR;
                    this._blendFactorDictionary[gl.ContextGLBlendFactor.ZERO] = this._gl.ZERO;

                    this._depthTestDictionary[gl.ContextGLCompareMode.ALWAYS] = this._gl.ALWAYS;
                    this._depthTestDictionary[gl.ContextGLCompareMode.EQUAL] = this._gl.EQUAL;
                    this._depthTestDictionary[gl.ContextGLCompareMode.GREATER] = this._gl.GREATER;
                    this._depthTestDictionary[gl.ContextGLCompareMode.GREATER_EQUAL] = this._gl.GEQUAL;
                    this._depthTestDictionary[gl.ContextGLCompareMode.LESS] = this._gl.LESS;
                    this._depthTestDictionary[gl.ContextGLCompareMode.LESS_EQUAL] = this._gl.LEQUAL;
                    this._depthTestDictionary[gl.ContextGLCompareMode.NEVER] = this._gl.NEVER;
                    this._depthTestDictionary[gl.ContextGLCompareMode.NOT_EQUAL] = this._gl.NOTEQUAL;

                    this._textureIndexDictionary[0] = this._gl.TEXTURE0;
                    this._textureIndexDictionary[1] = this._gl.TEXTURE1;
                    this._textureIndexDictionary[2] = this._gl.TEXTURE2;
                    this._textureIndexDictionary[3] = this._gl.TEXTURE3;
                    this._textureIndexDictionary[4] = this._gl.TEXTURE4;
                    this._textureIndexDictionary[5] = this._gl.TEXTURE5;
                    this._textureIndexDictionary[6] = this._gl.TEXTURE6;
                    this._textureIndexDictionary[7] = this._gl.TEXTURE7;

                    this._textureTypeDictionary["texture2d"] = this._gl.TEXTURE_2D;
                    this._textureTypeDictionary["textureCube"] = this._gl.TEXTURE_CUBE_MAP;

                    this._wrapDictionary[gl.ContextGLWrapMode.REPEAT] = this._gl.REPEAT;
                    this._wrapDictionary[gl.ContextGLWrapMode.CLAMP] = this._gl.CLAMP_TO_EDGE;

                    this._filterDictionary[gl.ContextGLTextureFilter.LINEAR] = this._gl.LINEAR;
                    this._filterDictionary[gl.ContextGLTextureFilter.NEAREST] = this._gl.NEAREST;

                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.LINEAR] = new Object();
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.LINEAR][gl.ContextGLMipFilter.MIPNEAREST] = this._gl.LINEAR_MIPMAP_NEAREST;
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.LINEAR][gl.ContextGLMipFilter.MIPLINEAR] = this._gl.LINEAR_MIPMAP_LINEAR;
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.LINEAR][gl.ContextGLMipFilter.MIPNONE] = this._gl.LINEAR;
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.NEAREST] = new Object();
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.NEAREST][gl.ContextGLMipFilter.MIPNEAREST] = this._gl.NEAREST_MIPMAP_NEAREST;
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.NEAREST][gl.ContextGLMipFilter.MIPLINEAR] = this._gl.NEAREST_MIPMAP_LINEAR;
                    this._mipmapFilterDictionary[gl.ContextGLTextureFilter.NEAREST][gl.ContextGLMipFilter.MIPNONE] = this._gl.NEAREST;

                    this._uniformLocationNameDictionary[gl.ContextGLProgramType.VERTEX] = "vc";
                    this._uniformLocationNameDictionary[gl.ContextGLProgramType.FRAGMENT] = "fc";

                    this._vertexBufferDimensionDictionary[gl.ContextGLVertexBufferFormat.FLOAT_1] = 1;
                    this._vertexBufferDimensionDictionary[gl.ContextGLVertexBufferFormat.FLOAT_2] = 2;
                    this._vertexBufferDimensionDictionary[gl.ContextGLVertexBufferFormat.FLOAT_3] = 3;
                    this._vertexBufferDimensionDictionary[gl.ContextGLVertexBufferFormat.FLOAT_4] = 4;
                    this._vertexBufferDimensionDictionary[gl.ContextGLVertexBufferFormat.BYTES_4] = 4;
                } else {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                    alert("WebGL is not available.");
                }

                for (var i = 0; i < ContextGL.MAX_SAMPLERS; ++i) {
                    this._samplerStates[i] = new gl.SamplerState();
                    this._samplerStates[i].wrap = this._gl.REPEAT;
                    this._samplerStates[i].filter = this._gl.LINEAR;
                    this._samplerStates[i].mipfilter = this._gl.LINEAR;
                }
            }
            ContextGL.prototype.gl = function () {
                return this._gl;
            };

            ContextGL.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = gl.ContextGLClearMask.ALL; }
                if (!this._drawing) {
                    this.updateBlendStatus();
                    this._drawing = true;
                }

                this._gl.clearColor(red, green, blue, alpha);
                this._gl.clearDepth(depth);
                this._gl.clearStencil(stencil);
                this._gl.clear(mask);
            };

            ContextGL.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                if (enableDepthAndStencil) {
                    this._gl.enable(this._gl.STENCIL_TEST);
                    this._gl.enable(this._gl.DEPTH_TEST);
                }

                this._gl.viewport['width'] = width;
                this._gl.viewport['height'] = height;

                this._gl.viewport(0, 0, width, height);
            };

            ContextGL.prototype.createCubeTexture = function (size, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                var texture = new gl.CubeTexture(this._gl, size);
                this._textureList.push(texture);
                return texture;
            };

            ContextGL.prototype.createIndexBuffer = function (numIndices) {
                var indexBuffer = new gl.IndexBuffer(this._gl, numIndices);
                this._indexBufferList.push(indexBuffer);
                return indexBuffer;
            };

            ContextGL.prototype.createProgram = function () {
                var program = new gl.Program(this._gl);
                this._programList.push(program);
                return program;
            };

            ContextGL.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                //TODO streaming
                var texture = new gl.Texture(this._gl, width, height);
                this._textureList.push(texture);
                return texture;
            };

            ContextGL.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                var vertexBuffer = new gl.VertexBuffer(this._gl, numVertices, data32PerVertex);
                this._vertexBufferList.push(vertexBuffer);
                return vertexBuffer;
            };

            ContextGL.prototype.dispose = function () {
                var i;
                for (i = 0; i < this._indexBufferList.length; ++i)
                    this._indexBufferList[i].dispose();

                this._indexBufferList = null;

                for (i = 0; i < this._vertexBufferList.length; ++i)
                    this._vertexBufferList[i].dispose();

                this._vertexBufferList = null;

                for (i = 0; i < this._textureList.length; ++i)
                    this._textureList[i].dispose();

                this._textureList = null;

                for (i = 0; i < this._programList.length; ++i)
                    this._programList[i].dispose();

                for (i = 0; i < this._samplerStates.length; ++i)
                    this._samplerStates[i] = null;

                this._programList = null;
            };

            ContextGL.prototype.drawToBitmapData = function (destination) {
                var arrayBuffer = new ArrayBuffer(destination.width * destination.height * 4);

                this._gl.readPixels(0, 0, destination.width, destination.height, this._gl.RGBA, this._gl.UNSIGNED_BYTE, new Uint8Array(arrayBuffer));

                var byteArray = new away.utils.ByteArray();
                byteArray.setArrayBuffer(arrayBuffer);

                destination.setPixels(new away.geom.Rectangle(0, 0, destination.width, destination.height), byteArray);
            };

            ContextGL.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                if (!this._drawing)
                    throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";

                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
                this._gl.drawElements(this._gl.TRIANGLES, (numTriangles == -1) ? indexBuffer.numIndices : numTriangles * 3, this._gl.UNSIGNED_SHORT, firstIndex);
            };

            ContextGL.prototype.present = function () {
                this._drawing = false;
            };

            ContextGL.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                this._blendEnabled = true;

                this._blendSourceFactor = this._blendFactorDictionary[sourceFactor];

                this._blendDestinationFactor = this._blendFactorDictionary[destinationFactor];

                this.updateBlendStatus();
            };

            ContextGL.prototype.setColorMask = function (red, green, blue, alpha) {
                this._gl.colorMask(red, green, blue, alpha);
            };

            ContextGL.prototype.setCulling = function (triangleFaceToCull, coordinateSystem) {
                if (typeof coordinateSystem === "undefined") { coordinateSystem = "leftHanded"; }
                if (triangleFaceToCull == gl.ContextGLTriangleFace.NONE) {
                    this._gl.disable(this._gl.CULL_FACE);
                } else {
                    this._gl.enable(this._gl.CULL_FACE);
                    switch (triangleFaceToCull) {
                        case gl.ContextGLTriangleFace.BACK:
                            this._gl.cullFace((coordinateSystem == "leftHanded") ? this._gl.FRONT : this._gl.BACK);
                            break;
                        case gl.ContextGLTriangleFace.FRONT:
                            this._gl.cullFace((coordinateSystem == "leftHanded") ? this._gl.BACK : this._gl.FRONT);
                            break;
                        case gl.ContextGLTriangleFace.FRONT_AND_BACK:
                            this._gl.cullFace(this._gl.FRONT_AND_BACK);
                            break;
                        default:
                            throw "Unknown ContextGLTriangleFace type.";
                    }
                }
            };

            // TODO ContextGLCompareMode
            ContextGL.prototype.setDepthTest = function (depthMask, passCompareMode) {
                this._gl.depthFunc(this._depthTestDictionary[passCompareMode]);

                this._gl.depthMask(depthMask);
            };

            ContextGL.prototype.setProgram = function (program) {
                //TODO decide on construction/reference resposibilities
                this._currentProgram = program;
                program.focusProgram();
            };

            ContextGL.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._currentProgram.glProgram, this._uniformLocationNameDictionary[programType]), !transposedMatrix, new Float32Array(matrix.rawData));
            };

            ContextGL.prototype.setProgramConstantsFromArray = function (programType, firstRegister, data, numRegisters) {
                if (typeof numRegisters === "undefined") { numRegisters = -1; }
                var locationName = this._uniformLocationNameDictionary[programType];
                var startIndex;
                for (var i = 0; i < numRegisters; i++) {
                    startIndex = i * 4;
                    this._gl.uniform4f(this._gl.getUniformLocation(this._currentProgram.glProgram, locationName + (firstRegister + i)), data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]);
                }
            };

            ContextGL.prototype.setScissorRectangle = function (rectangle) {
                if (!rectangle) {
                    this._gl.disable(this._gl.SCISSOR_TEST);
                    return;
                }

                this._gl.enable(this._gl.SCISSOR_TEST);
                this._gl.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            };

            ContextGL.prototype.setTextureAt = function (sampler, texture) {
                var samplerState = this._samplerStates[sampler];

                if (this._activeTexture != sampler && (texture || samplerState.type)) {
                    this._activeTexture = sampler;
                    this._gl.activeTexture(this._textureIndexDictionary[sampler]);
                }

                if (!texture) {
                    if (samplerState.type) {
                        this._gl.bindTexture(samplerState.type, null);
                        samplerState.type = null;
                    }

                    return;
                }

                var textureType = this._textureTypeDictionary[texture.textureType];
                samplerState.type = textureType;

                this._gl.bindTexture(textureType, texture.glTexture);

                this._gl.uniform1i(this._gl.getUniformLocation(this._currentProgram.glProgram, "fs" + sampler), sampler);

                this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, samplerState.wrap);
                this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, samplerState.wrap);

                this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, samplerState.filter);
                this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, samplerState.mipfilter);
            };

            ContextGL.prototype.setSamplerStateAt = function (sampler, wrap, filter, mipfilter) {
                if (0 <= sampler && sampler < ContextGL.MAX_SAMPLERS) {
                    this._samplerStates[sampler].wrap = this._wrapDictionary[wrap];
                    this._samplerStates[sampler].filter = this._filterDictionary[filter];
                    this._samplerStates[sampler].mipfilter = this._mipmapFilterDictionary[filter][mipfilter];
                } else {
                    throw "Sampler is out of bounds.";
                }
            };

            ContextGL.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                var location = this._currentProgram ? this._gl.getAttribLocation(this._currentProgram.glProgram, "va" + index) : -1;

                if (!buffer) {
                    if (location > -1)
                        this._gl.disableVertexAttribArray(location);

                    return;
                }

                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer.glBuffer);
                this._gl.enableVertexAttribArray(location);
                this._gl.vertexAttribPointer(location, this._vertexBufferDimensionDictionary[format], this._gl.FLOAT, false, buffer.data32PerVertex * 4, bufferOffset * 4);
            };

            ContextGL.prototype.setRenderToTexture = function (target, enableDepthAndStencil, antiAlias, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof antiAlias === "undefined") { antiAlias = 0; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                var texture = target;
                var frameBuffer = texture.frameBuffer;
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);

                if (enableDepthAndStencil) {
                    this._gl.enable(this._gl.STENCIL_TEST);
                    this._gl.enable(this._gl.DEPTH_TEST);
                }

                this._gl.viewport(0, 0, texture.width, texture.height);
            };

            ContextGL.prototype.setRenderToBackBuffer = function () {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            };

            ContextGL.prototype.updateBlendStatus = function () {
                if (this._blendEnabled) {
                    this._gl.enable(this._gl.BLEND);
                    this._gl.blendEquation(this._gl.FUNC_ADD);
                    this._gl.blendFunc(this._blendSourceFactor, this._blendDestinationFactor);
                } else {
                    this._gl.disable(this._gl.BLEND);
                }
            };
            ContextGL.MAX_SAMPLERS = 8;

            ContextGL.modulo = 0;
            return ContextGL;
        })();
        gl.ContextGL = ContextGL;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (gl) {
        var AGLSLContextGL = (function (_super) {
            __extends(AGLSLContextGL, _super);
            function AGLSLContextGL(canvas) {
                _super.call(this, canvas);
            }
            //@override
            AGLSLContextGL.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                //TODO remove special case for WebGL matrix calls?
                var d = matrix.rawData;
                if (transposedMatrix) {
                    this.setProgramConstantsFromArray(programType, firstRegister, [d[0], d[4], d[8], d[12]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 1, [d[1], d[5], d[9], d[13]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 2, [d[2], d[6], d[10], d[14]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 3, [d[3], d[7], d[11], d[15]], 1);
                } else {
                    this.setProgramConstantsFromArray(programType, firstRegister, [d[0], d[1], d[2], d[3]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 1, [d[4], d[5], d[6], d[7]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 2, [d[8], d[9], d[10], d[11]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 3, [d[12], d[13], d[14], d[15]], 1);
                }
            };
            return AGLSLContextGL;
        })(gl.ContextGL);
        gl.AGLSLContextGL = AGLSLContextGL;
    })(away.gl || (away.gl = {}));
    var gl = away.gl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (base) {
        /**
        * StageGL provides a proxy class to handle the creation and attachment of the ContextGL
        * (and in turn the back buffer) it uses. StageGL should never be created directly,
        * but requested through StageGLManager.
        *
        * @see away.managers.StageGLManager
        *
        * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
        * along with the context, instead of scattered throughout the framework
        */
        var StageGL = (function (_super) {
            __extends(StageGL, _super);
            function StageGL(canvas, stageGLIndex, stageGLManager, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                _super.call(this);
                this._x = 0;
                this._y = 0;
                //private static _frameEventDriver:Shape = new Shape(); // TODO: add frame driver / request animation frame
                this._iStageGLIndex = -1;
                this._antiAlias = 0;
                //private var _activeVertexBuffers : Vector.<VertexBuffer> = new Vector.<VertexBuffer>(8, true);
                //private var _activeTextures : Vector.<TextureBase> = new Vector.<TextureBase>(8, true);
                this._renderTarget = null;
                this._renderSurfaceSelector = 0;
                //private _mouse3DManager:away.managers.Mouse3DManager;
                //private _touch3DManager:Touch3DManager; //TODO: imeplement dependency Touch3DManager
                this._initialised = false;

                this._texturePool = new away.pool.TextureDataPool(this);

                this._canvas = canvas;

                this._iStageGLIndex = stageGLIndex;

                this._stageGLManager = stageGLManager;

                this._viewPort = new away.geom.Rectangle();

                this._enableDepthAndStencil = true;

                away.utils.CSS.setCanvasX(this._canvas, 0);
                away.utils.CSS.setCanvasY(this._canvas, 0);

                this.visible = true;
            }
            /**
            * Requests a ContextGL object to attach to the managed gl canvas.
            */
            StageGL.prototype.requestContext = function (aglslContext, forceSoftware, profile) {
                // If forcing software, we can be certain that the
                // returned ContextGL will be running software mode.
                // If not, we can't be sure and should stick to the
                // old value (will likely be same if re-requesting.)
                if (typeof aglslContext === "undefined") { aglslContext = false; }
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                if (this._usesSoftwareRendering != null)
                    this._usesSoftwareRendering = forceSoftware;

                this._profile = profile;

                try  {
                    if (aglslContext)
                        this._contextGL = new away.gl.AGLSLContextGL(this._canvas);
                    else
                        this._contextGL = new away.gl.ContextGL(this._canvas);
                } catch (e) {
                    this.dispatchEvent(new away.events.Event(away.events.Event.ERROR));
                }

                if (this._contextGL) {
                    // Only configure back buffer if width and height have been set,
                    // which they may not have been if View.render() has yet to be
                    // invoked for the first time.
                    if (this._width && this._height)
                        this._contextGL.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);

                    // Dispatch the appropriate event depending on whether context was
                    // created for the first time or recreated after a device loss.
                    this.dispatchEvent(new away.events.StageGLEvent(this._initialised ? away.events.StageGLEvent.CONTEXTGL_RECREATED : away.events.StageGLEvent.CONTEXTGL_CREATED));

                    this._initialised = true;
                }
            };


            Object.defineProperty(StageGL.prototype, "width", {
                get: function () {
                    return this._width;
                },
                /**
                * The width of the gl canvas
                */
                set: function (val) {
                    if (this._width == val)
                        return;

                    away.utils.CSS.setCanvasWidth(this._canvas, val);

                    this._width = this._viewPort.width = val;

                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "height", {
                get: function () {
                    return this._height;
                },
                /**
                * The height of the gl canvas
                */
                set: function (val) {
                    if (this._height == val)
                        return;

                    away.utils.CSS.setCanvasHeight(this._canvas, val);

                    this._height = this._viewPort.height = val;

                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "x", {
                get: function () {
                    return this._x;
                },
                /**
                * The x position of the gl canvas
                */
                set: function (val) {
                    if (this._x == val)
                        return;

                    away.utils.CSS.setCanvasX(this._canvas, val);

                    this._x = this._viewPort.x = val;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "y", {
                get: function () {
                    return this._y;
                },
                /**
                * The y position of the gl canvas
                */
                set: function (val) {
                    if (this._y == val)
                        return;

                    away.utils.CSS.setCanvasY(this._canvas, val);

                    this._y = this._viewPort.y = val;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "visible", {
                get: function () {
                    return away.utils.CSS.getCanvasVisibility(this._canvas);
                },
                set: function (val) {
                    away.utils.CSS.setCanvasVisibility(this._canvas, val);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "contextGL", {
                /**
                * The ContextGL object associated with the given gl canvas object.
                */
                get: function () {
                    return this._contextGL;
                },
                enumerable: true,
                configurable: true
            });

            StageGL.prototype.notifyViewportUpdated = function () {
                if (this._viewportDirty)
                    return;

                this._viewportDirty = true;

                //if (!this.hasEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED))
                //return;
                //if (!_viewportUpdated)
                this._viewportUpdated = new away.events.StageGLEvent(away.events.StageGLEvent.VIEWPORT_UPDATED);

                this.dispatchEvent(this._viewportUpdated);
            };

            StageGL.prototype.notifyEnterFrame = function () {
                //if (!hasEventListener(Event.ENTER_FRAME))
                //return;
                if (!this._enterFrame)
                    this._enterFrame = new away.events.Event(away.events.Event.ENTER_FRAME);

                this.dispatchEvent(this._enterFrame);
            };

            StageGL.prototype.notifyExitFrame = function () {
                //if (!hasEventListener(Event.EXIT_FRAME))
                //return;
                if (!this._exitFrame)
                    this._exitFrame = new away.events.Event(away.events.Event.EXIT_FRAME);

                this.dispatchEvent(this._exitFrame);
            };

            Object.defineProperty(StageGL.prototype, "profile", {
                get: function () {
                    return this._profile;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Disposes the StageGL object, freeing the ContextGL attached to the StageGL.
            */
            StageGL.prototype.dispose = function () {
                this._stageGLManager.iRemoveStageGL(this);
                this.freeContextGL();
                this._stageGLManager = null;
                this._iStageGLIndex = -1;
            };

            /**
            * Configures the back buffer associated with the StageGL object.
            * @param backBufferWidth The width of the backbuffer.
            * @param backBufferHeight The height of the backbuffer.
            * @param antiAlias The amount of anti-aliasing to use.
            * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
            */
            StageGL.prototype.configureBackBuffer = function (backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil) {
                this.width = backBufferWidth;
                this.height = backBufferHeight;

                this._antiAlias = antiAlias;
                this._enableDepthAndStencil = enableDepthAndStencil;

                if (this._contextGL)
                    this._contextGL.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil);
            };

            Object.defineProperty(StageGL.prototype, "enableDepthAndStencil", {
                /*
                * Indicates whether the depth and stencil buffer is used
                */
                get: function () {
                    return this._enableDepthAndStencil;
                },
                set: function (enableDepthAndStencil) {
                    this._enableDepthAndStencil = enableDepthAndStencil;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "renderTarget", {
                get: function () {
                    return this._renderTarget;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "renderSurfaceSelector", {
                get: function () {
                    return this._renderSurfaceSelector;
                },
                enumerable: true,
                configurable: true
            });

            StageGL.prototype.setRenderTarget = function (target, enableDepthAndStencil, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                if (this._renderTarget === target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil)
                    return;

                this._renderTarget = target;
                this._renderSurfaceSelector = surfaceSelector;
                this._enableDepthAndStencil = enableDepthAndStencil;
                if (target instanceof away.textures.RenderTexture) {
                    this._contextGL.setRenderToTexture(this.getRenderTexture(target), enableDepthAndStencil, this._antiAlias, surfaceSelector);
                } else {
                    this._contextGL.setRenderToBackBuffer();
                    this.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);
                }
            };

            StageGL.prototype.getRenderTexture = function (textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture) {
                    textureData.texture = this._contextGL.createTexture(textureProxy.width, textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, true);
                    textureData.invalid = true;
                }

                if (textureData.invalid) {
                    textureData.invalid = false;

                    // fake data, to complete texture for sampling
                    textureData.texture.generateFromRenderBuffer();
                }

                return textureData.texture;
            };

            /*
            * Clear and reset the back buffer when using a shared context
            */
            StageGL.prototype.clear = function () {
                if (!this._contextGL)
                    return;

                if (this._backBufferDirty) {
                    this.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);
                    this._backBufferDirty = false;
                }

                this._contextGL.clear((this._color & 0xff000000) >>> 24, (this._color & 0xff0000) >>> 16, (this._color & 0xff00) >>> 8, this._color & 0xff);

                this._bufferClear = true;
            };

            /*
            * Display the back rendering buffer
            */
            StageGL.prototype.present = function () {
                if (!this._contextGL)
                    return;

                this._contextGL.present();

                this._activeProgram = null;
                //if (this._mouse3DManager)
                //	this._mouse3DManager.fireMouseEvents();
            };

            /**
            * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event. Special case for enterframe and exitframe events - will switch StageGLProxy into automatic render mode.
            * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
            *
            * @param type The type of event.
            * @param listener The listener function that processes the event.
            * @param useCapture Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false.
            * @param priority The priority level of the event listener. The priority is designated by a signed 32-bit integer. The higher the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they are processed in the order in which they were added. The default priority is 0.
            * @param useWeakReference Determines whether the reference to the listener is strong or weak. A strong reference (the default) prevents your listener from being garbage-collected. A weak reference does not.
            */
            //public override function addEventListener(type:string, listener, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false)
            StageGL.prototype.addEventListener = function (type, listener) {
                _super.prototype.addEventListener.call(this, type, listener); //useCapture, priority, useWeakReference);
                //away.Debug.throwPIR( 'StageGLProxy' , 'addEventListener' ,  'EnterFrame, ExitFrame');
                //if ((type == away.events.Event.ENTER_FRAME || type == away.events.Event.EXIT_FRAME) ){//&& ! this._frameEventDriver.hasEventListener(Event.ENTER_FRAME)){
                //_frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);
                //}
                /* Original code
                if ((type == Event.ENTER_FRAME || type == Event.EXIT_FRAME) && ! _frameEventDriver.hasEventListener(Event.ENTER_FRAME)){
                
                _frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);
                
                
                }
                */
            };

            /**
            * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageGLProxy out of automatic render mode.
            * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
            *
            * @param type The type of event.
            * @param listener The listener object to remove.
            * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
            */
            StageGL.prototype.removeEventListener = function (type, listener) {
                _super.prototype.removeEventListener.call(this, type, listener);
                //away.Debug.throwPIR( 'StageGLProxy' , 'removeEventListener' ,  'EnterFrame, ExitFrame');
                /*
                // Remove the main rendering listener if no EnterFrame listeners remain
                if (    ! this.hasEventListener(away.events.Event.ENTER_FRAME , this.onEnterFrame , this )
                &&  ! this.hasEventListener(away.events.Event.EXIT_FRAME , this.onEnterFrame , this) ) //&& _frameEventDriver.hasEventListener(Event.ENTER_FRAME))
                {
                
                //_frameEventDriver.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame, this );
                
                }
                */
            };

            Object.defineProperty(StageGL.prototype, "scissorRect", {
                get: function () {
                    return this._scissorRect;
                },
                set: function (value) {
                    this._scissorRect = value;

                    this._contextGL.setScissorRectangle(this._scissorRect);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "stageGLIndex", {
                /**
                * The index of the StageGL which is managed by this instance of StageGLProxy.
                */
                get: function () {
                    return this._iStageGLIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "usesSoftwareRendering", {
                /**
                * Indicates whether the StageGL managed by this proxy is running in software mode.
                * Remember to wait for the CONTEXTGL_CREATED event before checking this property,
                * as only then will it be guaranteed to be accurate.
                */
                get: function () {
                    return this._usesSoftwareRendering;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "antiAlias", {
                /**
                * The antiAliasing of the StageGL.
                */
                get: function () {
                    return this._antiAlias;
                },
                set: function (antiAlias) {
                    this._antiAlias = antiAlias;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "viewPort", {
                /**
                * A viewPort rectangle equivalent of the StageGL size and position.
                */
                get: function () {
                    this._viewportDirty = false;

                    return this._viewPort;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "color", {
                /**
                * The background color of the StageGL.
                */
                get: function () {
                    return this._color;
                },
                set: function (color) {
                    this._color = color;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "bufferClear", {
                /**
                * The freshly cleared state of the backbuffer before any rendering
                */
                get: function () {
                    return this._bufferClear;
                },
                set: function (newBufferClear) {
                    this._bufferClear = newBufferClear;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * Assigns an attribute stream
            *
            * @param index The attribute stream index for the vertex shader
            * @param buffer
            * @param offset
            * @param stride
            * @param format
            */
            StageGL.prototype.activateBuffer = function (index, buffer, offset, format) {
                if (!buffer.stageGLs[this._iStageGLIndex])
                    buffer.stageGLs[this._iStageGLIndex] = this;

                if (!buffer.buffers[this._iStageGLIndex]) {
                    buffer.buffers[this._iStageGLIndex] = this._contextGL.createVertexBuffer(buffer.data.length / buffer.dataPerVertex, buffer.dataPerVertex);
                    buffer.invalid[this._iStageGLIndex] = true;
                }

                if (buffer.invalid[this._iStageGLIndex]) {
                    buffer.buffers[this._iStageGLIndex].uploadFromArray(buffer.data, 0, buffer.data.length / buffer.dataPerVertex);
                    buffer.invalid[this._iStageGLIndex] = false;
                }

                this._contextGL.setVertexBufferAt(index, buffer.buffers[this._iStageGLIndex], offset, format);
            };

            StageGL.prototype.disposeVertexData = function (buffer) {
                buffer.buffers[this._iStageGLIndex].dispose();
                buffer.buffers[this._iStageGLIndex] = null;
            };

            StageGL.prototype.activateRenderTexture = function (index, textureProxy) {
                this._contextGL.setTextureAt(index, this.getRenderTexture(textureProxy));
            };

            StageGL.prototype.activateTexture = function (index, textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture) {
                    textureData.texture = this._contextGL.createTexture(textureProxy.width, textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, true);
                    textureData.invalid = true;
                }

                if (textureData.invalid) {
                    textureData.invalid = false;
                    if (textureProxy.generateMipmaps) {
                        var mipmapData = textureProxy._iGetMipmapData();
                        var len = mipmapData.length;
                        for (var i = 0; i < len; i++)
                            textureData.texture.uploadFromData(mipmapData[i], i);
                    } else {
                        textureData.texture.uploadFromData(textureProxy._iGetTextureData(), 0);
                    }
                }

                this._contextGL.setTextureAt(index, textureData.texture);
            };

            StageGL.prototype.activateCubeTexture = function (index, textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture) {
                    textureData.texture = this._contextGL.createCubeTexture(textureProxy.size, away.gl.ContextGLTextureFormat.BGRA, false);
                    textureData.invalid = true;
                }

                if (textureData.invalid) {
                    textureData.invalid = false;
                    for (var i = 0; i < 6; ++i) {
                        if (textureProxy.generateMipmaps) {
                            var mipmapData = textureProxy._iGetMipmapData(i);
                            var len = mipmapData.length;
                            for (var j = 0; j < len; j++)
                                textureData.texture.uploadFromData(mipmapData[j], i, j);
                        } else {
                            textureData.texture.uploadFromData(textureProxy._iGetTextureData(i), i, 0);
                        }
                    }
                }

                this._contextGL.setTextureAt(index, textureData.texture);
            };

            /**
            * Retrieves the VertexBuffer object that contains triangle indices.
            * @param context The ContextGL for which we request the buffer
            * @return The VertexBuffer object that contains triangle indices.
            */
            StageGL.prototype.getIndexBuffer = function (buffer) {
                if (!buffer.stageGLs[this._iStageGLIndex])
                    buffer.stageGLs[this._iStageGLIndex] = this;

                if (!buffer.buffers[this._iStageGLIndex]) {
                    buffer.buffers[this._iStageGLIndex] = this._contextGL.createIndexBuffer(buffer.data.length / 3);
                    buffer.invalid[this._iStageGLIndex] = true;
                }

                if (buffer.invalid[this._iStageGLIndex]) {
                    buffer.buffers[this._iStageGLIndex].uploadFromArray(buffer.data, 0, buffer.data.length / 3);
                    buffer.invalid[this._iStageGLIndex] = false;
                }

                return buffer.buffers[this._iStageGLIndex];
            };

            StageGL.prototype.disposeIndexData = function (buffer) {
                buffer.buffers[this._iStageGLIndex].dispose();
                buffer.buffers[this._iStageGLIndex] = null;
            };

            /*
            * Access to fire mouseevents across multiple layered view3D instances
            */
            //		public get mouse3DManager():Mouse3DManager
            //		{
            //			return this._mouse3DManager;
            //		}
            //
            //		public set mouse3DManager(value:Mouse3DManager)
            //		{
            //			this._mouse3DManager = value;
            //		}
            /* TODO: implement dependency Touch3DManager
            public get touch3DManager():Touch3DManager
            {
            return _touch3DManager;
            }
            
            public set touch3DManager(value:Touch3DManager)
            {
            _touch3DManager = value;
            }
            */
            /**
            * Frees the ContextGL associated with this StageGLProxy.
            */
            StageGL.prototype.freeContextGL = function () {
                if (this._contextGL) {
                    this._contextGL.dispose();

                    this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
                }

                this._contextGL = null;

                this._initialised = false;
            };

            /**
            * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
            * Typically the proxy.ENTER_FRAME listener would render the layers for this StageGL instance.
            */
            StageGL.prototype.onEnterFrame = function (event) {
                if (!this._contextGL)
                    return;

                // Clear the stageGL instance
                this.clear();

                //notify the enterframe listeners
                this.notifyEnterFrame();

                // Call the present() to render the frame
                this.present();

                //notify the exitframe listeners
                this.notifyExitFrame();
            };

            StageGL.prototype.recoverFromDisposal = function () {
                if (!this._contextGL)
                    return false;

                //away.Debug.throwPIR( 'StageGLProxy' , 'recoverFromDisposal' , '' );
                /*
                if (this._iContextGL.driverInfo == "Disposed")
                {
                this._iContextGL = null;
                this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
                return false;
                
                }
                */
                return true;
            };

            StageGL.prototype.clearDepthBuffer = function () {
                if (!this._contextGL)
                    return;

                this._contextGL.clear(0, 0, 0, 1, 1, 0, away.gl.ContextGLClearMask.DEPTH);
            };
            return StageGL;
        })(away.events.EventDispatcher);
        base.StageGL = StageGL;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.base
    */
    (function (pool) {
        /**
        *
        */
        var IndexData = (function () {
            function IndexData(level) {
                this._dataDirty = true;
                this.invalid = new Array(8);
                this.stageGLs = new Array(8);
                this.buffers = new Array(8);
                this.level = level;
            }
            IndexData.prototype.updateData = function (offset, indices, numVertices) {
                if (this._dataDirty) {
                    this._dataDirty = false;

                    if (indices.length < IndexData.LIMIT_INDICES && numVertices < IndexData.LIMIT_VERTS) {
                        //shortcut for those buffers that fit into the maximum buffer sizes
                        this.indexMappings = null;
                        this.originalIndices = null;
                        this.setData(indices);
                        this.offset = indices.length;
                    } else {
                        var i;
                        var len;
                        var outIndex;
                        var j;
                        var k;
                        var splitIndices = new Array();

                        this.indexMappings = new Array(indices.length);
                        this.originalIndices = new Array();

                        i = this.indexMappings.length;

                        while (i--)
                            this.indexMappings[i] = -1;

                        var originalIndex;
                        var splitIndex;

                        // Loop over all triangles
                        outIndex = 0;
                        len = indices.length;
                        i = offset;
                        k = 0;
                        while (i < len && outIndex + 3 < IndexData.LIMIT_INDICES && k + 3 < IndexData.LIMIT_VERTS) {
                            for (j = 0; j < 3; j++) {
                                originalIndex = indices[i + j];

                                if (this.indexMappings[originalIndex] >= 0) {
                                    splitIndex = this.indexMappings[originalIndex];
                                } else {
                                    // This vertex does not yet exist in the split list and
                                    // needs to be copied from the long list.
                                    splitIndex = k++;
                                    this.indexMappings[originalIndex] = splitIndex;
                                    this.originalIndices.push(originalIndex);
                                }

                                // Store new index, which may have come from the mapping look-up,
                                // or from copying a new set of vertex data from the original vector
                                splitIndices[outIndex + j] = splitIndex;
                            }

                            outIndex += 3;
                            i += 3;
                        }

                        this.setData(splitIndices);
                        this.offset = i;
                    }
                }
            };

            IndexData.prototype.invalidateData = function () {
                this._dataDirty = true;
            };

            IndexData.prototype.dispose = function () {
                for (var i = 0; i < 8; ++i) {
                    if (this.stageGLs[i]) {
                        this.stageGLs[i].disposeIndexData(this);
                        this.stageGLs[i] = null;
                    }
                }
            };

            /**
            * @private
            */
            IndexData.prototype.disposeBuffers = function () {
                for (var i = 0; i < 8; ++i) {
                    if (this.buffers[i]) {
                        this.buffers[i].dispose();
                        this.buffers[i] = null;
                    }
                }
            };

            /**
            * @private
            */
            IndexData.prototype.invalidateBuffers = function () {
                for (var i = 0; i < 8; ++i)
                    this.invalid[i] = true;
            };

            /**
            *
            * @param data
            * @private
            */
            IndexData.prototype.setData = function (data) {
                if (this.data && this.data.length != data.length)
                    this.disposeBuffers();
                else
                    this.invalidateBuffers();

                this.data = data;
            };
            IndexData.LIMIT_VERTS = 0xffff;

            IndexData.LIMIT_INDICES = 0xffffff;
            return IndexData;
        })();
        pool.IndexData = IndexData;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.base
    */
    (function (pool) {
        /**
        *
        */
        var IndexDataPool = (function () {
            function IndexDataPool() {
            }
            IndexDataPool.getItem = function (subGeometry, level, indexOffset) {
                var subGeometryData = (IndexDataPool._pool[subGeometry.id] || (IndexDataPool._pool[subGeometry.id] = new Array()));

                var indexData = subGeometryData[level] || (subGeometryData[level] = new pool.IndexData(level));
                indexData.updateData(indexOffset, subGeometry.indices, subGeometry.numVertices);

                return indexData;
            };

            IndexDataPool.disposeItem = function (id, level) {
                var subGeometryData = this._pool[id];

                subGeometryData[level].dispose();
                subGeometryData[level] = null;
            };

            IndexDataPool.prototype.disposeData = function (id) {
                var subGeometryData = IndexDataPool._pool[id];

                var len = subGeometryData.length;
                for (var i = 0; i < len; i++) {
                    subGeometryData[i].dispose();
                    subGeometryData[i] = null;
                }

                IndexDataPool._pool[id] = null;
            };
            IndexDataPool._pool = new Object();
            return IndexDataPool;
        })();
        pool.IndexDataPool = IndexDataPool;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.pool
    */
    (function (pool) {
        /**
        *
        * @class away.pool.TextureDataBase
        */
        var TextureData = (function () {
            function TextureData(stageGL, textureProxy) {
                this.stageGL = stageGL;
                this.textureProxy = textureProxy;
            }
            /**
            *
            */
            TextureData.prototype.dispose = function () {
                this.texture.dispose();
                this.texture = null;
            };

            /**
            *
            */
            TextureData.prototype.invalidate = function () {
                this.invalid = true;
            };
            return TextureData;
        })();
        pool.TextureData = TextureData;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.pool
    */
    (function (pool) {
        /**
        * @class away.pool.TextureDataPool
        */
        var TextureDataPool = (function () {
            /**
            * //TODO
            *
            * @param textureDataClass
            */
            function TextureDataPool(stage) {
                this._pool = new Object();
                this._stage = stage;
            }
            /**
            * //TODO
            *
            * @param materialOwner
            * @returns ITexture
            */
            TextureDataPool.prototype.getItem = function (textureProxy) {
                return (this._pool[textureProxy.id] || (this._pool[textureProxy.id] = textureProxy._iAddTextureData(new pool.TextureData(this._stage, textureProxy))));
            };

            /**
            * //TODO
            *
            * @param materialOwner
            */
            TextureDataPool.prototype.disposeItem = function (textureProxy) {
                textureProxy._iRemoveTextureData(this._pool[textureProxy.id]);

                this._pool[textureProxy.id] = null;
            };
            return TextureDataPool;
        })();
        pool.TextureDataPool = TextureDataPool;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.base
    */
    (function (pool) {
        var SubGeometryBase = away.base.SubGeometryBase;

        var SubGeometryEvent = away.events.SubGeometryEvent;

        /**
        *
        */
        var VertexData = (function () {
            function VertexData(subGeometry, dataType) {
                var _this = this;
                this._dataDirty = true;
                this.invalid = new Array(8);
                this.buffers = new Array(8);
                this.stageGLs = new Array(8);
                this._subGeometry = subGeometry;
                this._dataType = dataType;

                this._onVerticesUpdatedDelegate = function (event) {
                    return _this._onVerticesUpdated(event);
                };
                this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
            }
            VertexData.prototype.updateData = function (originalIndices, indexMappings) {
                if (typeof originalIndices === "undefined") { originalIndices = null; }
                if (typeof indexMappings === "undefined") { indexMappings = null; }
                if (this._dataDirty) {
                    this._dataDirty = false;

                    this.dataPerVertex = this._subGeometry.getStride(this._dataType);

                    var vertices = this._subGeometry[this._dataType];

                    if (indexMappings == null) {
                        this.setData(vertices);
                    } else {
                        var splitVerts = new Array(originalIndices.length * this.dataPerVertex);
                        var originalIndex;
                        var splitIndex;
                        var i = 0;
                        var j = 0;
                        while (i < originalIndices.length) {
                            originalIndex = originalIndices[i];

                            splitIndex = indexMappings[originalIndex] * this.dataPerVertex;
                            originalIndex *= this.dataPerVertex;

                            for (j = 0; j < this.dataPerVertex; j++)
                                splitVerts[splitIndex + j] = vertices[originalIndex + j];

                            i++;
                        }

                        this.setData(splitVerts);
                    }
                }
            };

            VertexData.prototype.dispose = function () {
                for (var i = 0; i < 8; ++i) {
                    if (this.stageGLs[i]) {
                        this.stageGLs[i].disposeVertexData(this);
                        this.stageGLs[i] = null;
                    }
                }
            };

            /**
            * @private
            */
            VertexData.prototype.disposeBuffers = function () {
                for (var i = 0; i < 8; ++i) {
                    if (this.buffers[i]) {
                        this.buffers[i].dispose();
                        this.buffers[i] = null;
                    }
                }
            };

            /**
            * @private
            */
            VertexData.prototype.invalidateBuffers = function () {
                for (var i = 0; i < 8; ++i)
                    this.invalid[i] = true;
            };

            /**
            *
            * @param data
            * @param dataPerVertex
            * @private
            */
            VertexData.prototype.setData = function (data) {
                if (this.data && this.data.length != data.length)
                    this.disposeBuffers();
                else
                    this.invalidateBuffers();

                this.data = data;
            };

            /**
            * //TODO
            *
            * @param event
            * @private
            */
            VertexData.prototype._onVerticesUpdated = function (event) {
                var dataType = this._subGeometry.concatenateArrays ? SubGeometryBase.VERTEX_DATA : event.dataType;

                if (dataType == this._dataType)
                    this._dataDirty = true;
            };
            return VertexData;
        })();
        pool.VertexData = VertexData;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.base
    */
    (function (pool) {
        var SubGeometryBase = away.base.SubGeometryBase;

        /**
        *
        */
        var VertexDataPool = (function () {
            function VertexDataPool() {
            }
            VertexDataPool.getItem = function (subGeometry, indexData, dataType) {
                if (subGeometry.concatenateArrays)
                    dataType = SubGeometryBase.VERTEX_DATA;

                var subGeometryDictionary = (VertexDataPool._pool[subGeometry.id] || (VertexDataPool._pool[subGeometry.id] = new Object()));
                var subGeometryData = (subGeometryDictionary[dataType] || (subGeometryDictionary[dataType] = new Array()));

                var vertexData = subGeometryData[indexData.level] || (subGeometryData[indexData.level] = new pool.VertexData(subGeometry, dataType));
                vertexData.updateData(indexData.originalIndices, indexData.indexMappings);

                return vertexData;
            };

            VertexDataPool.disposeItem = function (subGeometry, level, dataType) {
                var subGeometryDictionary = VertexDataPool._pool[subGeometry.id];
                var subGeometryData = subGeometryDictionary[dataType];

                subGeometryData[level].dispose();
                subGeometryData[level] = null;
            };

            VertexDataPool.prototype.disposeData = function (subGeometry) {
                var subGeometryDictionary = VertexDataPool._pool[subGeometry.id];

                for (var key in subGeometryDictionary) {
                    var subGeometryData = subGeometryDictionary[key];

                    var len = subGeometryData.length;
                    for (var i = 0; i < len; i++) {
                        subGeometryData[i].dispose();
                        subGeometryData[i] = null;
                    }
                }

                VertexDataPool._pool[subGeometry.id] = null;
            };
            VertexDataPool._pool = new Object();
            return VertexDataPool;
        })();
        pool.VertexDataPool = VertexDataPool;
    })(away.pool || (away.pool = {}));
    var pool = away.pool;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        var StageGLEvent = away.events.StageGLEvent;

        var AGALProgramCache = (function () {
            function AGALProgramCache(stageGL, agalProgramCacheSingletonEnforcer) {
                if (!agalProgramCacheSingletonEnforcer)
                    throw new Error("This class is a multiton and cannot be instantiated manually. Use StageGLManager.getInstance instead.");

                this._stageGL = stageGL;

                this._program3Ds = new Object();
                this._ids = new Object();
                this._usages = new Object();
                this._keys = new Object();
            }
            AGALProgramCache.getInstance = function (stageGL) {
                var index = stageGL._iStageGLIndex;

                if (AGALProgramCache._instances == null)
                    AGALProgramCache._instances = new Array(8);

                if (!AGALProgramCache._instances[index]) {
                    AGALProgramCache._instances[index] = new AGALProgramCache(stageGL, new AGALProgramCacheSingletonEnforcer());

                    stageGL.addEventListener(StageGLEvent.CONTEXTGL_DISPOSED, AGALProgramCache.onContextGLDisposed);
                    stageGL.addEventListener(StageGLEvent.CONTEXTGL_CREATED, AGALProgramCache.onContextGLDisposed);
                    stageGL.addEventListener(StageGLEvent.CONTEXTGL_RECREATED, AGALProgramCache.onContextGLDisposed);
                }

                return AGALProgramCache._instances[index];
            };

            AGALProgramCache.getInstanceFromIndex = function (index) {
                if (!AGALProgramCache._instances[index])
                    throw new Error("Instance not created yet!");

                return AGALProgramCache._instances[index];
            };

            AGALProgramCache.onContextGLDisposed = function (event) {
                var stageGL = event.target;

                var index = stageGL._iStageGLIndex;

                AGALProgramCache._instances[index].dispose();
                AGALProgramCache._instances[index] = null;

                stageGL.removeEventListener(StageGLEvent.CONTEXTGL_DISPOSED, AGALProgramCache.onContextGLDisposed);
                stageGL.removeEventListener(StageGLEvent.CONTEXTGL_CREATED, AGALProgramCache.onContextGLDisposed);
                stageGL.removeEventListener(StageGLEvent.CONTEXTGL_RECREATED, AGALProgramCache.onContextGLDisposed);
            };

            AGALProgramCache.prototype.dispose = function () {
                for (var key in this._program3Ds)
                    this.destroyProgram(key);

                this._keys = null;
                this._program3Ds = null;
                this._usages = null;
            };

            AGALProgramCache.prototype.setProgram = function (programIds, programs, vertexCode, fragmentCode) {
                //TODO move program id arrays into stagegl
                var stageIndex = this._stageGL._iStageGLIndex;
                var program;
                var key = this.getKey(vertexCode, fragmentCode);

                if (this._program3Ds[key] == null) {
                    this._keys[AGALProgramCache._currentId] = key;
                    this._usages[AGALProgramCache._currentId] = 0;
                    this._ids[key] = AGALProgramCache._currentId;
                    ++AGALProgramCache._currentId;

                    program = this._stageGL.contextGL.createProgram();

                    //away.Debug.throwPIR( 'AGALProgramCache' , 'setProgram' , 'Dependency: AGALMiniAssembler.assemble');
                    //TODO: implement AGAL <> GLSL
                    //var vertexByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.VERTEX, vertexCode);
                    //var fragmentByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.FRAGMENT, fragmentCode);
                    //program.upload(vertexByteCode, fragmentByteCode);
                    /*
                    var vertexByteCode  : ByteArray = new AGLSLCompiler().assemble( ContextGLProgramType.VERTEX , vertexCode );
                    var fragmentByteCode: ByteArray = new AGLSLCompiler().assemble( ContextGLProgramType.FRAGMENT , fragmentCode );
                    
                    program.uploadGLSL(vertexByteCode, fragmentByteCode);
                    
                    */
                    var vertCompiler = new aglsl.AGLSLCompiler();
                    var fragCompiler = new aglsl.AGLSLCompiler();

                    var vertString = vertCompiler.compile(away.gl.ContextGLProgramType.VERTEX, vertexCode);
                    var fragString = fragCompiler.compile(away.gl.ContextGLProgramType.FRAGMENT, fragmentCode);

                    console.log('===GLSL=========================================================');
                    console.log('vertString');
                    console.log(vertString);
                    console.log('fragString');
                    console.log(fragString);

                    console.log('===AGAL=========================================================');
                    console.log('vertexCode');
                    console.log(vertexCode);
                    console.log('fragmentCode');
                    console.log(fragmentCode);

                    program.upload(vertString, fragString);

                    /*
                    
                    var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
                    var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
                    
                    var vertString : string = vertCompiler.compile( away.gl.ContextGLProgramType.VERTEX, this.pGetVertexCode() );
                    var fragString : string = fragCompiler.compile( away.gl.ContextGLProgramType.FRAGMENT, this.pGetFragmentCode() );
                    
                    this._program3D.upload( vertString , fragString );
                    
                    */
                    this._program3Ds[key] = program;
                }

                var oldId = programIds[stageIndex];
                var newId = this._ids[key];

                if (oldId != newId) {
                    if (oldId >= 0)
                        this.freeProgram(oldId);

                    this._usages[newId]++;
                }

                programIds[stageIndex] = newId;
                programs[stageIndex] = this._program3Ds[key];
            };

            AGALProgramCache.prototype.freeProgram = function (programId) {
                this._usages[programId]--;

                if (this._usages[programId] == 0)
                    this.destroyProgram(this._keys[programId]);
            };

            AGALProgramCache.prototype.destroyProgram = function (key) {
                this._program3Ds[key].dispose();
                this._program3Ds[key] = null;

                delete this._program3Ds[key];

                this._ids[key] = -1;
            };

            AGALProgramCache.prototype.getKey = function (vertexCode, fragmentCode) {
                return vertexCode + "---" + fragmentCode;
            };
            AGALProgramCache._currentId = 0;
            return AGALProgramCache;
        })();
        managers.AGALProgramCache = AGALProgramCache;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var AGALProgramCacheSingletonEnforcer = (function () {
    function AGALProgramCacheSingletonEnforcer() {
    }
    return AGALProgramCacheSingletonEnforcer;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        var RTTBufferManager = (function (_super) {
            __extends(RTTBufferManager, _super);
            function RTTBufferManager(se, stageGL) {
                _super.call(this);
                this._viewWidth = -1;
                this._viewHeight = -1;
                this._textureWidth = -1;
                this._textureHeight = -1;
                this._buffersInvalid = true;

                if (!se)
                    throw new Error("No cheating the multiton!");

                this._renderToTextureRect = new away.geom.Rectangle();

                this._stageGL = stageGL;
            }
            RTTBufferManager.getInstance = function (stageGL) {
                if (!stageGL)
                    throw new Error("stageGL key cannot be null!");

                if (RTTBufferManager._instances == null)
                    RTTBufferManager._instances = new Array();

                var rttBufferManager = RTTBufferManager.getRTTBufferManagerFromStageGL(stageGL);

                if (rttBufferManager == null) {
                    rttBufferManager = new RTTBufferManager(new SingletonEnforcer(), stageGL);

                    var vo = new RTTBufferManagerVO();

                    vo.stage3d = stageGL;
                    vo.rttbfm = rttBufferManager;

                    RTTBufferManager._instances.push(vo);
                }

                return rttBufferManager;
            };

            RTTBufferManager.getRTTBufferManagerFromStageGL = function (stageGL) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3d === stageGL)
                        return r.rttbfm;
                }

                return null;
            };

            RTTBufferManager.deleteRTTBufferManager = function (stageGL) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3d === stageGL) {
                        RTTBufferManager._instances.splice(c, 1);
                        return;
                    }
                }
            };

            Object.defineProperty(RTTBufferManager.prototype, "textureRatioX", {
                get: function () {
                    if (this._buffersInvalid)
                        this.updateRTTBuffers();

                    return this._textureRatioX;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureRatioY", {
                get: function () {
                    if (this._buffersInvalid)
                        this.updateRTTBuffers();

                    return this._textureRatioY;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "viewWidth", {
                get: function () {
                    return this._viewWidth;
                },
                set: function (value) {
                    if (value == this._viewWidth)
                        return;

                    this._viewWidth = value;

                    this._buffersInvalid = true;

                    this._textureWidth = away.utils.TextureUtils.getBestPowerOf2(this._viewWidth);

                    if (this._textureWidth > this._viewWidth) {
                        this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                        this._renderToTextureRect.width = this._viewWidth;
                    } else {
                        this._renderToTextureRect.x = 0;
                        this._renderToTextureRect.width = this._textureWidth;
                    }

                    this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RTTBufferManager.prototype, "viewHeight", {
                get: function () {
                    return this._viewHeight;
                },
                set: function (value) {
                    if (value == this._viewHeight)
                        return;

                    this._viewHeight = value;

                    this._buffersInvalid = true;

                    this._textureHeight = away.utils.TextureUtils.getBestPowerOf2(this._viewHeight);

                    if (this._textureHeight > this._viewHeight) {
                        this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                        this._renderToTextureRect.height = this._viewHeight;
                    } else {
                        this._renderToTextureRect.y = 0;
                        this._renderToTextureRect.height = this._textureHeight;
                    }

                    this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RTTBufferManager.prototype, "renderToTextureVertexBuffer", {
                get: function () {
                    if (this._buffersInvalid)
                        this.updateRTTBuffers();

                    return this._renderToTextureVertexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "renderToScreenVertexBuffer", {
                get: function () {
                    if (this._buffersInvalid)
                        this.updateRTTBuffers();

                    return this._renderToScreenVertexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "indexBuffer", {
                get: function () {
                    return this._indexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "renderToTextureRect", {
                get: function () {
                    if (this._buffersInvalid)
                        this.updateRTTBuffers();

                    return this._renderToTextureRect;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureWidth", {
                get: function () {
                    return this._textureWidth;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureHeight", {
                get: function () {
                    return this._textureHeight;
                },
                enumerable: true,
                configurable: true
            });

            RTTBufferManager.prototype.dispose = function () {
                RTTBufferManager.deleteRTTBufferManager(this._stageGL);

                if (this._indexBuffer) {
                    this._indexBuffer.dispose();
                    this._renderToScreenVertexBuffer.dispose();
                    this._renderToTextureVertexBuffer.dispose();
                    this._renderToScreenVertexBuffer = null;
                    this._renderToTextureVertexBuffer = null;
                    this._indexBuffer = null;
                }
            };

            // todo: place all this in a separate model, since it's used all over the place
            // maybe it even has a place in the core (together with screenRect etc)?
            // needs to be stored per view of course
            RTTBufferManager.prototype.updateRTTBuffers = function () {
                var context = this._stageGL.contextGL;
                var textureVerts;
                var screenVerts;

                var x;
                var y;

                if (this._renderToTextureVertexBuffer == null)
                    this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 5);

                if (this._renderToScreenVertexBuffer == null)
                    this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 5);

                if (!this._indexBuffer) {
                    this._indexBuffer = context.createIndexBuffer(6);

                    this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
                }

                this._textureRatioX = x = Math.min(this._viewWidth / this._textureWidth, 1);
                this._textureRatioY = y = Math.min(this._viewHeight / this._textureHeight, 1);

                var u1 = (1 - x) * .5;
                var u2 = (x + 1) * .5;
                var v1 = (y + 1) * .5;
                var v2 = (1 - y) * .5;

                // last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
                textureVerts = [-x, -y, u1, v1, 0, x, -y, u2, v1, 1, x, y, u2, v2, 2, -x, y, u1, v2, 3];

                screenVerts = [-1, -1, u1, v1, 0, 1, -1, u2, v1, 1, 1, 1, u2, v2, 2, -1, 1, u1, v2, 3];

                this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
                this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);

                this._buffersInvalid = false;
            };
            return RTTBufferManager;
        })(away.events.EventDispatcher);
        managers.RTTBufferManager = RTTBufferManager;

        var RTTBufferManagerVO = (function () {
            function RTTBufferManagerVO() {
            }
            return RTTBufferManagerVO;
        })();
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var SingletonEnforcer = (function () {
    function SingletonEnforcer() {
    }
    return SingletonEnforcer;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        var StageGL = away.base.StageGL;

        /**
        * The StageGLManager class provides a multiton object that handles management for StageGL objects. StageGL objects
        * should not be requested directly, but are exposed by a StageGLProxy.
        *
        * @see away.base.StageGL
        */
        var StageGLManager = (function (_super) {
            __extends(StageGLManager, _super);
            /**
            * Creates a new StageGLManager class.
            * @param stage The Stage object that contains the StageGL objects to be managed.
            * @private
            */
            function StageGLManager(StageGLManagerSingletonEnforcer) {
                _super.call(this);

                if (!StageGLManagerSingletonEnforcer)
                    throw new Error("This class is a multiton and cannot be instantiated manually. Use StageGLManager.getInstance instead.");

                this._stageGLs = new Array(StageGLManager.STAGEGL_MAX_QUANTITY);

                this._onContextCreatedDelegate = away.utils.Delegate.create(this, this.onContextCreated);
            }
            /**
            * Gets a StageGLManager instance for the given Stage object.
            * @param stage The Stage object that contains the StageGL objects to be managed.
            * @return The StageGLManager instance for the given Stage object.
            */
            StageGLManager.getInstance = function () {
                if (this._instance == null)
                    this._instance = new StageGLManager(new StageGLManagerSingletonEnforcer());

                return this._instance;
            };

            /**
            * Requests the StageGL for the given index.
            *
            * @param index The index of the requested StageGL.
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of ContextGLProfile
            * @return The StageGL for the given index.
            */
            StageGLManager.prototype.getStageGLAt = function (index, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                if (index < 0 || index >= StageGLManager.STAGEGL_MAX_QUANTITY)
                    throw new away.errors.ArgumentError("Index is out of bounds [0.." + StageGLManager.STAGEGL_MAX_QUANTITY + "]");

                if (!this._stageGLs[index]) {
                    StageGLManager._numStageGLs++;

                    var canvas = document.createElement("canvas");
                    var stageGL = this._stageGLs[index] = new StageGL(canvas, index, this, forceSoftware, profile);
                    stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextCreatedDelegate);
                    stageGL.requestContext(true, forceSoftware, profile);
                }

                return stageGL;
            };

            /**
            * Removes a StageGL from the manager.
            * @param stageGL
            * @private
            */
            StageGLManager.prototype.iRemoveStageGL = function (stageGL) {
                StageGLManager._numStageGLs--;

                stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextCreatedDelegate);

                this._stageGLs[stageGL._iStageGLIndex] = null;
            };

            /**
            * Get the next available stageGL. An error is thrown if there are no StageGLProxies available
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of ContextGLProfile
            * @return The allocated stageGL
            */
            StageGLManager.prototype.getFreeStageGL = function (forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                var i = 0;
                var len = this._stageGLs.length;

                while (i < len) {
                    if (!this._stageGLs[i])
                        return this.getStageGLAt(i, forceSoftware, profile);

                    ++i;
                }

                return null;
            };

            Object.defineProperty(StageGLManager.prototype, "hasFreeStageGL", {
                /**
                * Checks if a new stageGL can be created and managed by the class.
                * @return true if there is one slot free for a new stageGL
                */
                get: function () {
                    return StageGLManager._numStageGLs < StageGLManager.STAGEGL_MAX_QUANTITY ? true : false;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numSlotsFree", {
                /**
                * Returns the amount of stageGL objects that can be created and managed by the class
                * @return the amount of free slots
                */
                get: function () {
                    return StageGLManager.STAGEGL_MAX_QUANTITY - StageGLManager._numStageGLs;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numSlotsUsed", {
                /**
                * Returns the amount of StageGL objects currently managed by the class.
                * @return the amount of slots used
                */
                get: function () {
                    return StageGLManager._numStageGLs;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numSlotsTotal", {
                /**
                * The maximum amount of StageGL objects that can be managed by the class
                */
                get: function () {
                    return this._stageGLs.length;
                },
                enumerable: true,
                configurable: true
            });

            StageGLManager.prototype.onContextCreated = function (e) {
                var stageGL = e.target;
                document.body.appendChild(stageGL.canvas);
            };
            StageGLManager.STAGEGL_MAX_QUANTITY = 8;

            StageGLManager._numStageGLs = 0;
            return StageGLManager;
        })(away.events.EventDispatcher);
        managers.StageGLManager = StageGLManager;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var StageGLManagerSingletonEnforcer = (function () {
    function StageGLManagerSingletonEnforcer() {
    }
    return StageGLManagerSingletonEnforcer;
})();
/**********************************************************************************************************************************************************************************************************
* This file contains a reference to all the classes used in the project.
********************************************************************************************************************************************************************************************************
*
* The TypeScript compiler exports classes in a non deterministic manner, as the extend functionality copies the prototype chain
* of one object onto another during initialisation and load (to create extensible functionality), the non deterministic nature of the
* compiler can result in an extend operation referencing a class that is undefined and not yet loaded - which throw an JavaScript error.
*
* This file provides the compiler with a strict order in which to export the TypeScript classes to mitigate undefined extend errors
*
* @see https://typescript.codeplex.com/workitem/1356 @see https://typescript.codeplex.com/workitem/913
*
*********************************************************************************************************************************************************************************************************/
///<reference path="../../libs/ref/js.d.ts"/>
///<reference path="../../libs/awayjs-core.next.d.ts"/>
///<reference path="../aglsl/Sampler.ts"/>
///<reference path="../aglsl/Token.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/OpLUT.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/Description.ts"/>
///<reference path="../aglsl/Destination.ts"/>
///<reference path="../aglsl/ContextGL.ts"/>
///<reference path="../aglsl/Mapping.ts"/>
///<reference path="../aglsl/assembler/OpCode.ts"/>
///<reference path="../aglsl/assembler/OpcodeMap.ts"/>
///<reference path="../aglsl/assembler/Part.ts"/>
///<reference path="../aglsl/assembler/RegMap.ts"/>
///<reference path="../aglsl/assembler/SamplerMap.ts"/>
///<reference path="../aglsl/assembler/AGALMiniAssembler.ts"/>
///<reference path="../aglsl/AGALTokenizer.ts"/>
///<reference path="../aglsl/Parser.ts"/>
///<reference path="../aglsl/AGLSLCompiler.ts"/>
///<reference path="core/gl/ContextGLClearMask.ts"/>
///<reference path="core/gl/VertexBuffer.ts"/>
///<reference path="core/gl/IndexBuffer.ts"/>
///<reference path="core/gl/Program.ts"/>
///<reference path="core/gl/SamplerState.ts"/>
///<reference path="core/gl/ContextGLTextureFormat.ts"/>
///<reference path="core/gl/TextureBase.ts"/>
///<reference path="core/gl/Texture.ts" />
///<reference path="core/gl/CubeTexture.ts" />
///<reference path="core/gl/ContextGLTriangleFace.ts"/>
///<reference path="core/gl/ContextGLVertexBufferFormat.ts"/>
///<reference path="core/gl/ContextGLProgramType.ts"/>
///<reference path="core/gl/ContextGLBlendFactor.ts"/>
///<reference path="core/gl/ContextGLCompareMode.ts"/>
///<reference path="core/gl/ContextGLMipFilter.ts"/>
///<reference path="core/gl/ContextGLProfile.ts"/>
///<reference path="core/gl/ContextGLStencilAction.ts"/>
///<reference path="core/gl/ContextGLTextureFilter.ts"/>
///<reference path="core/gl/ContextGLWrapMode.ts"/>
///<reference path="core/gl/ContextGL.ts" />
///<reference path="core/gl/AGLSLContextGL.ts" />
///<reference path="core/base/StageGL.ts" />
///<reference path="core/pool/IndexData.ts" />
///<reference path="core/pool/IndexDataPool.ts" />
///<reference path="core/pool/TextureData.ts"/>
///<reference path="core/pool/TextureDataPool.ts"/>
///<reference path="core/pool/VertexData.ts" />
///<reference path="core/pool/VertexDataPool.ts" />
///<reference path="managers/AGALProgramCache.ts"/>
///<reference path="managers/RTTBufferManager.ts"/>
///<reference path="managers/StageGLManager.ts"/>
///<reference path="away/_definitions.ts"/>
away.Debug.THROW_ERRORS = false;
away.Debug.LOG_PI_ERRORS = false;

var away;
(function (away) {
    var StageGLContext = (function (_super) {
        __extends(StageGLContext, _super);
        function StageGLContext() {
            _super.call(this);
        }
        return StageGLContext;
    })(away.events.EventDispatcher);
    away.StageGLContext = StageGLContext;
})(away || (away = {}));
//# sourceMappingURL=stagegl-context.next.js.map
