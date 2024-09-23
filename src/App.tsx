import {useEffect} from "react";
import {
    Scene,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    PerspectiveCamera,
    Matrix4,
    InstancedMesh
} from "three";
import {AxesHelper} from "three/src/helpers/AxesHelper";
import {
    MapControls
} from "three/examples/jsm/controls/OrbitControls";
import * as Geo from "geo-three";
import "./styles.css";

export default function App() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 5, 50000);
    camera.position.z = 100;
    const provider = new Geo.OpenStreetMapsProvider();
    const map = new Geo.MapView(Geo.MapView.PLANAR, provider);
    map.lod = new Geo.LODFrustum();
    scene.add(map);

    const axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (document.querySelector('canvas')) return
    document.body.appendChild(renderer.domElement);

    const controls = new MapControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 10000;
    controls.enablePan = true;
    controls.update();
    const coords = Geo.UnitsUtils.datumsToSpherical(52.601735, 39.589755);
    controls.target.set(coords.x, 0, -coords.y);
    camera.position.set(coords.x, 1, -coords.y);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({color: 0x00ffff});
    const count = 3000110;
    const mesh = new InstancedMesh(geometry, material, count);

    const matrix = new Matrix4();
    for (let i = 0; i < count; i++) {
        matrix.setPosition(
            coords.x + Math.random() * 1000 - 50,
            Math.random() * 50,
            -coords.y + Math.random() * 1000 - 50
        );
        mesh.setMatrixAt(i, matrix);
    }

    scene.add(mesh);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}
