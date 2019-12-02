const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("port", 3000);
app.use(bodyParser.json({type: "applicaiton/json"}));
app.use(bodyParser.urlencoded({extended: true}));

const Pool = require("pg").Pool;
const config = {
	host: "localhost",
	user:"shop1",
	password: "shop1password",
	database: "workshops"
};

const pool = new Pool(config);

app.listen(app.get("port"), () => {
	console.log(`Find the server at http://localhost:${app.get("port")}`);

})

app.post("/api", async (req,res) => {
	const attendee = req.body.attendee;
	const title = req.body.workshop;

	const temp = "SELECT * FROM attendees WHERE (name = $1) AND (shop = $2)";
	const resp = await pool.query(temp, [attendee, title]);
	if (resp.rowCount == 0){
		try{
			const template = "INSERT INTO attendees (name, shop) VALUES ($1, $2)";
			const response = await pool.query(template, [attendee, title]);
			res.json({attendee: attendee, workshop: title});

		}
			catch (err){
				console.log("real error");
		}
	}
	else{
		res.json({error: "attendee already enrolled"});
	}

})


app.get("/api", async (req,res) =>{
	const workshop = req.query.workshop;
	if(workshop == null){
		try{
			const template = "SELECT DISTINCT shop FROM attendees";
			const response = await pool.query(template);
			const shops = response.rows.map(function(item){
				return item.shop;
			})
			res.json({workshops: shops});
		}

		catch{
			res.json({error: "error"});
		}
	}
	else{
		try{
			const template = "SELECT name FROM attendees WHERE shop = $1";
			const response = await pool.query(template, [workshop]);
			const shops = response.rows.map(function(item){
				return item.name;
			})
			if (response.rowCount == 0){
				res.json({error: "workshop not found"});
			}
			else{
				res.json({attendees: shops});
			}
			}
		catch{
			res.json({error: "workshop not found"});
		}

	}

})