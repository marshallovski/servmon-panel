#!/bin/bash

cd ./backend/
npm start &  # The '&' runs the command in the background
echo started panel backend

cd ..
cd ./frontend/
npm start &  # The '&' runs the command in the background
echo started panel frontend

wait # This command will wait for all background processes to finish.
