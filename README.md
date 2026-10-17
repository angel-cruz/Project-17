# Github pages: https://angel-cruz.github.io/Project-17/shortly-bootstrap/index.html
tracks and displays the location of a given IP address using the IP Geolocation API by IPify  and LeafletJS  for map rendering

# Shortly URL Shortening API – Project Reflection

## Development Process

For this project, I built a responsive URL shortening landing page based on the Frontend Mentor design. I started by organizing the HTML structure, then used Bootstrap 5 to make the layout responsive across desktop and mobile devices. I also added custom CSS to match the original design, including the colors, illustrations, backgrounds, and statistics cards.

Once the layout was complete, I used JavaScript to handle URL validation, display shortened links, and allow users to copy them to their clipboard. I integrated the Bitly API through a Node.js backend to handle the URL shortening requests.

## Challenges Faced

One of the biggest challenges was connecting the frontend to the backend. Initially, I encountered a CORS error because I was opening the HTML file directly instead of running it through the Node.js server.

Another issue was configuring the Bitly API token. The application couldn't find the token, which prevented URLs from being shortened.

## Solutions Implemented

I resolved the CORS issue by running the application through `localhost:3000`. I also created a `.env` file to store the API token separately from the frontend code.

Bootstrap helped simplify the responsive layout, while custom CSS allowed me to maintain the original design. I also added inline comments to explain some of the more complicated JavaScript logic.

## Potential Improvements

Moving forward, I would like to add better error handling, loading animations, and more detailed link analytics. I would also improve accessibility and add automated tests to make sure the application works consistently.

## Final Thoughts

This project helped me better understand API integration, frontend and backend communication, responsive design, and the importance of keeping sensitive information secure.
