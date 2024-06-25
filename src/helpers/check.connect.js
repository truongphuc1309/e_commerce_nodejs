'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const CYCLE = 5000

const countConnect = () => {
  const numberOfConnects = mongoose.connections.length
  return numberOfConnects
}

const checkOverLoad = () => {
  const numberOfCores = os.cpus().length
  const maxConnects = numberOfCores * 5 
  setInterval(() => {
    const memUsage = process.memoryUsage.rss() / 1024**2
    const numberOfConnects = countConnect();
    console.log('Actived Connections:', numberOfConnects, ' Memory Usage: ',memUsage)
    
    if (numberOfConnects > maxConnects)
      console.log('Server is overloading !!!')
    
  }, CYCLE)

}

module.exports = {countConnect, checkOverLoad}
