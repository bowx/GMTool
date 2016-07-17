gmApp.service('remoteManager',function($http){
	//TODO set http header for Authorization  
	$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
	function addressMapping(type,parameters,config){
		switch(type)
		{
			case "players":
			{
				config.url = "data/players.json";
				config.params = parameters;
				break;
			}
			case "equipment":
			{
				config.url = "data/equipment.json";
				config.params = parameters;
				break;
			}
		}
		return config;
	};
	this.get = function(serviceName,parameters,scope,callback){
		var config = {
			"method":"GET" 
		};
		config = addressMapping(serviceName,parameters,config);
		$http(config).success( function(data,status,headers,config){
			if(!_.isUndefined(scope.loadFlg)){scope.loadFlg = false;};
			callback(data);
		}).error(function(data,status,headers,config){
			if(!_.isUndefined(scope.loadFlg)){scope.loadFlg = false;};
			//TODO
		});
	};
	this.post = function(){};
});