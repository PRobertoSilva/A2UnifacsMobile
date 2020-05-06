const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient 
const ObjectId = require('mongodb').ObjectID

const uri = "mongodb+srv://atividadebdnr:atividadebdnr@crud-nodejs-ydbzg.mongodb.net/atividadebdnr?retryWrites=true&w=majority";


MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err)
    db = client.db('crud-nodejs')

    app.listen(3000, function(){
        console.log('servidor rodando na porta 3000')
    })
})

app.use(bodyParser.urlencoded ({ extended: true }) )

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res)=>{
    db.collection('data').find().toArray((err, results)=>{
        if(err) return console.log(err)
        res.render('shows.ejs', { data: results })
    })
})


app.post('/show', (req, res)=>{
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
     
        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
      })
});

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname 
  var telefone = req.body.telefone
  var idade = req.body.idade
  var cidade = req.body.cidade
  var genero = req.body.genero
  var cpf = req.body.cpf
  var rg = req.body.rg
  var datanascimento = req.body.datanascimento
  var numerodacasa = req.body.numerodacasa
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      telefone: telefone,
      idade: idade,
      cidade: cidade,
      genero: genero,
      cpf: cpf,
      rg: rg,
      datanascimento: datanascimento,
      numerodacasa: numerodacasa,
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})



