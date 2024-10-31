import "cesium/Build/Cesium/Widgets/widgets.css";
import ThreeScene from '/@/threeVersion/threeScene';


const threeScene = new ThreeScene();
threeScene.cesiumScene.initCesium();
threeScene.initThree();
threeScene.init3DObject();
threeScene.loop();