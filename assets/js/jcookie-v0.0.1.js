const JCookies = (function(){
	// Get value by key (raw)
	this.get = (key, encoded) => {
		if(!encoded){
			key = encodeURIComponent(key);
		}
		var result = null;
		
		document.cookie.split(';').forEach(each => {
			if(!each || each.trim ==''){
				return;
			}
			var entry = each.split('=');
			if(entry[0].trim() == key){
				result = decodeURIComponent(entry[1].trim());
			}
		});
		return result;
	};
	
	// Set value by key (raw)
	this.set = ( key, value, expireDays, path) => {
		var queryStr = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		
		if(!value){
			expireDays = -5;
		}
		
		if(typeof expireDays === 'number'){
			var expireDate = new Date();
			expireDate.setTime(expireDate.getTime() + ( expireDays *24*60*60*1000) );
			queryStr += ';expires=' + expireDate.toUTCString() + ';';
		}
		
		if(path){
			queryStr += ';path=' + path + ';';
		}
		console.log(queryStr);
		document.cookie =  queryStr;
	};
	
	// Remove key
	this.remove = key => {
		this.set(key, null);
	}
	
	//JCookie functionalities
	const JCookiePrefix = '$JCookie:';
	const JCookieCache = new Object();
	JCookieCache.get = key => {
		var encKey = encodeURIComponent(key);
		return this[encKey];
	};
	JCookieCache.set = (key, proxy) => {
		var encKey = encodeURIComponent(key);
		this[encKey] = proxy;
	};
	
	// Get cached JCookie object(Readonly)
	this.getJCookieCache = ()=> {
		var result = new Object();
		for(var key in JCookieCache){
			result[key] = JCookieCache[key];
		}
		Object.freeze(result);
		return result;
	};
	
	this.isJCookie = key => {
		if(this.getJCookieCache().get(key)){
			return true;
		}
		var value = this.get(key);
		if(!value){
			return true;
		}
		return	value.startsWith(JCookiePrefix);
	};
	
	this.getJCookie = key => {
		//If is not JCookie object
		if(!this.isJCookie(key)){
			throw `Value for Key[${key}] is not JCookie value.${this.get(key)}`;
		}
		
		// Return JCookie from cache
		if(this.getJCookieCache().get(key)){
			return this.getJCookieCache().get(key);
		}
		var handler = {
			get : (obj, prop) => {
				switch (prop){
					case 'reload' : return () => {
						// Return JCookie from raw value(init)
						var value = this.get(key) || `${JCookiePrefix}{}`;
						var data = JSON.parse(value.replace(JCookiePrefix, ''));
						
						for(var p in obj){
							delete obj[p];
						}
						for(var p in data){
							obj[p]=data[p];
						}
						obj['_state'] = 'synched';
						obj['_key'] = key;
						obj['_rawKey'] = encodeURIComponent(key);
						obj['_rawValue'] = value;
					};
					case 'commit' : return (expireDays, path) => {
						// Apply changed to cookie
						var data = new Object();
						for(var p in obj){
							if(p.startsWith('_'))
								continue;
							data[p] = obj[p];
						}
						var rawValue = JCookiePrefix + JSON.stringify(data);
						this.set(obj['_key'], rawValue ,expireDays, path);
						obj['_state'] = 'synched';
						obj['_rawValue'] = 'rawValue';
					};
					case 'rollback' : return () => {
							// Rollback to last reloaded point
							var value = obj['_rawValue'];
							var data = JSON.parse(value.replace(JCookiePrefix, ''));
							
							for(var p in obj){
								delete obj[p];
							}
							for(var p in data){
								obj[p]=data[p];
							}
							obj['_state'] = 'synched';
						};
					default : return obj[prop];
				}
			},						
			set : (obj, prop, value) => {
				if(obj[prop] == value){
					return;
				}
				obj[prop] = value;
				if(prop.startsWith('_')){
					return;
				}
				obj['_prev.'+ prop] = obj[prop];
				obj['_state'] = 'updated';
			},
			deleteProperty: (obj, prop) => {
			    if (!obj[prop]) { 
			    	return false; 
		    	}
			    obj['_state'] = 'updated';
			    return obj.removeItem(prop);
			},
		};
		var proxy = new Proxy(new Object(), handler);
		proxy.reload();
		JCookieCache.set(key, proxy);
		return proxy;
	};
	return this;
}).call(new Object());