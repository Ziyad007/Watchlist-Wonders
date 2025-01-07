// Importing the dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();
const app=express();
const port=process.env.PORT;

// Middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//API Authorization Header Setup
const Auth={
    headers: {
        Authorization: `Bearer ${process.env.API_KEY}`
      }
};

// Base URL for TMDB API
const Base="https://api.themoviedb.org/3/";

// Home Page
app.get("/",async (req,res)=>{
    try {
        const popularMovie=await axios.get(`${Base}movie/popular?language=en-US&page=1`,Auth);
        const popularTv=await axios.get(`${Base}tv/popular?language=en-US&page=1`,Auth);
        const topMovies=await axios.get(`${Base}movie/top_rated?language=en-US&page=1`,Auth);
        const topTv=await axios.get(`${Base}tv/top_rated?language=en-US&page=1`,Auth);
        res.render("index.ejs",{ 
            Movies:popularMovie.data.results.slice(0,4),
            TV:popularTv.data.results.slice(0,4),
            topMov:topMovies.data.results.slice(0,4),
            topTv:topTv.data.results.slice(0,4)
        });
    } catch (error) {
        res.render("Error.ejs",{ Movies:"Error",TV:"Error",topMov:"Error",topTv:"Error"});
    } 
});

// Search Result
app.get("/search",async(req,res)=>{
    try {
        const movieResponse= await axios.get(`${Base}search/movie?query=${req.query.query}&include_adult=false&language=en-US&page=1`,Auth);
        const tvResponse= await axios.get(`${Base}search/tv?query=${req.query.query}&include_adult=false&language=en-US&page=1`,Auth);
        const hasResults=movieResponse.data.results.length>0 || tvResponse.data.results.length>0; //Check if any valid responses to search request
        res.render("Search.ejs",{
            Movies:movieResponse.data.results,
            TV:tvResponse.data.results, 
            hasResults:hasResults
        });
    } catch (error) {
        res.render("Search.ejs",{Movies:"Error 404",TV:"Error",hasResults:false});
    } 
});

// Popular Movies
app.get("/popularMovie",async(req,res)=>{
    try {
        const page=parseInt(req.query.page)||1;
        const movieResponse=await axios.get(`${Base}movie/popular?language=en-US&page=${page}`,Auth);
        const totalPages=Math.floor(movieResponse.data.total_results/10); //20 movies on one page
        res.render("MovieList.ejs",{ 
            Page:page, 
            Movies:movieResponse.data.results,
            totalPages:totalPages,
            Title:"Popular Movies Now",
            Href:"/popularMovie"
        });
    } catch (error) {
        res.render("MovieList.ejs",{ 
            Page:"Error", 
            Movies:"Error",
            totalPages:"Error",
            Title:"Error",
            Href:"Error"});
    }
});

// Popular TV Series
app.get("/popularTv",async(req,res)=>{
    try {
        const page=parseInt(req.query.page)||1;
        const tvResponse=await axios.get(`${Base}tv/popular?language=en-US&page=${page}`,Auth);
        const totalPages=Math.floor(tvResponse.data.total_results/10); //20 movies on one page
        res.render("TvList.ejs",{ 
            Page:page, 
            TV:tvResponse.data.results, 
            totalPages:totalPages,
            Title:"Popular TV Series Now",
            Href:"/popularTv"
        });
    } catch (error) {
        res.render("TvList.ejs",{ 
            Page:"Error", 
            TV:"Error", 
            totalPages:"Error",
            Title:"Error",
            Href:"Error"
         });
    }
});

// My List
app.get("/myList",async(req,res)=>{
    const movieId=[ 361743,324857,156022,359724,157336,693134,2770];
    try {
        const movies=[];
        for(const id of movieId){
            const response=await axios.get(`${Base}movie/${id}?language=en-US`, Auth);
            movies.push(response.data);
        }
        res.render("MyList.ejs",{movies});
    } catch (error) {
        res.render("MyList.ejs",{movies:"Error"});
    }
});

//Top Rated Movies
app.get("/topMovies",async(req,res)=>{
    try {
        const page=parseInt(req.query.page)||1;
        const movieResponse=await axios.get(`${Base}movie/top_rated?language=en-US&page=${page}`,Auth);
        const totalPages=Math.floor(movieResponse.data.total_results/10); //20 movies on one page
        res.render("MovieList.ejs",{ 
            Page:page, 
            Movies:movieResponse.data.results,
            totalPages:totalPages,
            Title:"Top Rated Movies",
            Href:"/topMovies"
        });
    } catch (error) {
        res.render("MovieList.ejs",{
            Page:"Error", 
            Movies:"Error",
            totalPages:"Error",
            Title:"Error",
            Href:"Error"
         });
    }
});

//Top Rated Shows
app.get("/topTv",async(req,res)=>{
    try {
        const page=parseInt(req.query.page)||1;
        const tvResponse=await axios.get(`${Base}tv/popular?language=en-US&page=${page}`,Auth);
        const totalPages=Math.floor(tvResponse.data.total_results/10); //20 movies on one page
        res.render("TvList.ejs",{ 
            Page:page, 
            TV:tvResponse.data.results, 
            totalPages:totalPages ,
            Title:"Top Rated TV Series",
            Href:"/topTv"
        });
    } catch (error) {
        res.render("TvList.ejs",{
            Page:"Error", 
            TV:"Error", 
            totalPages:"Error",
            Title:"Error",
            Href:"Error"
         });
    }
});

//Movie Details Page
app.get("/movie/:id",async(req,res)=>{
    try {
        const movieId=req.params.id;
        console.log(movieId);
        const review=await axios.get(`${Base}movie/${movieId}/reviews?language=en-US&page=1`,Auth);
        const response=await axios.get(`${Base}movie/${movieId}?language=en-US`,Auth);
        const credits=await axios.get(`${Base}movie/${movieId}/credits?language=en-US`,Auth);
        res.render("DetailsMovie.ejs",{ 
            Movie: response.data, 
            Reviews:review.data.results.slice(0,3),
            Credits:credits.data
        });
    } catch (error) {
        res.render("DetailsMovie.ejs",{ 
            Movie:"Error",
            Reviews:"No reviews",
            Credits:"Error"
        });
    }
});

// TV Series Details Page
app.get("/series/:id",async(req,res)=>{
    try {
        const tvId=req.params.id;
        console.log(tvId);
        const review=await axios.get(`${Base}tv/${tvId}/reviews?language=en-US&page=1`,Auth);
        const response=await axios.get(`${Base}tv/${tvId}?language=en-US`,Auth);
        const credits=await axios.get(`${Base}tv/${tvId}/credits?language=en-US`,Auth);
        res.render("DetailsTv.ejs",{ 
            Tv: response.data, 
            Reviews:review.data.results.slice(0,3),
            Credits:credits.data
        });
    } catch (error) {
        res.render("DetailsTv.ejs",{ 
            Tv:"Error",
            Reviews:"No reviews",
            Credits:"Error"});
    }
});

//Watch Movie Trailer
app.get("/watch-trailer-movies/:id", async (req, res) => {
    const movieId = req.params.id;
    try {
        const trailer = await axios.get(`${Base}movie/${movieId}/videos?language=en-US`, Auth);
        const review=await axios.get(`${Base}movie/${movieId}/reviews?language=en-US&page=1`,Auth);
        const response=await axios.get(`${Base}movie/${movieId}?language=en-US`,Auth);
        const credits=await axios.get(`${Base}movie/${movieId}/credits?language=en-US`,Auth);
        console.log(trailer.data.results);
        res.render("DetailsMovie.ejs", { 
            Movie: response.data, 
            Reviews:review.data.results.slice(0,3),
            Credits:credits.data,
            trailers: trailer.data.results 
        });
    } catch (error) {
        res.render("DetailsMovie.ejs", { 
            Movie:"Error", 
            Reviews:"Error",
            Credits:"Error",
            trailers:"Error"
         });
    }
});

//Watch Tv Series Trailer
app.get("/watch-trailer-tv/:id", async (req, res) => {
    const tvId = req.params.id;
    try {
        const trailer = await axios.get(`${Base}tv/${tvId}/videos?language=en-US`, Auth);
        const review=await axios.get(`${Base}tv/${tvId}/reviews?language=en-US&page=1`,Auth);
        const response=await axios.get(`${Base}tv/${tvId}?language=en-US`,Auth);
        const credits=await axios.get(`${Base}tv/${tvId}/credits?language=en-US`,Auth);
        console.log(trailer.data.results);
        res.render("DetailsTv.ejs", { 
            Tv: response.data, 
            Reviews:review.data.results.slice(0,3),
            Credits:credits.data,
            trailers: trailer.data.results 
        });
    } catch (error) {
        res.render("DetailsTv.ejs", { 
            Tv:"Error", 
            Reviews:"Error",
            Credits:"Error",
            trailers:"Error"
         });
    }
});

//Upcoming Movies
app.get("/Upcoming",async(req,res)=>{
    try {
        
        const page=parseInt(req.query.page)||1;
        const response=await axios.get(`${Base}movie/upcoming?language=en-US&page=${page}`,Auth);        
        const totalPages=Math.floor(response.data.total_results/10); //20 movies on one page
        res.render("Upcoming.ejs",{ 
            Page:page, 
            totalPages:totalPages, 
            Movies:response.data.results
        });

    } catch (error) {
        res.render("Upcoming.ejs",{ Movies:"Error"});
    } 
});

// Start the server
app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
    console.log(`http://localhost:${port}`);
});