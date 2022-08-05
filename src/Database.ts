// import {highscore} from "./main"
// import { PlayerData } from "./games.controller"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

const dbConfig = {
	tableName: `Highscore`,
	name: `name`,
	score: `score`
}

export class HighscoreDatabase{
	db
	constructor(dbPath:string){
		// this.db = open({
		// 	filename: dbPath,
		// 	driver: sqlite3.Database
		// }).then((db) => db)
		this.db = open({
			filename: dbPath,
			driver: sqlite3.Database
		})
	}

	async tryToCreateTable():Promise<boolean>{
		const sql = `CREATE TABLE ${dbConfig.tableName}
		(
			id INTEGER PRIMARY KEY, 
			${dbConfig.name}, 
			${dbConfig.score}
		)`

		const result = (await this.db).exec(sql).then(() => true, () => false)
		
		if (await result) {
			console.log("Creating table,","sql:",sql)
		}

		return result
	}

	async playerIsAlreadyOnDB(playername:string):Promise<boolean>{
		const sql = `SELECT * FROM ${dbConfig.tableName} WHERE ${dbConfig.name}='${playername}' `

		return (await this.db).all(sql).then((rows)=>{
			return rows.length > 0
		},()=>false)
	}

	async countScores(){
		const sql = `SELECT ${dbConfig.name} FROM ${dbConfig.tableName} `
		return (await this.db).all(sql).then((rows)=>{
			return rows.length
		},()=>0)
	}

	async updatePlayerScore(data:PlayerData){
		const sql = `UPDATE ${dbConfig.tableName}
		SET ${dbConfig.score} = ${data.score}
		WHERE ${dbConfig.name}='${data.name}';
		`
			
		;(await this.db).run(sql)
	}
	async createNewPlayer(data:PlayerData){
		const sql = `INSERT INTO ${dbConfig.tableName}
		(
			${dbConfig.name}, 
			${dbConfig.score}
		) 
		VALUES(?,?)`

		return (await this.db).run(sql,[data.name,data.score]).then(()=>true,(err)=>{
			console.log(err)
			return false
		})
	}
	async checkIfScoreItsBetter(newData:PlayerData){
		let old = await this.getPlayer(newData.name)

		return newData.score > old.score
	}
	async getTop10(){

		// let ordened = this.order(await players)
		let ordened = await this.getOrderned()

		let filtered = (await ordened).slice(0,10)

		return filtered 
		
	}
	async getAllFromDB(){

		// let ordened = this.order(await players)
		let ordened = await this.getOrderned()

		return ordened
	}

	async order(players: PlayerData[]) {
		let ordened = players.sort((a,b) => {
			return  b.score - a.score
		})

		return ordened.map((v,i) => {
			return {
				position: i + 1,
				name: v.name,
				score: v.score
			}
		})
	}

	async getOrderned() {
		const sql = ` SELECT * FROM ${dbConfig.tableName}
		ORDER BY ${dbConfig.score} DESC;
		`
		let ordened = (await this.db).all(sql)

		return (await ordened).map((v,i) => {
			return {
				position: i + 1,
				name: v.name,
				score: v.score
			}
		})

	}

	async getAllBetween(startPosition:number,endPosition:number){

		let ordened = await this.getOrderned()
		let filtered = (await ordened).slice(startPosition -1 ,endPosition )
		
		return filtered

	}

	async getPlayer(playername:string){

		let p = this.getAllFromDB()
		return (await p).filter((p) => {
			return p.name === playername
		})[0]
	}
	

	async getWholeTable(){
		const sql = `SELECT * FROM ${dbConfig.tableName}`
		return (await this.db).all(sql).then((rows)=>rows,()=>[])
	}

	async clear(){
		const sql = `DELETE * from ${dbConfig.tableName}`
		await (await this.db).run(sql).then(()=>true,()=>false)
	}

}

export interface PlayerData{
	name:string
	score:number
}