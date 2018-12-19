var http = require('http')
var fs = require('fs')

var metdatang = fs.readFileSync('./metdatang.html')
var meterror = fs.readFileSync('./meterror.html')

var dataJson = fs.readFileSync('./data.json', 'utf-8')
var dataObj = JSON.parse(dataJson)

var server = http.createServer((req, res) => {
    console.log('Ada yg request ke: ' + req.url)
    if(req.url === '/'){
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.end(metdatang)
    }
    else if(req.url === '/data'){
        if(req.method == 'POST'){
            var kiriman = []
            req.on('data', (x) => {
                console.log('kiriman = ' + x)
                var y = JSON.parse(x)
                kiriman.push(y)
                console.log(kiriman)
            })
            req.on('end', () => {
                console.log(kiriman[0].suhu)
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 
                    'Origin, X-Requested-With, Content-Type, Accept'
                })
                res.end(JSON.stringify(kiriman[0]))
                dataObj.push(kiriman[0])
                var ok = JSON.stringify(dataObj)
                fs.writeFileSync('data.json', ok)
            })
        } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 
                    'Origin, X-Requested-With, Content-Type, Accept'
                })
                res.end(JSON.stringify(dataObj))
        }
    } else if(RegExp('/data/\\d').test(req.url)){
        if(req.method == 'DELETE'){
            var y = req.url.split('/')
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 
                'Origin, X-Requested-With, Content-Type, Accept'
            })
            dataObj.splice(y[2]-1, 1)
            var ok = JSON.stringify(dataObj)
            fs.writeFileSync('data.json', ok)
            res.end(`{"status": "Data ke-${y[2]} terhapus"}`)
        }
        else if(req.method == 'PUT'){
            var nomor = req.url.split('/')
            var kiriman = []
            req.on('data', (x) => {
                console.log('kiriman = ' + x)
                var y = JSON.parse(x)
                kiriman.push(y)
                console.log(kiriman)
            })
            req.on('end', () => {
                console.log(kiriman[0])
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 
                    'Origin, X-Requested-With, Content-Type, Accept'
                })
                dataObj.splice(nomor[2]-1, 1, kiriman[0])
                var ok = JSON.stringify(dataObj)
                fs.writeFileSync('data.json', ok)
                res.end(`{"status":"Data ke-${nomor[2]} terupdate!"}`)
            })
        } else {
            var y = req.url.split('/')
            console.log(y[2] - 1)
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 
                'Origin, X-Requested-With, Content-Type, Accept'
            })
            res.end(JSON.stringify(dataObj[y[2]-1]) ?
            JSON.stringify(dataObj[y[2]-1]) :
            'Data tidak ditemukan'
            )
        }
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html' 
        })
        res.end(meterror)
    }
})

server.listen(3456, () => {
    console.log('Server aktif di port 3456!')
})