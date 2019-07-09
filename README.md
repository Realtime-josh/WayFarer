[![Build Status](https://travis-ci.com/Realtime-josh/WayFarer.svg?branch=develop)](https://travis-ci.com/Realtime-josh/WayFarer)
[![Maintainability](https://api.codeclimate.com/v1/badges/a0486eea2f1e5fa4df8e/maintainability)](https://codeclimate.com/github/Realtime-josh/WayFarer)
[![Coverage Status](https://coveralls.io/repos/github/Realtime-josh/WayFarer/badge.svg?branch=develop)](https://coveralls.io/github/Realtime-josh/WayFarer?branch=develop)
# WayFarer 
WayFarer is a public Bus transportation booking server.

# Features
* Users can sign up.
* Users can sign in.
* Admin can create a trip.
* Admin can cancel a trip.
* Both Admin and Users can see all trips.
* An Admin can see all bookings, while user can see all of his/her bookings.
* Users can delete their booking.
* Users can specify their seat numbers when making a booking.

# Project Management
* https://www.pivotaltracker.com/n/projects/2358457
## Running App
* Install Node.js on your computer and run the command: "npm start" at the root directory of the project.
# Testing
* Run "npm test" at the root directory of the project.
# API Routes
| Endpoint  | Functionality | Notes |
| ------------- | ------------- |------------- |
|POST /auth/signup|Register a user |This endpoint creates a new user.
|POST /auth/signin|Log in a user |This endpoint signs in a new user.
|POST /trips|Admin can create trip |This endpoint creates a new trip.
|PATCH /trips/id|Admin can cancel trip |This endpoint cancels an already existing trip.
|GET /trips|Admin and User can see all trips |This endpoint retrieves all existing trips.
|POST /bookings|User can create booking |This endpoint creates a new booking.
|GET /bookings|User can see bookings. |This endpoint retrieves all bookings for admin and bookings perculiar to user who is non-admin.

