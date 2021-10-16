# Gen Finder

## Limitations
Due to the limited time I had for this project, the app has the following limitations that should have been addressed in a real world app.
#### Memory
This app generates an in-memory tree structure (see UniqDescendantsTree) to allow finding a given gen in a reasonable time (O(N) where N is the length of the given gen).<br/>
The memory used to hold this tree is smaller compared to holding the entire file.<br/>
However it will not work for "worst case" scenarios in very big files.<br/>
The reason for that is that its memory usage is O(4N) where N is the length of the longest string between the gen prefixes (4 for the possible unique chars in each level).<br/>
If this longest string is large enough this app wil crash.<br/>
2 possible solutions for this (given enough time):
1. making an assumption on the maximum length of a gen (which is reasonable, given the fact that the gen is passed as path param) and stopping to build the "unique" path between prefixes if this path exceeds this length.
2. writing the tree to a file and iterating through this file (using event stream which allows reading huge files) when accepting a gen   
#### General
1. Reasonable error handling for the TextInFileByPrefixFinder "Libary" using error inheritance 
2. File management - would probably use s3 to store the file to avoid relaying on a local FS and the example-dna-file which was created for demo purposes
3. Additional units tests for TextInFileByPrefixFinder, which are essential to allow using it as an external libary
4. Cleanup and replacing console usage with proper logger

## Running Locally
using docker (reading the default example-dna-file using DNA_FILE_PATH env)
```
docker compose up
```
or using the dev npm script to allow hot reloading (using nodemon)
in order to do so you'll have to create a .env file which holds a DNA_FILE_PATH env with the location of the file you wish to read
```
npm install
npm run dev
```

## API
Once running in localhost The app has an auto generated swagger spec at:<br/>
http://localhost:3000/docs/#/

## Testing
Even though unit testing might be sufficient for this app and a bit simpler, I thought using integration tests would give me a chance to show a glimpse of how I believe such tests should be written.<br/>
Maybe even discuss it in our technical interview<br>
To run the tests use `npm run test`

## Template
This app was generated from a leaner version of a node typescript boilerplate I use for different projects.<br/>
It includes ESlint, prettier, github actions, TSOA and others.<br/>
Some of which are a bit of an overkill for this app. However, it was actually fester for me to use it + gave me a chance to show the general structure/technologies I use for more complex apps.   

