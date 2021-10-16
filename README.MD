# Coins Price Compare

## Hosting
The app is hosted using Heroku, you can check it's status at:<br/>
https://coins-price-compare.herokuapp.com/heartbeat 

## API
The app has an auto generated swagger spec at:<br/>
https://coins-price-compare.herokuapp.com/docs

## Running Locally
Create a .env file and copy the content of .env.example to it<br/>

then using docker
```
docker compose up
```
or using the dev npm script to allow hot reloading (using nodemon)
```
npm install
npm run dev
```

## Testing
Even though unit testing might be sufficient for this app and a bit simpler, I thought using integration tests would give me a chance to show a glimpse of how I believe such tests should be written.<br/>
Maybe even discuss it in our technical interview<br>
To run the tests use `npm run test`

## Limitations
Due to the limited time I had for this project, the app has the following limitations that should have been addressed in a real world app
1. Missing rate limit mechanism - to adhere to crypto's compare API rate limit 
2. Suboptimal error handling for crypto compare errors   
3. Using multiple calls for crypto compare historical prices API - couldn't find a multi price API for this + it made the exercise a bit more interesting      
4. supporting "price dropped to 0" situations
 
## Template
This app was generated from a leaner version of a node typescript boilerplate I use for different projects.<br/>
It includes ESlint, prettier, github actions, TSOA and others.<br/>
Some of which are a bit of an overkill for this app. However, it was actually fester for me to use it + gave me a chance to show the general structure/technologies I use for more complex apps.   

