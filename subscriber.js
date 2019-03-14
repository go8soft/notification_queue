let redis = require('redis')
let publisher = redis.createClient()
let matchId = 123

let subscriber = redis.createClient()
subscriber.on('message', function (channel, message) {
  console.log(new Date())
  console.log('Message: ' + message + ' on channel: ' + channel + ' is arrive!')
  publisher.publish(
    'notification',
    `{"matchId": "${matchId}"}`,
    () => {
      console.log(`published matchId: ${matchId}`)
    })
})
subscriber.subscribe('notification_start')
