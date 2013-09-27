/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.net {
    class LoaderTest {
        private urlLoaderPostURLVars;
        private urlLoaderGetCSV;
        private urlLoaderErrorTest;
        private urlLoaderGetURLVars;
        private urlLoaderBinary;
        private urlLoaderBlob;
        private urlLoaderArrb;
        constructor();
        private arrayBufferLoaded(event);
        private blobFileLoaded(event);
        private createObjectURL(fileBlob);
        private binFileLoaded(event);
        private getURLVarsComplete(event);
        private httpStatusChange(event);
        private ioError(event);
        private errorComplete(event);
        private postURLTestComplete(event);
        private getCsvComplete(event);
        private getCsvOpen(event);
    }
}
