# kitchensink app

## local development
- create and configure your oauth app in the google cloud console
- setup your environment vars in client and server
- npm start in `client`
- npm start in `server`

to run mongodb locally

```bash
docker run -d \
  --name kitchensink-mongodb \
  --publish 27017:27017 \
  mongo
```