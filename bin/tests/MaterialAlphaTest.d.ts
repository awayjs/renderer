/// <reference path="../../lib/Away3D.next.d.ts" />
declare module demos.materials {
    class MaterialAlphaTest {
        private height;
        private token;
        private view;
        private raf;
        private mesh;
        private meshes;
        private loadedMeshMaterial;
        private multiMat;
        private light;
        private lightB;
        private t800M;
        private aValues;
        private aValuesP;
        constructor();
        private mouseDown();
        private t;
        private render();
        private torusTextureMaterial;
        private torusColorMaterial;
        private staticLightPicker;
        public onResourceComplete(e: away.events.LoaderEvent): void;
        public capsuleColorMAterial: away.materials.ColorMaterial;
        public resize(): void;
    }
}
