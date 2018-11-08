
var express = require('express');
var spawn = require('child_process').spawn;
bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/img",express.static(process.cwd() + '/img'));
app.use("/js",express.static(process.cwd() + '/js'))
app.use("/css",express.static(process.cwd() + '/css'))
app.listen(8080);

app.get("/",function (req,res) {
    res.sendFile(__dirname + "/index.html");
});


app.get('/move',function(req,res){
    proc  = spawn("stockfish");
    var crfen = req.query.fen;
    var move = 0;
  console.log(crfen)
        proc.stdin.write("position fen " + crfen + "\n");
        proc.stdin.write("go\n");



    proc.stdout.on('data', (data) => {

        data =  data.toString().split('\n')
        var pri = 0;
        var dmd = [];
        for(var i =0;i < data.length;i++){
            if(data[i] === ''){
                cms = [];
                for(var x= pri;x < i;x++){
                    cms.push(data[x])
                }
                pri = i+1;

                dmd.push(cms)
            }

        }

        for(i =0; i < dmd.length;i++){
            cm = dmd[i];
            if(cm.length === 0)
                continue;
            if(cm[0] === ' +---+---+---+---+---+---+---+---+') {
                console.log("GRID")
                continue;
            }
            if(cm[0].substr(0,3) === "Fen"){
                console.log("FEN");
                crfen = cm[0].substr(5);
                proc.kill('SIGINT');
                res.send(crfen);
                continue;
            }
            for(var x = 0;x < cm.length;x++){
                if(cm[x].substr(0,8) === 'bestmove'){
                    move = cm[x].substr(9);
                    move = move.substr(0,4);
                    console.log(move);
                    proc.stdin.write("position fen " + crfen + " moves "+move+"\n");
                    proc.stdin.write("d\n");
                    break;
                }
            }
        }


    });

});
//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/css'));
console.log("Server Running At:localhost:8080");
/*
var spawn = require('child_process').spawn;
fishproc  = spawn("stockfish");
console.log("started")
*/