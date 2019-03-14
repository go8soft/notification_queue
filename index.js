let redis = require('redis')
let subscriber = redis.createClient()
let matchIds = {}

const { Client } = require('pg')
const client = new Client('postgres://nq:123@localhost/notification_queue')
client.connect()


subscriber.on('message', function (channel, message) {
  console.log(new Date())
  let matchId = JSON.parse(message)['matchId']
  console.log('Message: ' + matchId + ' on channel: ' + channel + ' is arrive!')
  if (!matchIds[matchId]) {
    client.query('update match_notifications ' +
                  'set is_sent = true ' +
                  'where is_sent = false and match_id = $1 ' +
                  'returning *', [matchId], (err, res) => {
      if(!err && res.rows.length == 1) {
        console.log('Sending...')
        matchIds[matchId] = 'sent'
      }
    })
  } else {
    console.log('Variable for MatchId was already set.')
  }
})
subscriber.subscribe('notification')
