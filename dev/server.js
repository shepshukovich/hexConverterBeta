const express = require("express");
const app = express();
const fs = require("fs");
const upload = require('express-fileupload');

app.listen(3000, () => console.warn("Server is running. Listening on port 3000") );
app.use(upload());
app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });
app.post('/', function(req, res) {
    if(req.files) {
        const file = req.files.filename;
        const filename = req.files.filename.name;

        file.mv('./upload/' + filename, function(err) {
            if(err) {
                console.log(err);
                res.send('Error occured!');
            } else {
                res.send('Done!');
            }
        });
        req.files.filename.encoding = 'Base16';
        console.log(req.files);

        fs.readFile('./upload/' + filename, 'utf8', function(err, contents) {
            const converter = function(inputString) {
                const inputArr = inputString.split(', ');
                const resultArr = [];

                for(let i = 0; i < inputArr.length; i++) {
                  resultArr[i] = inputArr[i].replace('0x', '');  
                }

                const resultString = resultArr.join(' ');

                return resultString.replace(/'/g, '');
              };
              
            fs.writeFile('./upload/result.txt', converter(contents), (err) => {
                if (err) throw err;

                console.log('File saved!');
            });
        });
    }
});
