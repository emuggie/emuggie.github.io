export default function (baseURI, onReqStatusChange){
	this.ReqStatus = {
        Bussy : "Bussy",
	    Idle :  "Idle"
    };
    
    this.onReqStatusChange = onReqStatusChange;
	
	this.options = {
		method : 'GET'
		, data : null
		, header : {}
	};

	this.baseURI = baseURI;
	
	// Reset
	this.reset = () => {
		this.request = new XMLHttpRequest();
	}
	this.reset();
	
	//전송
	this.send = (path, callback, options) => {
		var reqOpts = Object.assign({}, this.options, options);
		
		// Precheck request status before send
		if(this.request.readyState !== XMLHttpRequest.UNSENT 
				&& this.request.readyState !== XMLHttpRequest.DONE){
            throw "Request Pending";
        }
		this.request.open(reqOpts.method, this.baseURI + path, true);
		
		for(var key in reqOpts.header){
			this.request.setRequestHeader(key, reqOpts.header[key]);
		}
		
		this.request.onreadystatechange = () => {
			// Error Handler of request Stage Change Event
			if(this.request.readyState === XMLHttpRequest.DONE) {
					// Dismiss loading layer
				if(this.onReqStatusChange){
					this.onReqStatusChange(this.ReqStatus.Bussy);
				}
	            if ( this.request.status === 200 ) {
	            	callback(null, this.request.responseText);
	            } else {
	            	callback("ERROR:"+this.request.status, this.request.responseText);
	            }
	        }
		};
			// Display loading layer
		if(onReqStatusChange){
			this.onReqStatusChange(this.ReqStatus.Idle);
		}
			
		this.request.send(reqOpts.data);
	};
		
	// Get list of current post
	this.get = (path, callback) => {
		this.send(path, (error, data) => {
			if(error){
				callback(error, data);
				return;
			}
			callback(error, JSON.parse(data))
		});
	};
		
	this.post = (path, callback, data, header) => {
		this.send(path, (error, data) => {
			if(error){
				callback(error, data);
				return;
			}
			callback(error, JSON.parse(data))
		}, {
			data : data,
            method : 'POST',
			header : header || { 'Content-type' : 'application/json' }
		});
	}; 
}
