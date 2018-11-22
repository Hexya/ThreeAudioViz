// example import asset
// import imgPath from './assets/img.jpg';
 import imgMap from '../assets/Texture/N-1.jpg';
 import imgColor from '../assets/Texture/AColor.jpg';
 import imgDisp from '../assets/Texture/ADisp.png';
 import soundFile from '../assets/sound/HowDoYouWant.mp3';
 import Sound from './Sound.js';
 let OrbitControls = require('three-orbit-controls')(THREE)


// TODO : add Dat.GUI
// TODO : add Stats

class LoadSound {
    constructor() {
        this.sound = new Sound(soundFile,92,0,this.startSound.bind(this),true)
    }
    startSound() {
        this.sound.play();
    }
}

export default class App {

    constructor() {

        this.cubic = [];
        this.velocity = [];

        this.play = new LoadSound();

        console.log(this.play)

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

        this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

    	this.light = new THREE.DirectionalLight({color: 0xffffff,intensity : 1})
        this.secLight = new THREE.PointLight( 0x00ddff, 1, 100 )
        this.scene.add(this.light)
        this.scene.add(this.secLight)

            let geometry = new THREE.SphereGeometry( 0.2, .2, 200 );
            let textureLoader = new THREE.TextureLoader();
            let texture = textureLoader.load(imgMap);
            let textureColor = textureLoader.load(imgColor);
            let textureDisp = textureLoader.load(imgDisp);
            let material = new THREE.MeshPhongMaterial({
                normalMap: texture,
                map: textureColor,
                displacementMap: textureDisp,
                displacementScale: 3,
                normalScale: new THREE.Vector2(1, 1)
            });
	        //let material = new THREE.MeshNormalMaterial();

        for(var i=0; i<50; i++) {
    	    let mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = 0 + 1 * Math.cos(-THREE.Math.randFloat(0, 180)*Math.PI/180)* .5;
            mesh.position.y = 0 + 1 * Math.sin(-5*Math.PI/180)* .5;
            mesh.position.z = THREE.Math.randFloat(-.5, .5)
            let velo = THREE.Math.randFloat(-5, 5);
            this.velocity.push(velo)
            let scale = THREE.Math.randFloat(.03, .1)
            mesh.scale.set(scale, scale, scale)
    	    this.cubic.push(mesh)
            this.scene.add( mesh);
        }
        //console.log(this.scene)
        //console.log(this.velocity)
        //console.log(this.cubic)

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    render() {
        //console.log(this.play.sound.frequencyDataArray)

        let time = Date.now()/1000;
        for(var i=0; i<50; i++) {
            this.cubic[i].rotation.x = Math.cos(time)* i/100;
            this.cubic[i].rotation.y = Math.sin(time) * i/100;

            this.cubic[i].position.x += Math.sin(time)* this.velocity[i]/1000;
            this.cubic[i].position.y += (Math.cos(time)+.5)* this.velocity[i+10]/1000;
            this.cubic[i].position.z += Math.cos(time)* this.velocity[i+5]/1000;

            this.cubic[i].material.displacementScale = 1.5+(this.play.sound.frequencyDataArray[1]/250*Math.sin(time))
        }

        this.controls.update()

        //this.camera.rotation.x = Math.sin(time)/10;
        //this.camera.rotation.y = Math.cos(time)/10;
        //this.camera.rotation.z = Math.sin(time)/10;

    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
