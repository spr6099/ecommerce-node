
terminal
## npm i express-fileupload

app.js
// file uploding
## var expressFileupload=require('express-fileupload'); 

// file upload midileware static is using
## app.use(express.static(path.join(__dirname, 'public')));
## app.use(expressFileupload());

//
## npm i express-handlebars

## npm install bcrypt