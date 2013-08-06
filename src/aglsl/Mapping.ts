/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Mapping
	{
		static agal2glsllut:aglsl.OpLUT[] = [
			
			//         s 												flags   dest    a     b 	    mw 	  mh    ndwm  scale dm	  lod
			new OpLUT( "%dest = %cast(%a);\n", 							0, 		true,	true, false, 	null, null, null, null, null, null ), //mov
			new OpLUT( "%dest = %cast(%a + %b);\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //add
			new OpLUT( "%dest = %cast(%a - %b);\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //sub
			new OpLUT( "%dest = %cast(%a * %b);\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //mul
			new OpLUT( "%dest = %cast(%a / %b);\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //div
			new OpLUT( "%dest = %cast(1.0) / %a;\n", 					0, 		true, 	true, false, 	null, null, null, null, null, null ), //rcp
			new OpLUT( "%dest = %cast(min(%a,%b));\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //min
			new OpLUT( "%dest = %cast(min(%a,%b));\n", 					0, 		true, 	true, true , 	null, null, null, null, null, null ), //max
			new OpLUT( "%dest = %cast(fract(%a));\n", 					0, 		true, 	true, false, 	null, null, null, null, null, null ), //frc
			new OpLUT( "%dest = %cast(sqrt(abs(%a)));\n",				0, 		true, 	true, false, 	null, null, null, null, null, null ), //sqt
			new OpLUT( "%dest = %cast(inversesqrt(abs(%a)));\n",		0, 		true, 	true, false, 	null, null, null, null, null, null ), //rsq
			new OpLUT( "%dest = %cast(pow(abs(%a),%b));\n",				0, 		true, 	true, true , 	null, null, null, null, null, null ), //pow
			new OpLUT( "%dest = %cast(log2(abs(%a)));\n",				0, 		true, 	true, false, 	null, null, null, null, null, null ), //log
			new OpLUT( "%dest = %cast(exp2(%a));\n",					0, 		true, 	true, false, 	null, null, null, null, null, null ), //exp
			
			//         s 												flags  	dest    a     b 	    mw 	  mh    ndwm  scale dm	  lod
			new OpLUT( "%dest = %cast(normalize(%a));\n",				0, 	   	true, 	true, false, 	null, null, true, null, null, null ), //nrm
			new OpLUT( "%dest = %cast(sin(%a));\n"		,				0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //sin
			new OpLUT( "%dest = %cast(cos(%a));\n"		,				0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //cos
			new OpLUT( "%dest = %cast(cross(vec3(%a),vec3(%b)));\n",	0, 	   	true, 	true, true, 	null, null, true, null, null, null ), //crs
			new OpLUT( "%dest = %cast(dot(vec3(%a),vec3(%b)));\n",		0, 	   	true, 	true, true, 	null, null, true, null, null, null ), //dp3
			new OpLUT( "%dest = %cast(dot(vec4(%a),vec4(%b)));\n",		0, 	   	true, 	true, true, 	null, null, true, null, null, null ), //dp4
			new OpLUT( "%dest = %cast(abs(%a));\n",						0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //abs
			new OpLUT( "%dest = %cast(%a * -1.0);\n",					0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //neg
			new OpLUT( "%dest = %cast(%a * -1.0);\n",					0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //sat
			
			new OpLUT( "%dest = %cast(%a * -1.0);\n",					0, 	   	true, 	true, true, 	3, 	  3,    true, null, null, null ), //m33
			new OpLUT( "%dest = %cast(%a * -1.0);\n",					0, 	   	true, 	true, true, 	4, 	  4,    true, null, null, null ), //m44
			new OpLUT( "%dest = %cast(%a * -1.0);\n",					0, 	   	true, 	true, true, 	4, 	  3,    true, null, null, null ), //m43
			
			new OpLUT( "%dest = %cast(dFdx(%a));\n",					0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //dFdx
			new OpLUT( "%dest = %cast(dFdx(%a));\n",					0, 	   	true, 	true, false, 	null, null, null, null, null, null ), //dFdx
			
			new OpLUT( "if (float(%a)==float(%b)) {;\n",				0, 	   	false, 	true, true, 	null, null, null, true, null, null ),
			new OpLUT( "if (float(%a)!=float(%b)) {;\n",				0, 	   	false, 	true, true, 	null, null, null, true, null, null ),
			new OpLUT( "if (float(%a)>=float(%b)) {;\n",				0, 	   	false, 	true, true, 	null, null, null, true, null, null ),
			new OpLUT( "if (float(%a)<float(%b)) {;\n",					0, 	   	false, 	true, true, 	null, null, null, true, null, null ),
			new OpLUT( "} else {;\n",									0, 	   	false, 	false,false, 	null, null, null, null, null, null ),
			new OpLUT( "};\n",											0, 	   	false, 	false,false, 	null, null, null, null, null, null ),
			new OpLUT( null,											null, 	null, 	null, false, 	null, null, null, null, null, null ),
			new OpLUT( null,											null, 	null, 	null, false, 	null, null, null, null, null, null ),
			new OpLUT( null,											null, 	null, 	null, false, 	null, null, null, null, null, null ),
			new OpLUT( null,											null, 	null, 	null, false, 	null, null, null, null, null, null ),
			
			//         s 															flags  	dest    a     b 	    mw 	  mh    ndwm  scale dm	  lod 
			new OpLUT( "%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n",	null,  	true, 	true, true, 	null, null, null, null, true, null ),
			new OpLUT( "if ( float(%a)<0.0 ) discard;\n",							null,  	false, 	true, false, 	null, null, null, true, null, null ),
			new OpLUT( "%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n",	null,  	true, 	true, true, 	null, null, null, null, null, true ),
			new OpLUT( "%dest = %cast(greaterThanEqual(%a,%b).%dm);\n",				0,  	true, 	true, true, 	null, null, true, null, true, null ),
			new OpLUT( "%dest = %cast(lessThan(%a,%b).%dm);\n",						0,  	true, 	true, true, 	null, null, true, null, true, null ),
			new OpLUT( "%dest = %cast(sign(%a));\n",								0,  	true, 	true, false, 	null, null, null, null, null, null ),
			new OpLUT( "%dest = %cast(equal(%a,%b).%dm);\n",						0,  	true, 	true, false, 	null, null, true, null, true, null ),
			new OpLUT( "%dest = %cast(notEqual(%a,%b).%dm);\n",						0,  	true, 	true, true, 	null, null, true, null, true, null ),
			
			];
	}
}

/*
{ s:"%dest = %cast(%a);\n", flags:0, dest:true, a:true, b:false }, // mov
{ s:"%dest = %cast(%a + %b);\n", flags:0, dest:true, a:true, b:true }, // add
{ s:"%dest = %cast(%a - %b);\n", flags:0, dest:true, a:true, b:true }, // sub
{ s:"%dest = %cast(%a * %b);\n", flags:0, dest:true, a:true, b:true }, // mul
{ s:"%dest = %cast(%a / %b);\n", flags:0, dest:true, a:true, b:true }, // div
{ s:"%dest = %cast(1.0) / %a;\n", flags:0, dest:true, a:true, b:false }, // rcp
{ s:"%dest = %cast(min(%a,%b));\n", flags:0, dest:true, a:true, b:true }, // min
{ s:"%dest = %cast(max(%a,%b));\n", flags:0, dest:true, a:true, b:true }, // max
{ s:"%dest = %cast(fract(%a));\n", flags:0, dest:true, a:true, b:false }, // frc
{ s:"%dest = %cast(sqrt(abs(%a)));\n", flags:0, dest:true, a:true, b:false }, // sqt
{ s:"%dest = %cast(inversesqrt(abs(%a)));\n", flags:0, dest:true, a:true, b:false }, // rsq
{ s:"%dest = %cast(pow(abs(%a),%b));\n", flags:0, dest:true, a:true, b:true }, // pow
{ s:"%dest = %cast(log2(abs(%a)));\n", flags:0, dest:true, a:true, b:false }, // log
{ s:"%dest = %cast(exp2(%a));\n", flags:0, dest:true, a:true, b:false }, // exp
*/

/*
{ s:"%dest = %cast(normalize(%a));\n", flags:0, dest:true, a:true, b:false, ndwm:true }, // nrm
{ s:"%dest = %cast(sin(%a));\n", flags:0, dest:true, a:true, b:false }, // sin
{ s:"%dest = %cast(cos(%a));\n", flags:0, dest:true, a:true, b:false }, // cos
{ s:"%dest = %cast(cross(vec3(%a),vec3(%b)));\n", flags:0, dest:true, a:true, b:true, ndwm:true }, // crs 
{ s:"%dest = %cast(dot(vec3(%a),vec3(%b)));\n", flags:0, dest:true, a:true, b:true, ndwm:true }, // dp3
{ s:"%dest = %cast(dot(vec4(%a),vec4(%b)));\n", flags:0, dest:true, a:true, b:true, ndwm:true }, // dp4
{ s:"%dest = %cast(abs(%a));\n", flags:0, dest:true, a:true, b:false }, // abs
{ s:"%dest = %cast(%a * -1.0);\n", flags:0, dest:true, a:true, b:false }, // neg
{ s:"%dest = %cast(clamp(%a,0.0,1.0));\n", flags:0, dest:true, a:true, b:false }, // sat
{ s:"%dest = %cast(dot(vec3(%a),vec3(%b)));\n", matrixwidth:3, matrixheight:3, dest:true, a:true, b:true, ndwm:true }, // m33 (uses dp3)
{ s:"%dest = %cast(dot(vec4(%a),vec4(%b)));\n", matrixwidth:4, matrixheight:4, dest:true, a:true, b:true, ndwm:true }, // m44 (uses dp4)
{ s:"%dest = %cast(dot(vec4(%a),vec4(%b)));\n", matrixwidth:4, matrixheight:3, dest:true, a:true, b:true, ndwm:true }, // m43 (uses dp4)
*/

/*
{ s:"%dest = %cast(dFdx(%a));\n", flags:0, dest:true, a:true, b:false }, // dFdx
{ s:"%dest = %cast(dFdy(%a));\n", flags:0, dest:true, a:true, b:false }, // dFdx  
{ s:"if (float(%a)==float(%b)) {;\n", flags:0, dest:false, a:true, b:true, scalar:true }, 
{ s:"if (float(%a)!=float(%b)) {;\n", flags:0, dest:false, a:true, b:true, scalar:true },
{ s:"if (float(%a)>=float(%b)) {;\n", flags:0, dest:false, a:true, b:true, scalar:true },
{ s:"if (float(%a)<float(%b)) {;\n", flags:0, dest:false, a:true, b:true, scalar:true },
{ s:"} else {;\n", flags:0, dest:false, a:false, b:false }, 
{ s:"};\n", flags:0, dest:false, a:false, b:false }, 
{ },
{ },
{ },
{ },
*/

/*
//{ s:"%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n", dest:true, a:true, b:true, dm:true },
//{ s:"if ( float(%a)<0.0 ) discard;\n", dest:false, a:true, b:false, scalar:true },
//{ s:"%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n", dest:true, a:true, b:true, lod:true, dm:true, ndwm:true },
//{ s:"%dest = %cast(greaterThanEqual(%a,%b).%dm);\n", flags:0, dest:true, a:true, b:true, dm:true, ndwm:true }, 
//{ s:"%dest = %cast(lessThan(%a,%b).%dm);\n", flags:0, dest:true, a:true, b:true, dm:true, ndwm:true }, 
//{ s:"%dest = %cast(sign(%a));\n", flags:0, dest:true, a:true, b:false }, 
//{ s:"%dest = %cast(equal(%a,%b).%dm);\n", flags:0, dest:true, a:true, b:true, dm:true, ndwm:true }, 
//{ s:"%dest = %cast(notEqual(%a,%b).%dm);\n", flags:0, dest:true, a:true, b:true, dm:true, ndwm:true }
// ....
*/