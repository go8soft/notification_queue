# Notification Queue
The purpose of this repository is to demonstrate some basic techniques how to subscribe to events in Redis with Node.js and trigger new event only once. 
Here we are not interesting about configuration and code organization. We want to keep focus on the main problem. 

## Background and aim
We want to subscribe to event in Radis. Based on information in this event (`matchId`) we want to trigger new event. 
It is possible to have multiple events with same `matchId` and we want to trigger the new event only once.

## Installation

1. Install Node.js v11.11.0.
2. Install Redis.
3. Checkout the project:
```
 $ git clone git@github.com:go8soft/notification_queue.git
```

4. Install the modules:
```
notification_queue$ npm install
```

5. Install PostgreSQL.

  - Create and init database:
    ```
    notification_queue$ psql template0 < db/init.sql
    ```
  - Create user `nq` with password `123` and access to the database and tables. 

## How it works and tests

1. Run the subscriber:
```
notification_queue$ node index.js
```
Here we want to recive events. Based on `matchId` in them we will trigger new event. 
It is possible to have multiple events with same `matchId` and we want to trigger the new event only once.
We do this in two ways:
  - [We are using `update` with `where` to validate we are doing things right - trigger the new event only once.](https://github.com/go8soft/notification_queue/blob/master/index.js#L15)
  - [We are using variable to restrict unnecessary queries.](https://github.com/go8soft/notification_queue/blob/master/index.js#L14)
  
2. We need someone to send event in Redis. Also we need to test parallel messages. This is why we need multiple node processes like this:
```
notification_queue$ node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js & node subscriber.js &
```
`subscriber` receive one event to send multiple messages to Redis. 
This messages are recived from `index`. 

3. Trigger `subscriber` to send messages competitive:
  - `mongo_db_schema$ redis-cli`
  - `> publish notification_start a`
  
Now we can check in the output of `index` we have only one `Sending...` message, even if we have events at the same time. Example:
```
2019-03-14T16:59:43.953Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.963Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.965Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.965Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.966Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.966Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.966Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.967Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.967Z
Message: 123 on channel: notification is arrive!
2019-03-14T16:59:43.968Z
Message: 123 on channel: notification is arrive!
Sending...
```
  
[Here you can read more about it.](https://docs.google.com/document/d/19dBV1Fqvgt7x2NTEbcTkui8JGrPINhfdFseEm5A8Bbc/edit?usp=sharing)
  
  
  
  
  
  
