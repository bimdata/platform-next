const AVAILABLE_PLUGINS = Object.freeze({
  idex: "https://unpkg.com/@bimdata/idex-viewer-plugin@2.0.0",
  iot: "https://unpkg.com/@bimdata/iot-viewer-plugin@1.0.13",
});

/**
 * List of available viewer windows.
 */
const WINDOWS = Object.freeze({
  DWG: "dwg",
  DXF: "dxf",
  IFC2D: "2d",
  IFC3D: "3d",
  PLAN: "plan",
  POINT_CLOUD: "pointCloud"
});

/**
 * Viewer window that will be opened by default
 * if none is specified.
 */
const DEFAULT_WINDOW = WINDOWS.IFC3D;

const translateIfcType = ENV.VUE_APP_TRANSLATE_IFC_TYPE === "true";

const PLUGINS_CONFIG = {
  accessMarketplace: true,
  bcfManager: true,
  buildingMaker: true,
  header: {
    warnings: false
  },
  properties: {
    editProperties: true,
    translateIfcEntities: translateIfcType,
  },
  split: true,
  structure: {
    export: true,
    merge: true
  },
  "structure-properties": {
    editProperties: true,
    translateIfcEntities: translateIfcType,
    export: true,
    merge: true
  },
  "viewer2d-background": true,
  viewer3d: {
    enableDynamicLOD: true
  }
};

export { AVAILABLE_PLUGINS, DEFAULT_WINDOW, PLUGINS_CONFIG, WINDOWS };
