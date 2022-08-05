# jwh - Just works highscore

Just works leadeboard API. Made with `nodejs` and `sqlite`.  

This API only uses a name and a score to handle the leaderboard.  

This API dont have any kind of security, so only use for prototypes and always only use locally.  
## How to use

- `npm install`
- `npm run full`

## Endpoints

### **GET** `/api/get/top/` 

Returns an json array with the top 10 best players.  
Example:

```json
[
	{"position":1,"name":"teste3536465111","score":22212222},
	{"position":2,"name":"teste353646","score":886644},
	{"position":3,"name":"teste3536465","score":22212},
	{"position":4,"name":"teste353","score":8866},
	{"position":5,"name":"teste56","score":88},
	{"position":6,"name":"bbb","score":58},
	{"position":7,"name":"teste5","score":22},
	{"position":8,"name":"teste4","score":21},
	{"position":9,"name":"teste","score":20},
	{"position":10,"name":"teste2","score":20}
]
```

### **GET** `/api/get/all/`

Returns a json array with all players.  
Example:

```json
[
	{"position":1,"name":"teste3536465111","score":22212222},
	{"position":2,"name":"teste353646","score":886644},
	{"position":3,"name":"teste3536465","score":22212},
	{"position":4,"name":"teste353","score":8866},
	{"position":5,"name":"teste56","score":88},
	{"position":6,"name":"bbb","score":58},
	{"position":7,"name":"teste5","score":22},
	{"position":8,"name":"teste4","score":21},
	{"position":9,"name":"teste","score":20},
	{"position":10,"name":"teste2","score":20},
	{"position":11,"name":"teste3","score":20},
	{"position":12,"name":"aaa","score":5}
]
```

### **GET** `/api/get/:start/:end`

Returns a json array with all players between `start` and `end`.  
Example: `/api/get/4/8`
```json
[
	{"position":4,"name":"teste353","score":8866},
	{"position":5,"name":"teste56","score":88},
	{"position":6,"name":"bbb","score":58},
	{"position":7,"name":"teste5","score":22},
	{"position":8,"name":"teste4","score":21}
]
```

### **GET** `/api/get/:playername`  

Returns a json object with the player.  
Example: `/api/get/bbb`  
```json
{"position":5,"name":"bbb","score":58}
```
Example: `/api/get/penis`  
```json
{"code":404,"message":"Player not found."}
```

### **POST** `/api/add/`  

Adds a new score.  

Examples:  
- Form:  
	```json
	{
		"name":"bbb",
		"score":59,
	}
	```
	- Response:  
		```json
		//(Status: 200)  
		{
			"code": 200,
			"message": "bbb's score updated to 91"
		}
		```

-	Form:  
	```json
	{
		"name":"bbb",
		"score":55,
	}
	```
	-	Response:  
		```json
		//(Status: 406) 
		{
			"code": 406,
			"message": "Git gud. This player already have a better score"
		}
		```
