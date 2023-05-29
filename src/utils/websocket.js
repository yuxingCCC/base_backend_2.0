import envConfig from '@/config/envConfig'

let ws;
let tt;
let lockReconnect = false; 		//避免重复连接
let manualClose = false;		// 判断是否为手动关闭连接

let websocket = {

	Init: function(clientId, onmessage) {
		if ("WebSocket" in window) {
			ws = new WebSocket(envConfig.websocketUrl + clientId);
		} else if ("MozWebSocket" in window) {
			ws = new MozWebSocket(envConfig.websocketUrl + clientId);
		} else {
			console.error("您的浏览器不支持 WebSocket!");
			return;
		}


		ws.onmessage = function(e) {
			onmessage(e.data, e);
		};

		ws.onclose = function() {
			console.log("websocket: 连接已关闭");
			lockReconnect = false;
			if (!manualClose){
				// 非手动关闭的则进行重连
				if (!lockReconnect){
					lockReconnect = true;
					setTimeout(_=>{
						console.log("websocket: 重连中...");
						websocket.Init(clientId);
					}, 3000)
				}
			}
		};

		ws.onopen = function() {
			lockReconnect = true;
			console.log("websocket: 连接成功");
		};

		ws.onerror = function(e) {
			// 连接异常, 进行重连
			// console.log("websocket 连接异常");
		};

		manualClose = false;
	},

	send: function(data){
		ws.send(data)
	},

	getWebSocket(){
		return ws;
	},

	/**
	 * 关闭连接
	 */
	close(){
		ws.close();
		manualClose = true;
	}

};

export default websocket;

/**
 * 心跳检测
 */
function heartCheck() {
	setInterval(_=>{
		console.log("websocket: 心跳检测");
		ws.send('heartCheck');
	}, 1000 * 60)
}


