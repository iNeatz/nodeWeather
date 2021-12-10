const http = require('http')
const fs = require('fs')
const requests = require('requests')

const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", parseInt(orgVal.main.temp) - 273)
    temperature = temperature.replace("{%tempmin%}", parseInt(orgVal.main.temp_min) - 273)
    temperature = temperature.replace("{%tempmax%}", parseInt(orgVal.main.temp_max) - 273)
    temperature = temperature.replace("{%location%}", orgVal.name)
    temperature = temperature.replace("{%country%}", orgVal.sys.country)
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main)

    return temperature
}

const server = http.createServer((req, res) => {
    if(req.url == '/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&appid=290d70f6025235c072c0f86f841941ad")
        .on("data", function(chunk){
            const objData = JSON.parse(chunk)
            const arrData = [objData]
            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("")

            res.write(realTimeData)
        })
        .on("end", function(err){
            if(err) return console.log("Connection Closed Due To Error")
            res.end()
        })
    }
})

server.listen(8000, "127.0.0.1")