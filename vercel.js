{
  "version": 2,
  "builds": [
    {
      "src": "./share/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/share/server.js"
    },
    {
      "src": "/",
      "dest": "/share/public/index.html"
    }
  ]
}