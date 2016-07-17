gmApp.controller('PlayerCtl',function($scope,$http,remoteManager) {
	$scope.loadFlg = false;
	$scope.searchState = {
		"server" : "",
		"toLevel" : "",
		"fromLevel" : "",
		"key" : "",
		"type" : "id",
		"typeName" : "搜索ID"
	};
	$scope.searchTypeChange = function(type,typeName){ $scope.searchState.type = type;$scope.searchState.typeName = typeName;};
	function Search($scope){
		$scope.loadFlg = true;
		//delay for test loading
		_.delay(function(){
		remoteManager.get("players",$scope.searchState,$scope,function(data){$scope.players = data;});
		},1000);
	};
	Search($scope);
	$scope.ellipsisID = function(id){ return id.substring(0,8) + "..."}; 
	$scope.getStatus = function(status){
		switch(status)
		{
			case 0: return "正常";
			case 1: return "封禁";
			case 2: return "禁言";
		}
	};
	$scope.getPlayer = function(id){
		return _.find($scope.players,function(player){ return player.id == id;});
	};
	$scope.doSearch = function(){
		Search($scope);	
	};
	//modal
	$scope.openBlockConfirmModal = function(playerId){
		var player = $scope.getPlayer(playerId);
		$scope.$broadcast("ModalOpen",{
			"type":"block",
			"title":"确认封禁",
			"message":"确认封禁用户" + player.name +"吗?",
			"confirmCallback": function(){ console.log("block player");console.log(player);},
			"dataItem":player
			});
	};
	$scope.openKickConfirmModel = function(playerId){
		var player = $scope.getPlayer(playerId);
		$scope.$broadcast("ModalOpen",{
			"type":"kick",
			"title":"确认踢出",
			"message":"确认踢出用户" + player.name +"吗?",
			"confirmCallback": function(){ console.log("kick player");console.log(player);},
			"dataItem":player
			});
	};
	$scope.openEquConfirmModel = function(playerId){
		var player = $scope.getPlayer(playerId);
		$scope.$broadcast("ModalOpen",{
			"type":"equ",
			"title":"装备",
			"confirmCallback": function(){ console.log("player equ");console.log(player);},
			"dataItem":player
			});
	};
	$scope.openBanConfirmModel = function(playerId){
		var player = $scope.getPlayer(playerId);
		$scope.$broadcast("ModalOpen",{
			"type":"ban",
			"title":"禁言",
			"confirmCallback": function(){ console.log("ban player");console.log(player);},
			"dataItem":player
			});
	};
});

gmApp.controller('modalCrl',function($scope,$http,$element,remoteManager){
	$scope.loadFlg = false;
	$scope.init = function(options){
		$scope.type = options.type;
		switch(options.type)
		{
			case "kick":
			case "block":
			{				
				$scope.loadFlg = false;
				$scope.item = options.dataItem;
				$scope.title = options.title;
				$scope.message = options.message;
				break;
			}
			case "equ":
			{
				$scope.loadFlg = true;
				$scope.title = options.title;
				//delay for test loading
				_.delay(function(){
				remoteManager.get("equipment",{"id":options.dataItem.id},$scope,function(data){$scope.item = data;});
				},3000);
				break;
			}
			case "ban":
			{
				$scope.loadFlg = false;
				$scope.title = options.title;
				break;
			}
		}
		$scope.confirmClick = options.confirmCallback;
	};
	$scope.open = function(){
		$($element).modal('show');
	};
	$scope.$on("ModalOpen",function(event, data){ $scope.init(data); $scope.open();});
});

gmApp.controller('navCrl',function($scope,$window){
	$scope.data = [{
		"url": "#/Welcome",
		"name":"首页"
	},{
		"url": "#/player",
		"name":"游戏角色管理"
	},{
		"url": "#/search",
		"name":"游戏账号查询"
	},{
		"url": "#/log",
		"name":"日志查询"
	},{
		"url": "#/mail",
		"name":"发送邮件"
	},{
		"url": "#/promocode",
		"name":"兑换码"
	}
	];
	$scope.setActive = function(url){
		return $window.location.hash == url;
	}
});