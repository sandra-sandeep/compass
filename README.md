# compass

Compass Letters journalling app

## v0.1 Release Notes

### Highlights

  - Beautiful UI
  - UI and backend talked to each other within a few commits ago
  - Setup a domain and a server with a static IP address
  - Setup HTTPS / SSL Certificate
  - Automated Lightsail instance setup
  - Demonstrated OpenAI API calls

### Issues

  - Does not run locally because it depends on NGINX now and we haven't set that up for development
  - Calls to the backend hang for some reason (or get SSL errors)

### Next Steps

- Setup a reverse proxy so that the UI and backend can talk to each other without CORS issues
- Containerize/dockerize the app
- Setup firebase database