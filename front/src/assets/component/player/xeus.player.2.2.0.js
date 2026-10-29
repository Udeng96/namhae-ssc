// Local sample adapter. No camera or media gateway connection.
class Player { constructor(options) { this.element = document.getElementById(options.playerId); if(this.element) this.element.textContent = "CCTV demo adapter"; } destroy() {if(this.element) this.element.textContent="";} play(){} stop(){} pause(){} resume(){} mute(){} unmute(){} setVolume(){} }
export default {Player};
