/// <reference path="../../lib/Away3D.next.d.ts" />
declare module demos.parsers {
    class ObjChiefTestDay {
        private height;
        private token;
        private view;
        private raf;
        private mesh;
        private meshes;
        private mat;
        private terrainMaterial;
        private multiMat;
        private light;
        private t800M;
        private spartan;
        private terrain;
        constructor();
        private t;
        private render();
        public onAssetComplete(e: away.events.AssetEvent): void;
        private spartanFlag;
        private terrainObjFlag;
        public onResourceComplete(e: away.events.LoaderEvent): void;
        public resize(): void;
    }
}
