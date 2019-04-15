export default function(wsURI, onReceive){
	var ws = null;
	
	this.connect = () => {
		return new Promise((resolve, reject) => {
			ws = new WebSocket(wsURI);
			ws.onopen = () => {
				console.log('open');
				resolve();
			};
			ws.onclose = () => {
				console.log('close');
			};
			
			ws.onerror = (e) => {
				console.error(e);
				reject();
			};
			
			ws.onmessage = evt => {
				var data = evt.data;
				try{
					if(onReceive)
						onReceive(data);
				}catch(e){
					console.log(e);
				}
			};
		});
	};
	
	this.send = (data, onSuccess, onError) => {
		try{
			ws.send(data);
		}catch(e){
			console.error(e);
		}
	}
}
