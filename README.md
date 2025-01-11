# Watchlist-Wonders
## Movie & TV Show Web App
A simple web application built with Express.js, EJS, Axios, and the Movie Database API (TMDb) that allows users to explore popular movies and TV shows, view their details, and search for content. The application supports features like viewing popular and top-rated movies and TV series, upcoming releases, and more. It also allows users to view trailers and reviews.

## Install dependencies
Before running the app, you need to install the required dependencies. Run the following command:
```
npm install
```
This will install all the necessary packages defined in the package.json file.

### Set up environment variables
You need to add your TMDb API key in the environment file for the app to work properly.
Create a .env file in the root of the project directory, and add the following lines:
```
API_KEY=your_tmdb_api_key
PORT=3000
```
Replace your_tmdb_api_key with your actual TMDb API key, which you can obtain from TMDb.

### Run the app
Run the following command:
```
npm start
```
The app will start and you should see a message like this in your terminal:
```
Listening to port 3000
http://localhost:3000
```


