const express = require('express');
const functions = require('firebase-functions')
const app = express();
const { google } = require('googleapis');
const keys = require('./bpklabel.json');


function selectdata(idname){
    const client = new google.auth.JWT(
      keys.client_email, 
      null, 
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
  );
  
  
  client.authorize(function(err,token){
      if(err){
          console.log(err);
          return;
      }else{
          gsrun(client)
      }
  
  });
  
  async function gsrun(cl){
      const gsapi = google.sheets({version:'v4',auth: cl});
      const opt = {
          spreadsheetId : '18AZ-R4ghs8w5s87UkWdc8yZRcb1NIIzaaY1KOPiTZCs',
          range: 'Sheet1!A1:A'
      };
      var data = await gsapi.spreadsheets.values.get(opt); 
      var maindata = data.data.values
      var index = ''
      for (index = 0; index < maindata.length; index++) {
          var FNmaindata = maindata[index]
          if(FNmaindata == idname){
          break;
          }
      }
      const opt2 = {
          spreadsheetId : '18AZ-R4ghs8w5s87UkWdc8yZRcb1NIIzaaY1KOPiTZCs',
          range: 'Sheet1!A'+(index+1)+':H'+(index+1)+''
      };
      var FNdata = await gsapi.spreadsheets.values.get(opt2);
      console.log(FNdata.data.values)
      var nonofulldata = FNdata.data.values

      const drive = google.drive({version: 'v3', auth: cl});
      str = FNdata.data.values["0"]["6"]
      var n = str.split('/')
      console.log(n["1"])
      drive.files.list({
          pageSize: 10,
          q:"name ='"+ n["1"] +"'",
          fields: 'nextPageToken, files(id,name)',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const files = res.data.files;
          idphoto = ''
          if (files.length) {
            console.log('Files:');
            files.map((file) => {
              console.log(`${file.name} (${file.id})`);
              idphoto = "https://drive.google.com/uc?export=view&id=" + file.id
              nonofulldata["0"].push(idphoto)
              fulldata = nonofulldata
              console.log(fulldata)
            });
          } else {
            console.log('No files found.');
              idphoto = "https://siph-space.sgp1.digitaloceanspaces.com/uploads/editor/1598261295_medicine.jpg"
              nonofulldata["0"].push(idphoto)
              fulldata = nonofulldata
              console.log(fulldata)
          }
        });

  }
  }
  app.get('/assets/logo.png', (req, res, next) => {
    res.sendFile(__dirname + '/assets/logo.png')
  })
  
  app.get('/ID/assets/bootstrap-4.6.0-dist/css/bootstrap.min.css', (req, res, next) => {
    res.sendFile(__dirname + '/assets/bootstrap-4.6.0-dist/css/bootstrap.min.css')
  })
  
  app.get('/ID/assets/Style/style.css', (req, res, next) => {
    res.sendFile(__dirname + '/assets/Style/style.css')
  })
  
  app.get('/ID/assets/Style/qrcode.css', (req, res, next) => {
    res.sendFile(__dirname + '/assets/Style/qrcode.css')
  })
  
  app.get('/ID/assets/hero-bg.jpg', (req, res, next) => {
    res.sendFile(__dirname + '/assets/hero-bg.jpg')
  })
  
  app.get('/ID/assets/Icons-Land-Medical-Equipment-Capsule-Red.ico', (req, res, next) => {
    res.sendFile(__dirname + '/assets/Icons-Land-Medical-Equipment-Capsule-Red.ico')
  })
  
  app.get('/ID/assets/Icons-Land-Medical-Equipment-Capsule-Red.ico', (req, res, next) => {
    res.sendFile(__dirname + '/assets/Icons-Land-Medical-Equipment-Capsule-Red.ico')
  })
  
  app.get('/ID/assets/jquery/dist/jquery.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/assets/jquery/dist/jquery.min.js')
  })
  
  app.get('/ID/assets/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/assets/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js')
  })

  app.get('/ID/css/loader-1.css', (req, res, next) => {
    res.sendFile(__dirname + '/css/loader-1.css')
  })

  var fulldata;
  app.get('/data', (req, res, next) => {
    res.send(fulldata)
  })
  var checkdata
  function fndata(idname){
     checkdata = [{idname}]
  }
  app.get('/checkdata', (req, res, next) => {
    res.send(checkdata)
  })
  
  var idname
  app.get('/ID/:idname', (req, res) => {
    idname = req.params.idname
    selectdata(idname)
    fndata(idname)
    res.sendFile(__dirname + '/public/index.html')
  })


exports.app = functions.https.onRequest(app)



