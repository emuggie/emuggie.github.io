export default function(onWait, onConnect, onStream ){
    this.onStream = onStream;
	this.pc = new RTCPeerConnection({
		"iceServers":[
			{"urls":["stun:stun1.l.google.com:19302"]},
			{"urls":["stun:stun2.l.google.com:19302"]},
			{"urls":["stun:stun3.l.google.com:19302"]},
			{"urls":["stun:stun4.l.google.com:19302"]}
		]
		,"iceTransportPolicy":"all"
		,"iceCandidatePoolSize":"0"
	});
		
	this.pc.createDataChannel("sendChannel");
	
	this.pc.iceCandidates = [];
	this.pc.onicecandidate = event => {
		if (event.candidate) {
            this.iceCandidateEnd = false;
			console.log("IceCandidate Found", event.candidate);
			this.pc.iceCandidates.push(event.candidate);
            return;
		}
        this.iceCandidateEnd = true;
	};
    this.getIceGatheringState = () => {
        if(this.iceCandidateEnd){
            return 'complete';
        }
        return this.pc.iceGatheringState;
	};

	this.pc.ontrack = ({streams: [stream]}) => {
        this.onStream('remote',stream);
	};
	
	this.mediaOptions = {
			video: {
				width: { min: 200, ideal: 800, max: 1200 },
				height: { min: 150, ideal: 600, max: 900 }
			},
			audio : true
	};
	
	this.getStream = mediaOptions => {
        this.stopStream();
		var mediaOpts = Object.assign({}, this.mediaOptions, mediaOptions);
		
		navigator.mediaDevices.getUserMedia(mediaOpts).then( gumStream => {
            for (const track of gumStream.getTracks()) {
				this.pc.addTrack(track, gumStream);
			}
            this.currentStream = gumStream;
            this.onStream('local', this.currentStream);
		}).catch(err => {
			alert("Error activate camera device : " + err);
			console.log(err);
		});
	}

    this.stopStream = kind => {
        if(!this.currentStream)
            return;
        
        this.currentStream.getTracks().forEach( each => {
            if(each.kind == kind)
                each.stop();
        });
    }    
	
	this.setRemoteConnection = (desc, candidates) => {
		if(!this.pc.localDescription){
			throw "Video is not waiting status.";
		}
		this.pc.setRemoteDescription(new RTCSessionDescription(desc))
		.then(()=> { 
			candidates.forEach(candidate => {
			console.log(candidate);
			this.pc.addIceCandidate(candidate)
			.catch(err => {console.log(err)});
			});
		});
	};
	
	this.waitPeer = () => {
		if(!this.waitSec){
			this.waitSec = 0;
			this.pc.createOffer()
			.then( offer => { 
				return this.pc.setLocalDescription(new RTCSessionDescription(offer)); 
			}).catch(err => {
				console.log(err);
			});
		}
		
		if(this.getIceGatheringState() != 'complete'){
			console.log("Waiting...."+this.waitSec , this.pc.iceGatheringState);
			this.waitSec++;
			if(this.waitSec > 300){
				alert("Fail to gather network info.");
				delete this.waitSec;
				return;
			}
			setTimeout(this.waitPeer, 1000);
			return;
		}
		delete this.waitSec;
		if(onWait)
			onWait(this.pc.iceCandidates, this.pc.localDescription);
	};
		
	this.connectPeer = (wsId, rDesc, iceCandidates) => {
		if(!this.waitSec){
			this.waitSec = 0;
			this.pc.setRemoteDescription(new RTCSessionDescription(rDesc))
			.then(() => { return this.pc.createAnswer(); })
			.then( answer => {
				return this.pc.setLocalDescription(new RTCSessionDescription(answer));
			})
			.then( () => {
				console.log("candidates ",iceCandidates);
				if(iceCandidates){
					iceCandidates.forEach(candidate => {
						this.pc.addIceCandidate(candidate)
						.catch(err => {console.log(err)});
					});
				}
			})
			.catch(err => {	console.log(err); });
		}
		
		if(this.getIceGatheringState() != 'complete'){
			console.log("Waiting...." + this.waitSec);
			this.waitSec++;
			if(this.waitSec > 300){
				alert("Fail to gather network info.");
				delete this.waitSec;
				return;
			}
			setTimeout(() => {this.connectPeer(wsId, rDesc, iceCandidates)}, 1000);
			return;
		}
		delete this.waitSec;
		if(onConnect)
			onConnect(wsId, this.pc.iceCandidates, this.pc.localDescription);
	};
		
	this.disconnect = () => {
		this.pc.close();
	};
}                          
