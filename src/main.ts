import express from 'express';
import path from 'path';
import https from "https"
import http from "http"
import fs from "fs"
import { HighscoreDatabase, PlayerData } from './Database';

import * as yaml from "js-yaml"

const config = yaml.load( fs.readFileSync( __dirname + "/../"+"config.yml","utf8") ) as {hostname:string,port:number}
const app = express();
const DB = new HighscoreDatabase(__dirname + "/database.db")

DB.tryToCreateTable()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/api/", async (req, res) => {
	res.send("welcome")
})

app.get("/api/get/top/", async (req, res) => {
	let r = await DB.getTop10()

	res.json(r)
})

app.get("/api/get/all/", async (req, res) => {
	let r = await DB.getAllFromDB()

	res.json(r)
})

app.get("/api/get/:start/:end", async (req, res) => {
	let start = Number(req.params.start)
	let end = Number(req.params.end)

	if(isNaN(start) || isNaN(end) || start > end)
	{
		end = start + 1
	}
	
	const r = await DB.getAllBetween(start, end)
	
	res.json(r)
})

app.get("/api/get/:playername", async (req, res) => {
	let player = await DB.getPlayer(req.params.playername)
	if (player) {
		
		res.json(player)
	}
	else {
		res.status(404).json({
			code: 404,
			message:"Player not found."
		})
	}
})

app.post("/api/add/", async (req, res) => {
	let response = {
		code: 0,
		message:""
	}
	if (!(req.body.name && req.body.score)) {
		response.code = 404
		response.message = `Wrong requisition. name:${req.body.name}, score: ${req.body.score}`
		res.status(404).json(response)
	}
	else {
		
		let playerData:PlayerData = {
			score:Number(req.body.score),
			name: req.body.name
		}
	
		const foundPlayer = await DB.playerIsAlreadyOnDB(playerData.name)
		
		if(foundPlayer)
		{
			const newScore = await DB.checkIfScoreItsBetter(playerData)
	
			if(newScore)
			{
				await DB.updatePlayerScore(playerData)
				response.code = 200
				response.message = `${playerData.name}'s score updated to ${playerData.score}`
	
				res.status(200).json(response)
			}
			else {
				response.code = 406
				response.message = `Git gud. This player already have a better score`
				res.status(406).json(response)
			}
		}
		else{
			await DB.createNewPlayer(playerData)

			res.sendStatus(200)
		}
	}

})

app.get("*",async (req, res) => {
	res.status(404).send("404")
})

app.listen(config.port, config.hostname, () => {
	console.log(`running at http://${config.hostname}:${config.port}/api/`)
});
