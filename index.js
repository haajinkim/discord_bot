const express = require("express");
const useragent = require('express-useragent');
const bodyParser = require("body-parser");
const { port } = require("./config.js");
const Caver = require("caver-js");
const { add_nft_role } = require('./bot.js');
const rpcURL = "https://public-node-api.klaytnapi.com/v1/cypress";
const networkID = "8217";
const caver = new Caver(rpcURL);

const CONTRACT_ADDR = "0x970fd3b0e9d52f89c86ee6995e554258f77913b5";

let contract = null;

async function initContract() {
	contract = await caver.kct.kip17.create(CONTRACT_ADDR);
	console.log("initContract ok");
}
initContract();


const app = express();

app.use(bodyParser.json());
app.use(useragent.express());
app.get("/", (request, response) => {
	user_brower = request.useragent.browser
	if (user_brower !== "Chrome"){
		response.send("<script>alert('크롬 브라우저만 이용 가능합니다 ')</script>");
	}
	if(caver.klaytn === 'undefined'){
		response.redirect("https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi");
	}

	return response.sendFile("index.html", { root: "." });
	
	
});


app.post("/api_discord_connect", async (request, response) => {
	console.log("api_discord_connect", request.body);
	const { wallet_addr, discord_user_id } = request.body;
	ret = await contract.balanceOf(wallet_addr);
	
	add_nft_role(discord_user_id, wallet_addr);

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

