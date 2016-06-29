System.config({
    defaultJSExtensions: true,
    baseURL: "../",
    typescriptOptions: {
        "moduleResolution": "node",
        "typeCheck": true,
        "files": [
            "bundles/awayjs-bundle.d.ts"
        ]
    },
    paths: {
        "github:*": "jspm_packages/github/*",
        "npm:*": "jspm_packages/npm/*",
    },
    packages: {
        "bundles": {
            defaultExtension: "js",
            meta: {
                "*.d.ts": {
                    loader: "ts"
                }
            },
        },
        "tests": {
            defaultExtension: "ts",
            meta: {
                "*.ts": {
                    loader: "ts"
                }
            },
        },
        "ts": {
            defaultExtension: "js",
        }
    },
    map: {
        "ts": "github:frankwallis/plugin-typescript@4.0.16",
        "typescript": "npm:typescript@1.8.10",
        "github:frankwallis/plugin-typescript@4.0.16": {
            "typescript": "npm:typescript@1.8.10"
        },
        "npm:typescript@1.8.10": {
            "os": "github:jspm/nodelibs-os@0.1.0"
        },
        "github:jspm/nodelibs-os@0.1.0": {
            "os-browserify": "npm:os-browserify@0.1.2"
        },
        "npm:os-browserify@0.1.2": {
            "os": "github:jspm/nodelibs-os@0.1.0"
        },
        "npm:typescript@1.8.10": {
            "os": "github:jspm/nodelibs-os@0.1.0"
        }
    }
});
