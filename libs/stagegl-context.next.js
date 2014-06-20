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
                header += "uniform vec4 " + tag + "carrr[" + away.stagegl.ContextStage3D.maxvertexconstants + "];\n"; // use max const count instead
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
                this.contexts = new Array(8);
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
                    if (this.contexts[i]) {
                        this.contexts[i].disposeIndexData(this);
                        this.contexts[i] = null;
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
            function TextureData(context, textureProxy) {
                this.context = context;
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
            function TextureDataPool(context) {
                this._pool = new Object();
                this._context = context;
            }
            /**
            * //TODO
            *
            * @param materialOwner
            * @returns ITexture
            */
            TextureDataPool.prototype.getItem = function (textureProxy) {
                return (this._pool[textureProxy.id] || (this._pool[textureProxy.id] = textureProxy._iAddTextureData(new pool.TextureData(this._context, textureProxy))));
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
                this.contexts = new Array(8);
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
                    if (this.contexts[i]) {
                        this.contexts[i].disposeVertexData(this);
                        this.contexts[i] = null;
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
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var AbstractMethodError = away.errors.AbstractMethodError;

        var TextureDataPool = away.pool.TextureDataPool;

        var RenderTexture = away.textures.RenderTexture;

        /**
        * Stage provides a proxy class to handle the creation and attachment of the Context
        * (and in turn the back buffer) it uses. Stage should never be created directly,
        * but requested through StageManager.
        *
        * @see away.managers.StageManager
        *
        */
        var ContextGLBase = (function () {
            function ContextGLBase() {
                //private static _frameEventDriver:Shape = new Shape(); // TODO: add frame driver / request animation frame
                this._iStageIndex = -1;
                this._antiAlias = 0;
                this._renderTarget = null;
                this._renderSurfaceSelector = 0;
                this._texturePool = new TextureDataPool(this);
            }
            Object.defineProperty(ContextGLBase.prototype, "container", {
                get: function () {
                    return this._pContainer;
                },
                enumerable: true,
                configurable: true
            });

            ContextGLBase.prototype.setRenderTarget = function (target, enableDepthAndStencil, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                if (this._renderTarget === target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil)
                    return;

                this._renderTarget = target;
                this._renderSurfaceSelector = surfaceSelector;
                this._enableDepthAndStencil = enableDepthAndStencil;
                if (target instanceof RenderTexture) {
                    this.setRenderToTexture(this.getRenderTexture(target), enableDepthAndStencil, this._antiAlias, surfaceSelector);
                } else {
                    this.setRenderToBackBuffer();
                    this.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);
                }
            };

            ContextGLBase.prototype.getRenderTexture = function (textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture)
                    textureData.texture = this.createTexture(textureProxy.width, textureProxy.height, stagegl.ContextGLTextureFormat.BGRA, true);

                return textureData.texture;
            };

            /**
            * Assigns an attribute stream
            *
            * @param index The attribute stream index for the vertex shader
            * @param buffer
            * @param offset
            * @param stride
            * @param format
            */
            ContextGLBase.prototype.activateBuffer = function (index, buffer, offset, format) {
                if (!buffer.contexts[this._iStageIndex])
                    buffer.contexts[this._iStageIndex] = this;

                if (!buffer.buffers[this._iStageIndex]) {
                    buffer.buffers[this._iStageIndex] = this.createVertexBuffer(buffer.data.length / buffer.dataPerVertex, buffer.dataPerVertex);
                    buffer.invalid[this._iStageIndex] = true;
                }

                if (buffer.invalid[this._iStageIndex]) {
                    buffer.buffers[this._iStageIndex].uploadFromArray(buffer.data, 0, buffer.data.length / buffer.dataPerVertex);
                    buffer.invalid[this._iStageIndex] = false;
                }

                this.setVertexBufferAt(index, buffer.buffers[this._iStageIndex], offset, format);
            };

            ContextGLBase.prototype.disposeVertexData = function (buffer) {
                buffer.buffers[this._iStageIndex].dispose();
                buffer.buffers[this._iStageIndex] = null;
            };

            ContextGLBase.prototype.activateRenderTexture = function (index, textureProxy) {
                this.setTextureAt(index, this.getRenderTexture(textureProxy));
            };

            ContextGLBase.prototype.activateTexture = function (index, textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture) {
                    textureData.texture = this.createTexture(textureProxy.width, textureProxy.height, stagegl.ContextGLTextureFormat.BGRA, true);
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

                this.setTextureAt(index, textureData.texture);
            };

            ContextGLBase.prototype.activateCubeTexture = function (index, textureProxy) {
                var textureData = this._texturePool.getItem(textureProxy);

                if (!textureData.texture) {
                    textureData.texture = this.createCubeTexture(textureProxy.size, stagegl.ContextGLTextureFormat.BGRA, false);
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

                this.setTextureAt(index, textureData.texture);
            };

            /**
            * Retrieves the VertexBuffer object that contains triangle indices.
            * @param context The ContextWeb for which we request the buffer
            * @return The VertexBuffer object that contains triangle indices.
            */
            ContextGLBase.prototype.getIndexBuffer = function (buffer) {
                if (!buffer.contexts[this._iStageIndex])
                    buffer.contexts[this._iStageIndex] = this;

                if (!buffer.buffers[this._iStageIndex]) {
                    buffer.buffers[this._iStageIndex] = this.createIndexBuffer(buffer.data.length);
                    buffer.invalid[this._iStageIndex] = true;
                }

                if (buffer.invalid[this._iStageIndex]) {
                    buffer.buffers[this._iStageIndex].uploadFromArray(buffer.data, 0, buffer.data.length);
                    buffer.invalid[this._iStageIndex] = false;
                }

                return buffer.buffers[this._iStageIndex];
            };

            ContextGLBase.prototype.disposeIndexData = function (buffer) {
                buffer.buffers[this._iStageIndex].dispose();
                buffer.buffers[this._iStageIndex] = null;
            };

            ContextGLBase.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = stagegl.ContextGLClearMask.ALL; }
            };

            ContextGLBase.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                this._width = width;
                this._height = height;
            };

            ContextGLBase.prototype.createIndexBuffer = function (numIndices) {
                throw new AbstractMethodError();
            };

            ContextGLBase.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                throw new AbstractMethodError();
            };

            ContextGLBase.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                throw new AbstractMethodError();
            };

            ContextGLBase.prototype.createCubeTexture = function (size, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                throw new AbstractMethodError();
            };

            ContextGLBase.prototype.dispose = function () {
            };

            ContextGLBase.prototype.present = function () {
            };

            ContextGLBase.prototype.setRenderToTexture = function (target, enableDepthAndStencil, antiAlias, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof antiAlias === "undefined") { antiAlias = 0; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
            };

            ContextGLBase.prototype.setRenderToBackBuffer = function () {
            };

            ContextGLBase.prototype.setScissorRectangle = function (rectangle) {
            };

            ContextGLBase.prototype.setTextureAt = function (sampler, texture) {
            };

            ContextGLBase.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
            };
            return ContextGLBase;
        })();
        stagegl.ContextGLBase = ContextGLBase;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ContextGLClearMask = (function () {
            function ContextGLClearMask() {
            }
            ContextGLClearMask.COLOR = 1;
            ContextGLClearMask.DEPTH = 2;
            ContextGLClearMask.STENCIL = 4;
            ContextGLClearMask.ALL = ContextGLClearMask.COLOR | ContextGLClearMask.DEPTH | ContextGLClearMask.STENCIL;
            return ContextGLClearMask;
        })();
        stagegl.ContextGLClearMask = ContextGLClearMask;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
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
        stagegl.ContextGLTextureFormat = ContextGLTextureFormat;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
        var ContextGLTriangleFace = (function () {
            function ContextGLTriangleFace() {
            }
            ContextGLTriangleFace.BACK = "back";
            ContextGLTriangleFace.FRONT = "front";
            ContextGLTriangleFace.FRONT_AND_BACK = "frontAndBack";
            ContextGLTriangleFace.NONE = "none";
            return ContextGLTriangleFace;
        })();
        stagegl.ContextGLTriangleFace = ContextGLTriangleFace;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
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
        stagegl.ContextGLVertexBufferFormat = ContextGLVertexBufferFormat;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ContextGLProgramType = (function () {
            function ContextGLProgramType() {
            }
            ContextGLProgramType.FRAGMENT = "fragment";
            ContextGLProgramType.VERTEX = "vertex";
            return ContextGLProgramType;
        })();
        stagegl.ContextGLProgramType = ContextGLProgramType;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
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
        stagegl.ContextGLBlendFactor = ContextGLBlendFactor;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
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
        stagegl.ContextGLCompareMode = ContextGLCompareMode;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
        var ContextGLMipFilter = (function () {
            function ContextGLMipFilter() {
            }
            ContextGLMipFilter.MIPLINEAR = "miplinear";
            ContextGLMipFilter.MIPNEAREST = "mipnearest";
            ContextGLMipFilter.MIPNONE = "mipnone";
            return ContextGLMipFilter;
        })();
        stagegl.ContextGLMipFilter = ContextGLMipFilter;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
        var ContextGLProfile = (function () {
            function ContextGLProfile() {
            }
            ContextGLProfile.BASELINE = "baseline";
            ContextGLProfile.BASELINE_CONSTRAINED = "baselineConstrained";
            ContextGLProfile.BASELINE_EXTENDED = "baselineExtended";
            return ContextGLProfile;
        })();
        stagegl.ContextGLProfile = ContextGLProfile;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
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
        stagegl.ContextGLStencilAction = ContextGLStencilAction;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (stagegl) {
        var ContextGLTextureFilter = (function () {
            function ContextGLTextureFilter() {
            }
            ContextGLTextureFilter.LINEAR = "linear";
            ContextGLTextureFilter.NEAREST = "nearest";
            return ContextGLTextureFilter;
        })();
        stagegl.ContextGLTextureFilter = ContextGLTextureFilter;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ContextGLWrapMode = (function () {
            function ContextGLWrapMode() {
            }
            ContextGLWrapMode.CLAMP = "clamp";
            ContextGLWrapMode.REPEAT = "repeat";
            return ContextGLWrapMode;
        })();
        stagegl.ContextGLWrapMode = ContextGLWrapMode;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
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
    (function (stagegl) {
        var ContextStage3D = (function (_super) {
            __extends(ContextStage3D, _super);
            function ContextStage3D(container, callback) {
                _super.call(this);
                this._cmdStream = "";

                this._resources = new Array();

                var swfVersionStr = "11.0.0";

                // To use express install, set to playerProductInstall.swf, otherwise the empty string.
                var flashvars = {
                    id: container.id
                };

                var params = {
                    quality: "high",
                    bgcolor: "#ffffff",
                    allowscriptaccess: "sameDomain",
                    allowfullscreen: "true",
                    wmode: "direct"
                };

                this._errorCheckingEnabled = false;
                this._iDriverInfo = "Unknown";

                var attributes = {
                    salign: "tl",
                    id: container.id,
                    name: container["name"]
                };

                this._oldCanvas = container.cloneNode(); // keep the old one to restore on dispose
                this._oldParent = container.parentNode;

                var context3dObj = this;
                ContextStage3D.contexts[container.id] = this;

                function callbackSWFObject(callbackInfo) {
                    if (!callbackInfo.success)
                        return;

                    context3dObj._pContainer = callbackInfo.ref;
                    context3dObj._iCallback = callback;
                }

                swfobject.embedSWF("../libs/molehill_js_flashbridge.swf", container.id, String(container.width), String(container.height), swfVersionStr, "", flashvars, params, attributes, callbackSWFObject);
            }
            Object.defineProperty(ContextStage3D.prototype, "container", {
                get: function () {
                    return this._pContainer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ContextStage3D.prototype, "driverInfo", {
                get: function () {
                    return this._iDriverInfo;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ContextStage3D.prototype, "errorCheckingEnabled", {
                get: function () {
                    return this._errorCheckingEnabled;
                },
                set: function (value) {
                    if (this._errorCheckingEnabled == value)
                        return;

                    this._errorCheckingEnabled = value;

                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.enableErrorChecking, value ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue));
                    this.execute();
                },
                enumerable: true,
                configurable: true
            });


            ContextStage3D.prototype._iAddResource = function (resource) {
                this._resources.push(resource);
            };

            ContextStage3D.prototype._iRemoveResource = function (resource) {
                this._resources.splice(this._resources.indexOf(resource));
            };

            ContextStage3D.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                //TODO:streaming
                return new stagegl.TextureFlash(this, width, height, format, optimizeForRenderToTexture);
            };

            ContextStage3D.prototype.createCubeTexture = function (size, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                //TODO:streaming
                return new stagegl.CubeTextureFlash(this, size, format, optimizeForRenderToTexture);
            };

            ContextStage3D.prototype.setTextureAt = function (sampler, texture) {
                if (texture) {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.setTextureAt) + sampler + "," + texture.id + ",");
                } else {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.clearTextureAt) + sampler.toString() + ",");
                }

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setSamplerStateAt = function (sampler, wrap, filter, mipfilter) {
                //nothing to do here
            };

            ContextStage3D.prototype.setStencilActions = function (triangleFace, compareMode, actionOnBothPass, actionOnDepthFail, actionOnDepthPassStencilFail) {
                if (typeof triangleFace === "undefined") { triangleFace = "frontAndBack"; }
                if (typeof compareMode === "undefined") { compareMode = "always"; }
                if (typeof actionOnBothPass === "undefined") { actionOnBothPass = "keep"; }
                if (typeof actionOnDepthFail === "undefined") { actionOnDepthFail = "keep"; }
                if (typeof actionOnDepthPassStencilFail === "undefined") { actionOnDepthPassStencilFail = "keep"; }
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setStencilActions) + triangleFace + "$" + compareMode + "$" + actionOnBothPass + "$" + actionOnDepthFail + "$" + actionOnDepthPassStencilFail + "$");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setStencilReferenceValue = function (referenceValue, readMask, writeMask) {
                if (typeof readMask === "undefined") { readMask = 255; }
                if (typeof writeMask === "undefined") { writeMask = 255; }
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setStencilReferenceValue, referenceValue + away.stagegl.OpCodes.intMask, readMask + away.stagegl.OpCodes.intMask, writeMask + away.stagegl.OpCodes.intMask));

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setCulling = function (triangleFaceToCull, coordinateSystem) {
                if (typeof coordinateSystem === "undefined") { coordinateSystem = "leftHanded"; }
                //TODO implement coordinateSystem option
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setCulling) + triangleFaceToCull + "$");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                firstIndex = firstIndex || 0;
                if (!numTriangles || numTriangles < 0)
                    numTriangles = indexBuffer.numIndices / 3;

                this.addStream(String.fromCharCode(away.stagegl.OpCodes.drawTriangles, indexBuffer.id + away.stagegl.OpCodes.intMask) + firstIndex + "," + numTriangles + ",");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                //this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._currentProgram.glProgram, this._uniformLocationNameDictionary[programType]), !transposedMatrix, new Float32Array(matrix.rawData));
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

            ContextStage3D.prototype.setProgramConstantsFromArray = function (programType, firstRegister, data, numRegisters) {
                if (typeof numRegisters === "undefined") { numRegisters = -1; }
                var startIndex;
                var target = (programType == stagegl.ContextGLProgramType.VERTEX) ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue;
                for (var i = 0; i < numRegisters; i++) {
                    startIndex = i * 4;
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.setProgramConstant, target, (firstRegister + i) + away.stagegl.OpCodes.intMask) + data[startIndex] + "," + data[startIndex + 1] + "," + data[startIndex + 2] + "," + data[startIndex + 3] + ",");

                    if (ContextStage3D.debug)
                        this.execute();
                }
            };

            ContextStage3D.prototype.setProgram = function (program) {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setProgram, program.id + away.stagegl.OpCodes.intMask));

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.present = function () {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.present));
                this.execute();
            };

            ContextStage3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = stagegl.ContextGLClearMask.ALL; }
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.clear) + red + "," + green + "," + blue + "," + alpha + "," + depth + "," + stencil + "," + mask + ",");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.createProgram = function () {
                return new stagegl.ProgramFlash(this);
            };

            ContextStage3D.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                return new stagegl.VertexBufferFlash(this, numVertices, data32PerVertex);
            };

            ContextStage3D.prototype.createIndexBuffer = function (numIndices) {
                return new stagegl.IndexBufferFlash(this, numIndices);
            };

            ContextStage3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                _super.prototype.configureBackBuffer.call(this, width, height, antiAlias, enableDepthAndStencil);

                //TODO: add Anitalias setting
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.configureBackBuffer) + width + "," + height + ",");
            };

            ContextStage3D.prototype.drawToBitmapData = function (destination) {
                //TODO
            };

            ContextStage3D.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                if (buffer) {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.setVertexBufferAt, index + away.stagegl.OpCodes.intMask) + buffer.id + "," + bufferOffset + "," + format + "$");
                } else {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.clearVertexBufferAt, index + away.stagegl.OpCodes.intMask));
                }

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setColorMask = function (red, green, blue, alpha) {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setColorMask, red ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue, green ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue, blue ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue, alpha ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue));

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setBlendFactors) + sourceFactor + "$" + destinationFactor + "$");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setRenderToTexture = function (target, enableDepthAndStencil, antiAlias, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof antiAlias === "undefined") { antiAlias = 0; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                if (target === null || target === undefined) {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.clearRenderToTexture));
                } else {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.setRenderToTexture, enableDepthAndStencil ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue) + target.id + "," + (antiAlias || 0) + ",");
                }

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setRenderToBackBuffer = function () {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.clearRenderToTexture));

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setScissorRectangle = function (rectangle) {
                if (rectangle) {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.setScissorRect) + rectangle.x + "," + rectangle.y + "," + rectangle.width + "," + rectangle.height + ",");
                } else {
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.clearScissorRect));
                }

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
                this.addStream(String.fromCharCode(away.stagegl.OpCodes.setDepthTest, depthMask ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue) + passCompareMode + "$");

                if (ContextStage3D.debug)
                    this.execute();
            };

            ContextStage3D.prototype.dispose = function () {
                if (this._pContainer == null)
                    return;

                console.log("Context3D dispose, releasing " + this._resources.length + " resources.");

                while (this._resources.length)
                    this._resources[0].dispose();

                if (this._pContainer) {
                    // encode command
                    this.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeContext));
                    this.execute();
                    swfobject.removeSWF(this._oldCanvas.id);
                    if (this._oldCanvas && this._oldParent) {
                        this._oldParent.appendChild(this._oldCanvas);
                        this._oldParent = null;
                    }
                    this._pContainer = null;
                }

                this._oldCanvas = null;
            };

            ContextStage3D.prototype.addStream = function (stream) {
                this._cmdStream += stream;
            };

            ContextStage3D.prototype.execute = function () {
                if (ContextStage3D.logStream)
                    console.log(this._cmdStream);

                var result = this._pContainer["CallFunction"]("<invoke name=\"execStage3dOpStream\" returntype=\"javascript\"><arguments><string>" + this._cmdStream + "</string></arguments></invoke>");

                if (Number(result) <= -3)
                    throw "Exec stream failed";

                this._cmdStream = "";

                return Number(result);
            };
            ContextStage3D.contexts = new Object();
            ContextStage3D.maxvertexconstants = 128;
            ContextStage3D.maxfragconstants = 28;
            ContextStage3D.maxtemp = 8;
            ContextStage3D.maxstreams = 8;
            ContextStage3D.maxtextures = 8;
            ContextStage3D.defaultsampler = new aglsl.Sampler();

            ContextStage3D.debug = false;
            ContextStage3D.logStream = false;
            return ContextStage3D;
        })(stagegl.ContextGLBase);
        stagegl.ContextStage3D = ContextStage3D;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));

/**
* global function for flash callback
*/
function mountain_js_context_available(id, driverInfo) {
    var ctx = away.stagegl.ContextStage3D.contexts[id];
    if (ctx._iCallback) {
        ctx._iDriverInfo = driverInfo;

        // get out of the current JS stack frame and call back from flash player
        var timeOutId = window.setTimeout(function () {
            window.clearTimeout(timeOutId);
            try  {
                ctx._iCallback(ctx);
            } catch (e) {
                console.log("Callback failed during flash initialization with '" + e.toString() + "'");
            }
        }, 1);
    }
}
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ContextWebGL = (function (_super) {
            __extends(ContextWebGL, _super);
            function ContextWebGL(canvas) {
                _super.call(this);
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

                this._pContainer = canvas;

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
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE] = this._gl.ONE;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.DESTINATION_ALPHA] = this._gl.DST_ALPHA;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.DESTINATION_COLOR] = this._gl.DST_COLOR;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE] = this._gl.ONE;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA] = this._gl.ONE_MINUS_DST_ALPHA;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR] = this._gl.ONE_MINUS_DST_COLOR;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA] = this._gl.ONE_MINUS_SRC_ALPHA;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR] = this._gl.ONE_MINUS_SRC_COLOR;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.SOURCE_ALPHA] = this._gl.SRC_ALPHA;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.SOURCE_COLOR] = this._gl.SRC_COLOR;
                    this._blendFactorDictionary[stagegl.ContextGLBlendFactor.ZERO] = this._gl.ZERO;

                    this._depthTestDictionary[stagegl.ContextGLCompareMode.ALWAYS] = this._gl.ALWAYS;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.EQUAL] = this._gl.EQUAL;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.GREATER] = this._gl.GREATER;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.GREATER_EQUAL] = this._gl.GEQUAL;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.LESS] = this._gl.LESS;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.LESS_EQUAL] = this._gl.LEQUAL;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.NEVER] = this._gl.NEVER;
                    this._depthTestDictionary[stagegl.ContextGLCompareMode.NOT_EQUAL] = this._gl.NOTEQUAL;

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

                    this._wrapDictionary[stagegl.ContextGLWrapMode.REPEAT] = this._gl.REPEAT;
                    this._wrapDictionary[stagegl.ContextGLWrapMode.CLAMP] = this._gl.CLAMP_TO_EDGE;

                    this._filterDictionary[stagegl.ContextGLTextureFilter.LINEAR] = this._gl.LINEAR;
                    this._filterDictionary[stagegl.ContextGLTextureFilter.NEAREST] = this._gl.NEAREST;

                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.LINEAR] = new Object();
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.LINEAR][stagegl.ContextGLMipFilter.MIPNEAREST] = this._gl.LINEAR_MIPMAP_NEAREST;
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.LINEAR][stagegl.ContextGLMipFilter.MIPLINEAR] = this._gl.LINEAR_MIPMAP_LINEAR;
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.LINEAR][stagegl.ContextGLMipFilter.MIPNONE] = this._gl.LINEAR;
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.NEAREST] = new Object();
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.NEAREST][stagegl.ContextGLMipFilter.MIPNEAREST] = this._gl.NEAREST_MIPMAP_NEAREST;
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.NEAREST][stagegl.ContextGLMipFilter.MIPLINEAR] = this._gl.NEAREST_MIPMAP_LINEAR;
                    this._mipmapFilterDictionary[stagegl.ContextGLTextureFilter.NEAREST][stagegl.ContextGLMipFilter.MIPNONE] = this._gl.NEAREST;

                    this._uniformLocationNameDictionary[stagegl.ContextGLProgramType.VERTEX] = "vc";
                    this._uniformLocationNameDictionary[stagegl.ContextGLProgramType.FRAGMENT] = "fc";

                    this._vertexBufferDimensionDictionary[stagegl.ContextGLVertexBufferFormat.FLOAT_1] = 1;
                    this._vertexBufferDimensionDictionary[stagegl.ContextGLVertexBufferFormat.FLOAT_2] = 2;
                    this._vertexBufferDimensionDictionary[stagegl.ContextGLVertexBufferFormat.FLOAT_3] = 3;
                    this._vertexBufferDimensionDictionary[stagegl.ContextGLVertexBufferFormat.FLOAT_4] = 4;
                    this._vertexBufferDimensionDictionary[stagegl.ContextGLVertexBufferFormat.BYTES_4] = 4;
                } else {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                    alert("WebGL is not available.");
                }

                for (var i = 0; i < ContextWebGL.MAX_SAMPLERS; ++i) {
                    this._samplerStates[i] = new stagegl.SamplerState();
                    this._samplerStates[i].wrap = this._gl.REPEAT;
                    this._samplerStates[i].filter = this._gl.LINEAR;
                    this._samplerStates[i].mipfilter = this._gl.LINEAR;
                }
            }
            Object.defineProperty(ContextWebGL.prototype, "container", {
                get: function () {
                    return this._pContainer;
                },
                enumerable: true,
                configurable: true
            });

            ContextWebGL.prototype.gl = function () {
                return this._gl;
            };

            ContextWebGL.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = stagegl.ContextGLClearMask.ALL; }
                if (!this._drawing) {
                    this.updateBlendStatus();
                    this._drawing = true;
                }

                var glmask = 0;
                if (mask & stagegl.ContextGLClearMask.COLOR)
                    glmask |= this._gl.COLOR_BUFFER_BIT;
                if (mask & stagegl.ContextGLClearMask.STENCIL)
                    glmask |= this._gl.STENCIL_BUFFER_BIT;
                if (mask & stagegl.ContextGLClearMask.DEPTH)
                    glmask |= this._gl.DEPTH_BUFFER_BIT;

                this._gl.clearColor(red, green, blue, alpha);
                this._gl.clearDepth(depth);
                this._gl.clearStencil(stencil);
                this._gl.clear(glmask);
            };

            ContextWebGL.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                _super.prototype.configureBackBuffer.call(this, width, height, antiAlias, enableDepthAndStencil);

                if (enableDepthAndStencil) {
                    this._gl.enable(this._gl.STENCIL_TEST);
                    this._gl.enable(this._gl.DEPTH_TEST);
                }

                this._gl.viewport['width'] = width;
                this._gl.viewport['height'] = height;

                this._gl.viewport(0, 0, width, height);
            };

            ContextWebGL.prototype.createCubeTexture = function (size, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                var texture = new stagegl.CubeTextureWebGL(this._gl, size);
                this._textureList.push(texture);
                return texture;
            };

            ContextWebGL.prototype.createIndexBuffer = function (numIndices) {
                var indexBuffer = new stagegl.IndexBufferWebGL(this._gl, numIndices);
                this._indexBufferList.push(indexBuffer);
                return indexBuffer;
            };

            ContextWebGL.prototype.createProgram = function () {
                var program = new stagegl.ProgramWebGL(this._gl);
                this._programList.push(program);
                return program;
            };

            ContextWebGL.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                //TODO streaming
                var texture = new stagegl.TextureWebGL(this._gl, width, height);
                this._textureList.push(texture);
                return texture;
            };

            ContextWebGL.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                var vertexBuffer = new stagegl.VertexBufferWebGL(this._gl, numVertices, data32PerVertex);
                this._vertexBufferList.push(vertexBuffer);
                return vertexBuffer;
            };

            ContextWebGL.prototype.dispose = function () {
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

            ContextWebGL.prototype.drawToBitmapData = function (destination) {
                var arrayBuffer = new ArrayBuffer(destination.width * destination.height * 4);

                this._gl.readPixels(0, 0, destination.width, destination.height, this._gl.RGBA, this._gl.UNSIGNED_BYTE, new Uint8Array(arrayBuffer));

                var byteArray = new away.utils.ByteArray();
                byteArray.setArrayBuffer(arrayBuffer);

                destination.setPixels(new away.geom.Rectangle(0, 0, destination.width, destination.height), byteArray);
            };

            ContextWebGL.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                if (!this._drawing)
                    throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";

                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
                this._gl.drawElements(this._gl.TRIANGLES, (numTriangles == -1) ? indexBuffer.numIndices : numTriangles * 3, this._gl.UNSIGNED_SHORT, firstIndex);
            };

            ContextWebGL.prototype.present = function () {
                this._drawing = false;
            };

            ContextWebGL.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                this._blendEnabled = true;

                this._blendSourceFactor = this._blendFactorDictionary[sourceFactor];

                this._blendDestinationFactor = this._blendFactorDictionary[destinationFactor];

                this.updateBlendStatus();
            };

            ContextWebGL.prototype.setColorMask = function (red, green, blue, alpha) {
                this._gl.colorMask(red, green, blue, alpha);
            };

            ContextWebGL.prototype.setCulling = function (triangleFaceToCull, coordinateSystem) {
                if (typeof coordinateSystem === "undefined") { coordinateSystem = "leftHanded"; }
                if (triangleFaceToCull == stagegl.ContextGLTriangleFace.NONE) {
                    this._gl.disable(this._gl.CULL_FACE);
                } else {
                    this._gl.enable(this._gl.CULL_FACE);
                    switch (triangleFaceToCull) {
                        case stagegl.ContextGLTriangleFace.BACK:
                            this._gl.cullFace((coordinateSystem == "leftHanded") ? this._gl.FRONT : this._gl.BACK);
                            break;
                        case stagegl.ContextGLTriangleFace.FRONT:
                            this._gl.cullFace((coordinateSystem == "leftHanded") ? this._gl.BACK : this._gl.FRONT);
                            break;
                        case stagegl.ContextGLTriangleFace.FRONT_AND_BACK:
                            this._gl.cullFace(this._gl.FRONT_AND_BACK);
                            break;
                        default:
                            throw "Unknown ContextGLTriangleFace type.";
                    }
                }
            };

            // TODO ContextGLCompareMode
            ContextWebGL.prototype.setDepthTest = function (depthMask, passCompareMode) {
                this._gl.depthFunc(this._depthTestDictionary[passCompareMode]);

                this._gl.depthMask(depthMask);
            };

            ContextWebGL.prototype.setProgram = function (program) {
                //TODO decide on construction/reference resposibilities
                this._currentProgram = program;
                program.focusProgram();
            };

            ContextWebGL.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                //this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._currentProgram.glProgram, this._uniformLocationNameDictionary[programType]), !transposedMatrix, new Float32Array(matrix.rawData));
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

            ContextWebGL.prototype.setProgramConstantsFromArray = function (programType, firstRegister, data, numRegisters) {
                if (typeof numRegisters === "undefined") { numRegisters = -1; }
                var locationName = this._uniformLocationNameDictionary[programType];
                var startIndex;
                for (var i = 0; i < numRegisters; i++) {
                    startIndex = i * 4;
                    this._gl.uniform4f(this._gl.getUniformLocation(this._currentProgram.glProgram, locationName + (firstRegister + i)), data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]);
                }
            };

            ContextWebGL.prototype.setScissorRectangle = function (rectangle) {
                if (!rectangle) {
                    this._gl.disable(this._gl.SCISSOR_TEST);
                    return;
                }

                this._gl.enable(this._gl.SCISSOR_TEST);
                this._gl.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            };

            ContextWebGL.prototype.setTextureAt = function (sampler, texture) {
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

            ContextWebGL.prototype.setSamplerStateAt = function (sampler, wrap, filter, mipfilter) {
                if (0 <= sampler && sampler < ContextWebGL.MAX_SAMPLERS) {
                    this._samplerStates[sampler].wrap = this._wrapDictionary[wrap];
                    this._samplerStates[sampler].filter = this._filterDictionary[filter];
                    this._samplerStates[sampler].mipfilter = this._mipmapFilterDictionary[filter][mipfilter];
                } else {
                    throw "Sampler is out of bounds.";
                }
            };

            ContextWebGL.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
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

            ContextWebGL.prototype.setRenderToTexture = function (target, enableDepthAndStencil, antiAlias, surfaceSelector) {
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

            ContextWebGL.prototype.setRenderToBackBuffer = function () {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            };

            ContextWebGL.prototype.updateBlendStatus = function () {
                if (this._blendEnabled) {
                    this._gl.enable(this._gl.BLEND);
                    this._gl.blendEquation(this._gl.FUNC_ADD);
                    this._gl.blendFunc(this._blendSourceFactor, this._blendDestinationFactor);
                } else {
                    this._gl.disable(this._gl.BLEND);
                }
            };
            ContextWebGL.MAX_SAMPLERS = 8;

            ContextWebGL.modulo = 0;
            return ContextWebGL;
        })(stagegl.ContextGLBase);
        stagegl.ContextWebGL = ContextWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ResourceBaseFlash = (function () {
            function ResourceBaseFlash() {
            }
            Object.defineProperty(ResourceBaseFlash.prototype, "id", {
                get: function () {
                    return this._pId;
                },
                enumerable: true,
                configurable: true
            });

            ResourceBaseFlash.prototype.dispose = function () {
            };
            return ResourceBaseFlash;
        })();
        stagegl.ResourceBaseFlash = ResourceBaseFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var TextureBaseWebGL = (function () {
            function TextureBaseWebGL(gl) {
                this.textureType = "";
                this._gl = gl;
            }
            TextureBaseWebGL.prototype.dispose = function () {
                throw "Abstract method must be overridden.";
            };

            Object.defineProperty(TextureBaseWebGL.prototype, "glTexture", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });
            return TextureBaseWebGL;
        })();
        stagegl.TextureBaseWebGL = TextureBaseWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ByteArrayBase = away.utils.ByteArrayBase;

        var CubeTextureFlash = (function (_super) {
            __extends(CubeTextureFlash, _super);
            function CubeTextureFlash(context, size, format, forRTT, streaming) {
                if (typeof streaming === "undefined") { streaming = false; }
                _super.call(this);

                this._context = context;
                this._size = size;

                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.initCubeTexture, (forRTT ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue)) + size + "," + streaming + "," + format + "$");
                this._pId = this._context.execute();
                this._context._iAddResource(this);
            }
            Object.defineProperty(CubeTextureFlash.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            CubeTextureFlash.prototype.dispose = function () {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeCubeTexture) + this._pId.toString() + ",");
                this._context.execute();
                this._context._iRemoveResource(this);

                this._context = null;
            };

            CubeTextureFlash.prototype.uploadFromData = function (data, side, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData) {
                    data = data.imageData.data;
                } else if (data instanceof HTMLImageElement) {
                    var can = document.createElement("canvas");
                    var w = data.width;
                    var h = data.height;
                    can.width = w;
                    can.height = h;
                    var ctx = can.getContext("2d");
                    ctx.drawImage(data, 0, 0);
                    data = ctx.getImageData(0, 0, w, h).data;
                }

                var pos = 0;
                var bytes = ByteArrayBase.internalGetBase64String(data.length, function () {
                    return data[pos++];
                }, null);

                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.uploadBytesCubeTexture) + this._pId + "," + miplevel + "," + side + "," + (this.size >> miplevel) + "," + bytes + "%");
                this._context.execute();
            };

            CubeTextureFlash.prototype.uploadCompressedTextureFromByteArray = function (data, byteArrayOffset /*uint*/ , async) {
                if (typeof async === "undefined") { async = false; }
            };
            return CubeTextureFlash;
        })(stagegl.ResourceBaseFlash);
        stagegl.CubeTextureFlash = CubeTextureFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var CubeTextureWebGL = (function (_super) {
            __extends(CubeTextureWebGL, _super);
            function CubeTextureWebGL(gl, size) {
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
            CubeTextureWebGL.prototype.dispose = function () {
                this._gl.deleteTexture(this._texture);
            };

            CubeTextureWebGL.prototype.uploadFromData = function (data, side, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData)
                    data = data.imageData;

                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                this._gl.texImage2D(this._textureSelectorDictionary[side], miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data);
                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
            };

            CubeTextureWebGL.prototype.uploadCompressedTextureFromByteArray = function (data, byteArrayOffset /*uint*/ , async) {
                if (typeof async === "undefined") { async = false; }
            };

            Object.defineProperty(CubeTextureWebGL.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CubeTextureWebGL.prototype, "glTexture", {
                get: function () {
                    return this._texture;
                },
                enumerable: true,
                configurable: true
            });
            return CubeTextureWebGL;
        })(stagegl.TextureBaseWebGL);
        stagegl.CubeTextureWebGL = CubeTextureWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var IndexBufferFlash = (function (_super) {
            __extends(IndexBufferFlash, _super);
            function IndexBufferFlash(context, numIndices) {
                _super.call(this);

                this._context = context;
                this._numIndices = numIndices;
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.initIndexBuffer, numIndices + away.stagegl.OpCodes.intMask));
                this._pId = this._context.execute();
                this._context._iAddResource(this);
            }
            IndexBufferFlash.prototype.uploadFromArray = function (data, startOffset, count) {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.uploadArrayIndexBuffer, this._pId + away.stagegl.OpCodes.intMask) + data.join() + "#" + startOffset + "," + count + ",");
                this._context.execute();
            };

            IndexBufferFlash.prototype.dispose = function () {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeIndexBuffer, this._pId + away.stagegl.OpCodes.intMask));
                this._context.execute();
                this._context._iRemoveResource(this);

                this._context = null;
            };

            Object.defineProperty(IndexBufferFlash.prototype, "numIndices", {
                get: function () {
                    return this._numIndices;
                },
                enumerable: true,
                configurable: true
            });
            return IndexBufferFlash;
        })(stagegl.ResourceBaseFlash);
        stagegl.IndexBufferFlash = IndexBufferFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var IndexBufferWebGL = (function () {
            function IndexBufferWebGL(gl, numIndices) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numIndices = numIndices;
            }
            IndexBufferWebGL.prototype.uploadFromArray = function (data, startOffset, count) {
                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);

                // TODO add index offsets
                this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this._gl.STATIC_DRAW);
            };

            IndexBufferWebGL.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };

            Object.defineProperty(IndexBufferWebGL.prototype, "numIndices", {
                get: function () {
                    return this._numIndices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IndexBufferWebGL.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            return IndexBufferWebGL;
        })();
        stagegl.IndexBufferWebGL = IndexBufferWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var OpCodes = (function () {
            function OpCodes() {
            }
            OpCodes.trueValue = 32;
            OpCodes.falseValue = 33;
            OpCodes.intMask = 63;
            OpCodes.drawTriangles = 41;
            OpCodes.setProgramConstant = 42;
            OpCodes.setProgram = 43;
            OpCodes.present = 44;
            OpCodes.clear = 45;
            OpCodes.initProgram = 46;
            OpCodes.initVertexBuffer = 47;
            OpCodes.initIndexBuffer = 48;
            OpCodes.configureBackBuffer = 49;
            OpCodes.uploadArrayIndexBuffer = 50;
            OpCodes.uploadArrayVertexBuffer = 51;
            OpCodes.uploadAGALBytesProgram = 52;
            OpCodes.setVertexBufferAt = 53;
            OpCodes.uploadBytesIndexBuffer = 54;
            OpCodes.uploadBytesVertexBuffer = 55;
            OpCodes.setColorMask = 56;
            OpCodes.setDepthTest = 57;
            OpCodes.disposeProgram = 58;
            OpCodes.disposeContext = 59;

            OpCodes.disposeVertexBuffer = 61;

            OpCodes.disposeIndexBuffer = 63;
            OpCodes.initTexture = 64;
            OpCodes.setTextureAt = 65;
            OpCodes.uploadBytesTexture = 66;
            OpCodes.disposeTexture = 67;
            OpCodes.setCulling = 68;
            OpCodes.setScissorRect = 69;
            OpCodes.clearScissorRect = 70;
            OpCodes.setBlendFactors = 71;
            OpCodes.setRenderToTexture = 72;
            OpCodes.clearTextureAt = 73;
            OpCodes.clearVertexBufferAt = 74;
            OpCodes.setStencilActions = 75;
            OpCodes.setStencilReferenceValue = 76;
            OpCodes.initCubeTexture = 77;
            OpCodes.disposeCubeTexture = 78;
            OpCodes.uploadBytesCubeTexture = 79;
            OpCodes.clearRenderToTexture = 80;
            OpCodes.enableErrorChecking = 81;
            return OpCodes;
        })();
        stagegl.OpCodes = OpCodes;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ProgramFlash = (function (_super) {
            __extends(ProgramFlash, _super);
            function ProgramFlash(context) {
                _super.call(this);

                this._context = context;
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.initProgram));
                this._pId = this._context.execute();
                this._context._iAddResource(this);
            }
            ProgramFlash.prototype.upload = function (vertexProgram, fragmentProgram) {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.uploadAGALBytesProgram, this._pId + away.stagegl.OpCodes.intMask) + vertexProgram.readBase64String(vertexProgram.length) + "%" + fragmentProgram.readBase64String(fragmentProgram.length) + "%");

                if (stagegl.ContextStage3D.debug)
                    this._context.execute();
            };

            ProgramFlash.prototype.dispose = function () {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeProgram, this._pId + away.stagegl.OpCodes.intMask));
                this._context.execute();
                this._context._iRemoveResource(this);

                this._context = null;
            };
            return ProgramFlash;
        })(stagegl.ResourceBaseFlash);
        stagegl.ProgramFlash = ProgramFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ProgramWebGL = (function () {
            function ProgramWebGL(gl) {
                this._gl = gl;
                this._program = this._gl.createProgram();
            }
            ProgramWebGL.prototype.upload = function (vertexProgram, fragmentProgram) {
                var vertexString = ProgramWebGL._aglslParser.parse(ProgramWebGL._tokenizer.decribeAGALByteArray(vertexProgram));
                var fragmentString = ProgramWebGL._aglslParser.parse(ProgramWebGL._tokenizer.decribeAGALByteArray(fragmentProgram));

                this._vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
                this._fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

                this._gl.shaderSource(this._vertexShader, vertexString);
                this._gl.compileShader(this._vertexShader);

                if (!this._gl.getShaderParameter(this._vertexShader, this._gl.COMPILE_STATUS)) {
                    alert(this._gl.getShaderInfoLog(this._vertexShader));
                    return null;
                }

                this._gl.shaderSource(this._fragmentShader, fragmentString);
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

            ProgramWebGL.prototype.dispose = function () {
                this._gl.deleteProgram(this._program);
            };

            ProgramWebGL.prototype.focusProgram = function () {
                this._gl.useProgram(this._program);
            };

            Object.defineProperty(ProgramWebGL.prototype, "glProgram", {
                get: function () {
                    return this._program;
                },
                enumerable: true,
                configurable: true
            });
            ProgramWebGL._tokenizer = new aglsl.AGALTokenizer();
            ProgramWebGL._aglslParser = new aglsl.AGLSLParser();
            return ProgramWebGL;
        })();
        stagegl.ProgramWebGL = ProgramWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var SamplerState = (function () {
            function SamplerState() {
            }
            return SamplerState;
        })();
        stagegl.SamplerState = SamplerState;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var ByteArrayBase = away.utils.ByteArrayBase;

        var TextureFlash = (function (_super) {
            __extends(TextureFlash, _super);
            function TextureFlash(context, width, height, format, forRTT, streaming) {
                if (typeof streaming === "undefined") { streaming = false; }
                _super.call(this);

                this._context = context;
                this._width = width;
                this._height = height;

                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.initTexture, (forRTT ? away.stagegl.OpCodes.trueValue : away.stagegl.OpCodes.falseValue)) + width + "," + height + "," + streaming + "," + format + "$");
                this._pId = this._context.execute();
                this._context._iAddResource(this);
            }
            Object.defineProperty(TextureFlash.prototype, "width", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureFlash.prototype, "height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });

            TextureFlash.prototype.dispose = function () {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeTexture) + this._pId.toString() + ",");
                this._context.execute();
                this._context._iRemoveResource(this);

                this._context = null;
            };

            TextureFlash.prototype.uploadFromData = function (data, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData) {
                    data = data.imageData.data;
                } else if (data instanceof HTMLImageElement) {
                    var can = document.createElement("canvas");
                    var w = data.width;
                    var h = data.height;
                    can.width = w;
                    can.height = h;
                    var ctx = can.getContext("2d");
                    ctx.drawImage(data, 0, 0);
                    data = ctx.getImageData(0, 0, w, h).data;
                }

                var pos = 0;
                var bytes = ByteArrayBase.internalGetBase64String(data.length, function () {
                    return data[pos++];
                }, null);

                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.uploadBytesTexture) + this._pId + "," + miplevel + "," + (this._width >> miplevel) + "," + (this._height >> miplevel) + "," + bytes + "%");
                this._context.execute();
            };
            return TextureFlash;
        })(stagegl.ResourceBaseFlash);
        stagegl.TextureFlash = TextureFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var TextureWebGL = (function (_super) {
            __extends(TextureWebGL, _super);
            function TextureWebGL(gl, width, height) {
                _super.call(this, gl);
                this.textureType = "texture2d";
                this._width = width;
                this._height = height;

                this._glTexture = this._gl.createTexture();
            }
            TextureWebGL.prototype.dispose = function () {
                this._gl.deleteTexture(this._glTexture);
            };

            Object.defineProperty(TextureWebGL.prototype, "width", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureWebGL.prototype, "height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureWebGL.prototype, "frameBuffer", {
                get: function () {
                    if (!this._frameBuffer) {
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
                    }

                    return this._frameBuffer;
                },
                enumerable: true,
                configurable: true
            });

            TextureWebGL.prototype.uploadFromData = function (data, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                if (data instanceof away.base.BitmapData)
                    data = data.imageData;

                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);
                this._gl.texImage2D(this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            };

            TextureWebGL.prototype.uploadCompressedTextureFromByteArray = function (data, byteArrayOffset /*uint*/ , async) {
                if (typeof async === "undefined") { async = false; }
                var ext = this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
                //this._gl.compressedTexImage2D(this._gl.TEXTURE_2D, 0, this)
            };

            Object.defineProperty(TextureWebGL.prototype, "glTexture", {
                get: function () {
                    return this._glTexture;
                },
                enumerable: true,
                configurable: true
            });

            TextureWebGL.prototype.generateMipmaps = function () {
                //TODO: implement generating mipmaps
                //this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
                //this._gl.generateMipmap(this._gl.TEXTURE_2D);
                //this._gl.bindTexture( this._gl.TEXTURE_2D, null );
            };
            return TextureWebGL;
        })(stagegl.TextureBaseWebGL);
        stagegl.TextureWebGL = TextureWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var VertexBufferFlash = (function (_super) {
            __extends(VertexBufferFlash, _super);
            function VertexBufferFlash(context, numVertices, data32PerVertex) {
                _super.call(this);

                this._context = context;
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.initVertexBuffer, data32PerVertex + away.stagegl.OpCodes.intMask) + numVertices.toString() + ",");
                this._pId = this._context.execute();
                this._context._iAddResource(this);
            }
            VertexBufferFlash.prototype.uploadFromArray = function (data, startVertex, numVertices) {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.uploadArrayVertexBuffer, this._pId + away.stagegl.OpCodes.intMask) + data.join() + "#" + [startVertex, numVertices].join() + ",");
                this._context.execute();
            };

            Object.defineProperty(VertexBufferFlash.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBufferFlash.prototype, "data32PerVertex", {
                get: function () {
                    return this._data32PerVertex;
                },
                enumerable: true,
                configurable: true
            });

            VertexBufferFlash.prototype.dispose = function () {
                this._context.addStream(String.fromCharCode(away.stagegl.OpCodes.disposeVertexBuffer, this._pId + away.stagegl.OpCodes.intMask));
                this._context.execute();
                this._context._iRemoveResource(this);

                this._context = null;
            };
            return VertexBufferFlash;
        })(stagegl.ResourceBaseFlash);
        stagegl.VertexBufferFlash = VertexBufferFlash;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (stagegl) {
        var VertexBufferWebGL = (function () {
            function VertexBufferWebGL(gl, numVertices, data32PerVertex) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
            }
            VertexBufferWebGL.prototype.uploadFromArray = function (vertices, startVertex, numVertices) {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);

                //console.log( "** WARNING upload not fully implemented, startVertex & numVertices not considered." );
                // TODO add offsets , startVertex, numVertices * this._data32PerVertex
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
            };

            Object.defineProperty(VertexBufferWebGL.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBufferWebGL.prototype, "data32PerVertex", {
                get: function () {
                    return this._data32PerVertex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBufferWebGL.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });

            VertexBufferWebGL.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };
            return VertexBufferWebGL;
        })();
        stagegl.VertexBufferWebGL = VertexBufferWebGL;
    })(away.stagegl || (away.stagegl = {}));
    var stagegl = away.stagegl;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        var StageEvent = away.events.StageEvent;

        var AGALProgramCache = (function () {
            function AGALProgramCache(stage, agalProgramCacheSingletonEnforcer) {
                if (!agalProgramCacheSingletonEnforcer)
                    throw new Error("This class is a multiton and cannot be instantiated manually. Use StageManager.getInstance instead.");

                this._stage = stage;

                this._program3Ds = new Object();
                this._ids = new Object();
                this._usages = new Object();
                this._keys = new Object();
            }
            AGALProgramCache.getInstance = function (stage) {
                var index = stage._iStageIndex;

                if (AGALProgramCache._instances == null)
                    AGALProgramCache._instances = new Array(8);

                if (!AGALProgramCache._instances[index]) {
                    AGALProgramCache._instances[index] = new AGALProgramCache(stage, new AGALProgramCacheSingletonEnforcer());

                    stage.addEventListener(StageEvent.CONTEXT_DISPOSED, AGALProgramCache.onContextGLDisposed);
                    stage.addEventListener(StageEvent.CONTEXT_CREATED, AGALProgramCache.onContextGLDisposed);
                    stage.addEventListener(StageEvent.CONTEXT_RECREATED, AGALProgramCache.onContextGLDisposed);
                }

                return AGALProgramCache._instances[index];
            };

            AGALProgramCache.getInstanceFromIndex = function (index) {
                if (!AGALProgramCache._instances[index])
                    throw new Error("Instance not created yet!");

                return AGALProgramCache._instances[index];
            };

            AGALProgramCache.onContextGLDisposed = function (event) {
                var stage = event.target;

                var index = stage._iStageIndex;

                AGALProgramCache._instances[index].dispose();
                AGALProgramCache._instances[index] = null;

                stage.removeEventListener(StageEvent.CONTEXT_DISPOSED, AGALProgramCache.onContextGLDisposed);
                stage.removeEventListener(StageEvent.CONTEXT_CREATED, AGALProgramCache.onContextGLDisposed);
                stage.removeEventListener(StageEvent.CONTEXT_RECREATED, AGALProgramCache.onContextGLDisposed);
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
                var stageIndex = this._stage._iStageIndex;
                var program;
                var key = this.getKey(vertexCode, fragmentCode);

                if (this._program3Ds[key] == null) {
                    this._keys[AGALProgramCache._currentId] = key;
                    this._usages[AGALProgramCache._currentId] = 0;
                    this._ids[key] = AGALProgramCache._currentId;
                    ++AGALProgramCache._currentId;

                    program = this._stage.context.createProgram();

                    var vertexByteCode = (new aglsl.assembler.AGALMiniAssembler().assemble("part vertex 1\n" + vertexCode + "endpart"))['vertex'].data;
                    var fragmentByteCode = (new aglsl.assembler.AGALMiniAssembler().assemble("part fragment 1\n" + fragmentCode + "endpart"))['fragment'].data;
                    program.upload(vertexByteCode, fragmentByteCode);

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
            function RTTBufferManager(se, stage) {
                _super.call(this);
                this._viewWidth = -1;
                this._viewHeight = -1;
                this._textureWidth = -1;
                this._textureHeight = -1;
                this._buffersInvalid = true;

                if (!se)
                    throw new Error("No cheating the multiton!");

                this._renderToTextureRect = new away.geom.Rectangle();

                this._stage = stage;
            }
            RTTBufferManager.getInstance = function (stage) {
                if (!stage)
                    throw new Error("stage key cannot be null!");

                if (RTTBufferManager._instances == null)
                    RTTBufferManager._instances = new Array();

                var rttBufferManager = RTTBufferManager.getRTTBufferManagerFromStage(stage);

                if (rttBufferManager == null) {
                    rttBufferManager = new RTTBufferManager(new SingletonEnforcer(), stage);

                    var vo = new RTTBufferManagerVO();

                    vo.stage3d = stage;
                    vo.rttbfm = rttBufferManager;

                    RTTBufferManager._instances.push(vo);
                }

                return rttBufferManager;
            };

            RTTBufferManager.getRTTBufferManagerFromStage = function (stage) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3d === stage)
                        return r.rttbfm;
                }

                return null;
            };

            RTTBufferManager.deleteRTTBufferManager = function (stage) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3d === stage) {
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
                RTTBufferManager.deleteRTTBufferManager(this._stage);

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
                var context = this._stage.context;
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
///<reference path="../../libs/swfobject.d.ts"/>
///<reference path="../aglsl/Sampler.ts"/>
///<reference path="../aglsl/Token.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/OpLUT.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/Description.ts"/>
///<reference path="../aglsl/Destination.ts"/>
///<reference path="../aglsl/Mapping.ts"/>
///<reference path="../aglsl/assembler/OpCode.ts"/>
///<reference path="../aglsl/assembler/OpcodeMap.ts"/>
///<reference path="../aglsl/assembler/Part.ts"/>
///<reference path="../aglsl/assembler/RegMap.ts"/>
///<reference path="../aglsl/assembler/SamplerMap.ts"/>
///<reference path="../aglsl/assembler/AGALMiniAssembler.ts"/>
///<reference path="../aglsl/AGALTokenizer.ts"/>
///<reference path="../aglsl/Parser.ts"/>
///<reference path="core/pool/IndexData.ts" />
///<reference path="core/pool/IndexDataPool.ts" />
///<reference path="core/pool/TextureData.ts"/>
///<reference path="core/pool/TextureDataPool.ts"/>
///<reference path="core/pool/VertexData.ts" />
///<reference path="core/pool/VertexDataPool.ts" />
///<reference path="core/stagegl/ContextGLBase.ts"/>
///<reference path="core/stagegl/ContextGLClearMask.ts"/>
///<reference path="core/stagegl/ContextGLTextureFormat.ts"/>
///<reference path="core/stagegl/ContextGLTriangleFace.ts"/>
///<reference path="core/stagegl/ContextGLVertexBufferFormat.ts"/>
///<reference path="core/stagegl/ContextGLProgramType.ts"/>
///<reference path="core/stagegl/ContextGLBlendFactor.ts"/>
///<reference path="core/stagegl/ContextGLCompareMode.ts"/>
///<reference path="core/stagegl/ContextGLMipFilter.ts"/>
///<reference path="core/stagegl/ContextGLProfile.ts"/>
///<reference path="core/stagegl/ContextGLStencilAction.ts"/>
///<reference path="core/stagegl/ContextGLTextureFilter.ts"/>
///<reference path="core/stagegl/ContextGLWrapMode.ts"/>
///<reference path="core/stagegl/ContextStage3D.ts" />
///<reference path="core/stagegl/ContextWebGL.ts" />
///<reference path="core/stagegl/ResourceBaseFlash.ts"/>
///<reference path="core/stagegl/TextureBaseWebGL.ts"/>
///<reference path="core/stagegl/CubeTextureFlash.ts" />
///<reference path="core/stagegl/CubeTextureWebGL.ts" />
///<reference path="core/stagegl/IContextStageGL.ts" />
///<reference path="core/stagegl/ICubeTexture.ts" />
///<reference path="core/stagegl/IIndexBuffer.ts"/>
///<reference path="core/stagegl/IndexBufferFlash.ts"/>
///<reference path="core/stagegl/IndexBufferWebGL.ts"/>
///<reference path="core/stagegl/IProgram.ts"/>
///<reference path="core/stagegl/ITexture.ts" />
///<reference path="core/stagegl/ITextureBase.ts"/>
///<reference path="core/stagegl/IVertexBuffer.ts"/>
///<reference path="core/stagegl/OpCodes.ts"/>
///<reference path="core/stagegl/ProgramFlash.ts"/>
///<reference path="core/stagegl/ProgramWebGL.ts"/>
///<reference path="core/stagegl/SamplerState.ts"/>
///<reference path="core/stagegl/TextureFlash.ts" />
///<reference path="core/stagegl/TextureWebGL.ts" />
///<reference path="core/stagegl/VertexBufferFlash.ts"/>
///<reference path="core/stagegl/VertexBufferWebGL.ts"/>
///<reference path="managers/AGALProgramCache.ts"/>
///<reference path="managers/RTTBufferManager.ts"/>
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
