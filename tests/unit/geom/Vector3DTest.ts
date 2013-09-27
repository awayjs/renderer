///<reference path="../../../src/away/_definitions.ts" />
///<reference path="../tsUnit.ts" />

module tests.unit.geom
{

	export class Vector3DTest extends tests.unit.tsUnit.TestClass
	{

        construct() : void
        {
            var m:away.geom.Vector3D = new away.geom.Vector3D();
            this.areIdentical( m.x, 0 );
            this.areIdentical( m.y, 0 );
            this.areIdentical( m.z, 0 );
            this.areIdentical( m.w, 0 );

            var m:away.geom.Vector3D = new away.geom.Vector3D(1 , 2 , 3 , 4 );
            this.areIdentical( m.x, 1 );
            this.areIdentical( m.y, 2 );
            this.areIdentical( m.z, 3 );
            this.areIdentical( m.w, 4 );
        }

        public getLength(): void
        {
            var m:away.geom.Vector3D

            m = new away.geom.Vector3D();
            this.areIdentical(m.length, 0 );

            m = new away.geom.Vector3D(1 , 2 , 3 , 4 );
            this.areIdentical(m.length, 3.7416573867739413 );

            m = new away.geom.Vector3D(5 , 6 , 7 , 8 );
            this.areIdentical(m.length, 10.488088481701515 );

        }

        public getLengthSquared(): void
        {

            var m:away.geom.Vector3D

            m = new away.geom.Vector3D();
            this.areIdentical(m.lengthSquared, 0 );

            m = new away.geom.Vector3D(1 , 2 , 3 , 4 );
            this.areIdentical(m.lengthSquared, 14 );

            m = new away.geom.Vector3D(5 , 6 , 7 , 8 );
            this.areIdentical(m.lengthSquared, 110 );

        }

        public add():void
        {

            var m       : away.geom.Vector3D;
            var t       : away.geom.Vector3D;
            var result  : away.geom.Vector3D;

            m = new away.geom.Vector3D( 2,2,2,2);
            t = new away.geom.Vector3D( 1,2,3,4);

            result = m.add( t )


            this.areIdentical(result.x , 3 );
            this.areIdentical(result.y , 4 );
            this.areIdentical(result.z , 5 );
            this.areIdentical(result.w , 6 );


        }

        public angleBetween() : void
        {

            var m       : away.geom.Vector3D;
            var t       : away.geom.Vector3D;
            var result  : away.geom.Vector3D;

            m = new away.geom.Vector3D( 2,2,2,2);
            t = new away.geom.Vector3D( 1,2,3,4);

            this.areIdentical( away.geom.Vector3D.angleBetween( m , t ) , 0.3875966866551805 );

        }

        public clone(): void
        {

            var m       : away.geom.Vector3D;
            var result  : away.geom.Vector3D;

            m = new away.geom.Vector3D( 2,3,4,5);

            result = m.clone();

            this.areIdentical(result.x , m.x );
            this.areIdentical(result.y , m.y );
            this.areIdentical(result.z , m.z );
            this.areIdentical(result.w , m.w );
        }

        public copyFrom():void
        {


            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2,3,4,5);
            var result  : away.geom.Vector3D = new away.geom.Vector3D();

            result.copyFrom(m);

            this.areIdentical(result.x , 2 );
            this.areIdentical(result.y , 3 );
            this.areIdentical(result.z , 4 );
            this.areIdentical(result.w , 5 );

            //console.log( 'copyFrom' , result.x , result.y , result.z , result.w);

        }


        public crossProduct() : void
        {
            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var result  : away.geom.Vector3D = m.crossProduct( n );

            this.areIdentical(result.x , 1 );
            this.areIdentical(result.y , -2 );
            this.areIdentical(result.z , 1 );
            this.areIdentical(result.w , 1 );


        }

        public decrementBy() : void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );

            m.decrementBy( n );

            this.areIdentical(m.x , 1 );
            this.areIdentical(m.y , 1 );
            this.areIdentical(m.z , 1 );
            this.areIdentical(m.w , 5 );

        }

        public distance(): void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );

            this.areIdentical(away.geom.Vector3D.distance( m , n ) , 1.7320508075688772 );

        }


        public dotProduct() : void
        {
            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );

            this.areIdentical( m.dotProduct( n )  , 20 );

        }

        public equals() : void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            this.areIdentical( m.equals( n )  , false );
            this.areIdentical( n.equals( o , true )  , true );
            this.areIdentical( n.equals( p , true )  , false );

        }

        public incrementBy()
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            m.incrementBy( p );

            this.areIdentical( m.x  , 3 );
            this.areIdentical( m.y  , 5 );
            this.areIdentical( m.z  , 7 );
            this.areIdentical( m.w  , 5 );

        }

        public nearEquals()
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );


            this.areIdentical( m.nearEquals( n , 1 ) , false );
            this.areIdentical( m.nearEquals( n , 1.5 ) , true );
            this.areIdentical( m.nearEquals( n ,.5 ) , false );

            this.areIdentical( o.nearEquals( p ,.5 ) , false );
            this.areIdentical( o.nearEquals( p ,.5 , false ) , true );
            //this.areIdentical( p.nearEquals( p ,.5 ) , false );


        }

        public negate(): void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            m.negate();

            this.areIdentical( m.x  , -2 );
            this.areIdentical( m.y  , -3 );
            this.areIdentical( m.z  , -4 );
            this.areIdentical( m.w  , 5 );

        }

        public normalize(): void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            m.normalize();

            this.areIdentical( m.x  , 0.3713906763541037 );
            this.areIdentical( m.y  , 0.5570860145311556 );
            this.areIdentical( m.z  , 0.7427813527082074 );
            this.areIdentical( m.w  , 5 );

        }

        public project(): void
        {
            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            m.project();

            this.areIdentical( m.x  , 0.4);
            this.areIdentical( m.y  , 0.6);
            this.areIdentical( m.z  , 0.8);
            this.areIdentical( m.w  , 5 );

        }

        public scaleBy() : void
        {

            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            m.scaleBy( 2 );

            this.areIdentical( m.x  , 4);
            this.areIdentical( m.y  , 6);
            this.areIdentical( m.z  , 8);
            this.areIdentical( m.w  , 5 );

        }

        public setTo() : void
        {
            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            n.setTo( 2 , 3 , 4 );

            this.areIdentical( n.x  , 2);
            this.areIdentical( n.y  , 3);
            this.areIdentical( n.z  , 4);
            this.areIdentical( m.w  , 5 );

        }

        public subtract() : void
        {
            var m       : away.geom.Vector3D = new away.geom.Vector3D( 2 , 3 , 4 , 5);
            var n       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var o       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 4 );
            var p       : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 , 1 );

            n.subtract( m );

            this.areIdentical( n.x  , 1);
            this.areIdentical( n.y  , 2);
            this.areIdentical( n.z  , 3);
            this.areIdentical( n.w  , 4);
        }

	}
}