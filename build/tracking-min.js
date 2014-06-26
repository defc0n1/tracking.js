/**
 * tracking.js - Augmented Reality JavaScript Framework.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v0.0.1
 * @link http://trackingjs.com
 * @license BSD
 */
!function(r){r.tracking=r.tracking||{},tracking.forEach=function(r,t,n){var a;if(Array.isArray(r))r.forEach(function(){t.apply(n,arguments)});else for(a in r)r.hasOwnProperty(a)&&t.call(n,r[a],a,r);return r},tracking.inherits=function(r,t){function n(){}n.prototype=t.prototype,r.superClass_=t.prototype,r.prototype=new n,r.prototype.constructor=r,r.base=function(r,n){var a=Array.prototype.slice.call(arguments,2);return t.prototype[n].apply(r,a)}},tracking.initUserMedia_=function(t,n){r.navigator.getUserMedia({video:!0,audio:n.audio},function(n){try{t.src=r.URL.createObjectURL(n)}catch(a){t.src=n}},function(){throw Error("Cannot capture user camera.")})},tracking.isNode=function(r){return r.nodeType||this.isWindow(r)},tracking.isWindow=function(r){return!!(r&&r.alert&&r.document)},tracking.merge=function(r,t){for(var n in t)r[n]=t[n];return r},tracking.one=function(r,t){return this.isNode(r)?r:(t||document).querySelector(r)},tracking.track=function(r,t,n){if(r=tracking.one(r),!r)throw new Error("Element not found, try a different element or selector.");if(!t)throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");switch(r.nodeName.toLowerCase()){case"canvas":return this.trackCanvas_(r,t,n);case"img":return this.trackImg_(r,t,n);case"video":return n&&n.camera&&this.initUserMedia_(r,n),this.trackVideo_(r,t,n);default:throw new Error("Element not supported, try in a canvas, img, or video.")}},tracking.trackCanvas_=function(r,t){var n=r.width,a=r.height,i=r.getContext("2d"),e=i.getImageData(0,0,n,a);t.track(e.data,n,a)},tracking.trackImg_=function(r,t){var n=r.width,a=r.height,i=document.createElement("canvas");i.width=n,i.height=a,tracking.Canvas.loadImage(i,r.src,0,0,n,a,function(){tracking.trackCanvas_(i,t)})},tracking.trackVideo_=function(t,n){var a=document.createElement("canvas"),i=a.getContext("2d"),e=t.offsetWidth,o=t.offsetHeight;a.width=e,a.height=o,r.requestAnimationFrame(function(){t.readyState===t.HAVE_ENOUGH_DATA&&(i.drawImage(t,0,0,e,o),tracking.trackCanvas_(a,n)),tracking.trackVideo_(t,n)})},r.self.Int8Array||(r.self.Int8Array=Array),r.self.Uint8Array||(r.self.Uint8Array=Array),r.self.Uint8ClampedArray||(r.self.Uint8ClampedArray=Array),r.self.Uint16Array||(r.self.Uint16Array=Array),r.self.Int32Array||(r.self.Int32Array=Array),r.self.Uint32Array||(r.self.Uint32Array=Array),r.self.Float32Array||(r.self.Float32Array=Array),r.self.Float64Array||(r.self.Float64Array=Array),r.URL||(r.URL=r.URL||r.webkitURL||r.msURL||r.oURL),navigator.getUserMedia||(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia)}(window),function(){tracking.Brief={},tracking.Brief.N=128,tracking.Brief.randomOffsets_={},tracking.Brief.getDescriptors=function(r,t,n){for(var a=new Int32Array(n.length*(this.N>>5)),i=0,e=this.getRandomOffsets_(t),o=0,c=0;c<n.length;c+=2)for(var s=t*n[c+1]+n[c],g=0,f=this.N;f>g;g++)r[e[g+g]+s]<r[e[g+g+1]+s]&&(i|=1<<(31&g)),g+1&31||(a[o++]=i,i=0);return a},tracking.Brief.match=function(r,t,n,a){for(var i=r.length>>1,e=n.length>>1,o=new Int32Array(i),c=0;i>c;c++){for(var s=1/0,g=0,f=0;e>f;f++){for(var k=0,u=0,l=this.N>>5;l>u;u++)k+=tracking.Math.hammingWeight(t[c*l+u]^a[f*l+u]);s>k&&(s=k,g=f)}o[c]=g}return o},tracking.Brief.getRandomOffsets_=function(r){if(this.randomOffsets_[r])return this.randomOffsets_[r];for(var t=new Int32Array(2*this.N),n=0,a=0;a<this.N;a++)t[n++]=tracking.Math.uniformRandom(-15,16)*r+tracking.Math.uniformRandom(-15,16),t[n++]=tracking.Math.uniformRandom(-15,16)*r+tracking.Math.uniformRandom(-15,16);return this.randomOffsets_[r]=t,this.randomOffsets_[r]}}(),function(){tracking.Canvas={},tracking.Canvas.loadImage=function(r,t,n,a,i,e,o){var c=this,s=new window.Image;r.width=i,r.height=e,s.onload=function(){var t=r.getContext("2d");t.drawImage(s,n,a,i,e),o&&o.call(c),s=null},s.src=t}}(),function(){tracking.EPnP={},tracking.EPnP.solve=function(){}}(),function(){tracking.Fast={},tracking.Fast.FAST_THRESHOLD=20,tracking.Fast.circles_={},tracking.Fast.findCorners=function(r,t,n){var a,i,e,o,c=this.getCircle_(t),s=new Int32Array(16),g=[],f=0;for(a=3;n-3>a;a++)for(i=3;t-3>i;i++){for(f=a*t+i,o=r[f],e=0;16>e;e++)s[e]=r[c[e]+f];this.isCorner(s,o,this.FAST_THRESHOLD)&&(g.push(i,a),i+=3)}return g},tracking.Fast.isCorner=function(r,t,n){var a,i,e;if(this.isTriviallyExcluded(r,t,n))return!1;for(var o=0;16>o;o++){e=!0,a=!0;for(var c=0;9>c;c++)i=r[o+c&15],this.isBrighter(i,t,n)||(a=!1),this.isDarker(i,t,n)||(e=!1)}return a||e},tracking.Fast.isTriviallyExcluded=function(r,t,n){var a=0,i=r[0],e=r[4],o=r[8],c=r[12];return this.isBrighter(i,t,n)&&a++,this.isBrighter(e,t,n)&&a++,this.isBrighter(o,t,n)&&a++,this.isBrighter(c,t,n)&&a++,3>a&&(a=0,this.isDarker(i,t,n)&&a++,this.isDarker(e,t,n)&&a++,this.isDarker(o,t,n)&&a++,this.isDarker(c,t,n)&&a++,3>a)?!0:!1},tracking.Fast.isBrighter=function(r,t,n){return r>t+n},tracking.Fast.isDarker=function(r,t,n){return t-n>r},tracking.Fast.getCircle_=function(r){if(this.circles_[r])return this.circles_[r];var t=new Int32Array(16);return t[0]=-r-r-r,t[1]=t[0]+1,t[2]=t[1]+r+1,t[3]=t[2]+r+1,t[4]=t[3]+r,t[5]=t[4]+r,t[6]=t[5]+r-1,t[7]=t[6]+r-1,t[8]=t[7]-1,t[9]=t[8]-1,t[10]=t[9]-r-1,t[11]=t[10]-r-1,t[12]=t[11]-r,t[13]=t[12]-r,t[14]=t[13]-r+1,t[15]=t[14]-r+1,this.circles_[r]=t,t}}(),function(){tracking.Math={},tracking.Math.distance=function(r,t,n,a){var i=n-r,e=a-t;return Math.sqrt(i*i+e*e)},tracking.Math.hammingDistance=function(r,t){var n,a,i=0;for(n=0,a=r.length;a>n;n++)i+=this.hammingWeight(r[n]^t[n]);return i},tracking.Math.hammingWeight=function(r){return r-=r>>1&1431655765,r=(858993459&r)+(r>>2&858993459),16843009*(r+(r>>4)&252645135)>>24},tracking.Math.uniformRandom=function(r,t){return r+Math.random()*(t-r)}}(),function(){tracking.Matrix={},tracking.Matrix.forEach=function(r,t,n,a,i){var e,o=i||1,c=0,s=0;for(c=0;n>c;c+=o)for(s=0;t>s;s+=o)e=c*t*4+4*s,a.call(this,r[e],r[e+1],r[e+2],r[e+3],e,c,s)},tracking.Matrix.transform=function(r,t,n,a){return tracking.Matrix.forEach(r,t,n,function(t,n,i,e,o){var c=a.apply(null,arguments);r[o]=c[0],r[o+1]=c[1],r[o+2]=c[2],r[o+3]=c[3]}),r}}(),function(){tracking.Tracker=function(){},tracking.Tracker.prototype.type=null,tracking.Tracker.prototype.getType=function(){return this.type},tracking.Tracker.prototype.onFound=function(){},tracking.Tracker.prototype.onNotFound=function(){},tracking.Tracker.prototype.setType=function(r){this.type=r},tracking.Tracker.prototype.track=function(){}}(),function(){tracking.ColorTracker=function(){tracking.ColorTracker.base(this,"constructor"),this.setType("color"),this.setColors(["magenta"])},tracking.inherits(tracking.ColorTracker,tracking.Tracker),tracking.ColorTracker.MIN_PIXELS=30,tracking.ColorTracker.knownColors_={},tracking.ColorTracker.registerColor=function(r,t){tracking.ColorTracker.knownColors_[r]=t},tracking.ColorTracker.getColor=function(r){return tracking.ColorTracker.knownColors_[r]},tracking.ColorTracker.prototype.colors=null,tracking.ColorTracker.prototype.calculateCentralCoordinate_=function(r,t){for(var n=0,a=0,i=-1,e=-1,o=1/0,c=1/0,s=0,g=0;t>g;g+=2){var f=r[g],k=r[g+1];f>-1&&k>-1&&(n+=f,a+=k,s++,o>f&&(o=f),f>i&&(i=f),c>k&&(c=k),k>e&&(e=k))}return 0===s?null:{x:n/s,y:a/s,z:60-(i-o+(e-c))/2}},tracking.ColorTracker.prototype.flagOutliers_=function(r,t){for(var n=0;t>n;n+=2){for(var a=0,i=2;t>i;i+=2)a+=tracking.Math.distance(r[n],r[n+1],r[i],r[i+1]);a/t>=tracking.ColorTracker.MIN_PIXELS&&(r[n]=-1,r[n+1]=-1,t[n]--)}},tracking.ColorTracker.prototype.getColors=function(){return this.colors},tracking.ColorTracker.prototype.setColors=function(r){this.colors=r},tracking.ColorTracker.prototype.track=function(r,t,n){var a,i,e,o=this,c=this.getColors(),s=[],g=[],f=[];for(tracking.Matrix.forEach(r,t,n,function(r,t,n,g,k,u,l){for(e=-1;a=c[++e];)s[e]||(f[e]=0,s[e]=[]),i=tracking.ColorTracker.knownColors_[a],i&&i.call(o,r,t,n,g,k,u,l)&&(f[e]+=2,s[e].push(l,u))}),e=-1;a=c[++e];)if(!(f[e]<tracking.ColorTracker.MIN_PIXELS)){o.flagOutliers_(s[e],f[e]);var k=o.calculateCentralCoordinate_(s[e],f[e]);k&&(k.color=c[e],k.pixels=s[e],g.push(k))}g.length?o.onFound&&o.onFound.call(o,g):o.onNotFound&&o.onNotFound.call(o,g)},tracking.ColorTracker.registerColor("cyan",function(r,t,n){var a=50,i=70,e=r-0,o=t-255,c=n-255;return t-r>=a&&n-r>=i?!0:Math.sqrt(e*e+o*o+c*c)<80}),tracking.ColorTracker.registerColor("magenta",function(r,t,n){var a=50,i=r-255,e=t-0,o=n-255;return r-t>=a&&n-t>=a?!0:Math.sqrt(i*i+e*e+o*o)<140}),tracking.ColorTracker.registerColor("yellow",function(r,t,n){var a=50,i=r-255,e=t-255,o=n-0;return r-t>=a&&n-t>=a?!0:Math.sqrt(i*i+e*e+o*o)<100})}();