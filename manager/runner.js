const endpoint = require('../controller/endpoint')
const ModulesService = require('../services/modules-service');

const ModulesServiceInstead = new ModulesService()
const express = ModulesServiceInstead.express // called method get
const bodyParser = ModulesServiceInstead.bodyParser
const port = process.env.PORT || 8080;

// set default for post rest api
const application = express()
application.use(bodyParser.json())
application.use(bodyParser.urlencoded({extended : true}))

application.get('/api/reads',endpoint.reads)
application.get('/api/reads/(:price)',endpoint.readsByPrice)
application.get('/api/read/(:id)',endpoint.readsById)
application.post('/api/create',endpoint.create)
application.put('/api/update/(:id)',endpoint.update)
application.delete('/api/delete/(:id)',endpoint.deleteById)

application.listen(port ,(errors) => {
    if (!errors) {
        console.log(`You're in port ${port}`)
    }
    else {
        console.log(errors.message)
    }
})
