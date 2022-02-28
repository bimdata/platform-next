const AVAILABLE_PLUGINS = Object.freeze({
  backgroundColor:
    "https://unpkg.com/@bimdata/background-color-viewer-plugin@1.0.1",
  bimobject: "https://unpkg.com/@bimdata/bimobject-viewer-plugin@1.0.1",
  gltfExtractor:
    "https://unpkg.com/@bimdata/gltf-extractor-viewer-plugin@1.0.2",
  idex: "https://unpkg.com/@bimdata/idex-viewer-plugin@1.0.7",
  iot: "https://unpkg.com/@bimdata/iot-viewer-plugin@1.0.9",
  realiz3D: "https://unpkg.com/@bimdata/realiz3d-viewer-plugin@0.0.2",
  svgExtractor: "https://unpkg.com/@bimdata/svg-extractor-viewer-plugin@1.0.2"
});

const WINDOWS = Object.freeze({
  DWG: "dwg",
  PLAN: "plan",
  V2D: "2d",
  V3D: "3d"
});

const DEFAULT_WINDOW = WINDOWS.V3D;

export { AVAILABLE_PLUGINS, DEFAULT_WINDOW, WINDOWS };