const express = require("express");
const bodyParser = require("body-parser");
const { port } = require("./config.js");
const Caver = require("caver-js");
const { add_nft_role } = require('./bot.js');
const rpcURL = "https://public-node-api.klaytnapi.com/v1/cypress";
const networkID = "8217";
const caver = new Caver(rpcURL);

const CONTRACT_ADDR = "0x970fd3b0e9d52f89c86ee6995e554258f77913b5";
let contract = null;

// const WALLET_ADDR = "0x941a7a3a0b9b63d23d245e55cefc593ae0a63290";
async function initContract() {
	contract = await caver.kct.kip17.create(CONTRACT_ADDR);
	console.log("initContract ok");
}
initContract();


const app = express();

app.use(bodyParser.json());

app.get("/", (request, response) => {
	return response.sendFile("index.html", { root: "." });
});

app.post("/api_discord_connect", async (request, response) => {
	console.log("api_discord_connect", request.body);
	// 디스코드봇이 유저에게 권한을 준다.
	const { wallet_addr, discord_user_id } = request.body;
	ret = await contract.balanceOf(wallet_addr);
	// const count = Number(ret);
	// if (count < 1) {
	// 	return response.json({
	// 		code: -1,
	// 		message: `count fail, ${count}`,
	// 	});
	// }
	// console.log("count", count);
	add_nft_role(discord_user_id);

	return response.json({
		code: 200,
		message: "ok",
	});
});

app.post("/api_wallet", async (request, response) => {
	console.log("api_wallet", request.body);

	const addr = request.body.addr;
	let ret;
	ret = await contract.balanceOf(addr);
	const count = Number(ret);
	console.log("count", count);

	return response.json({
		code: 200,
		message: "ok",
		count,
	});
});

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`)
);

