# Log Retriever Server
## Introduction
Hello, welcome to my first project with NodeJS.

## How to run the service
Step 1: Compile the TypeScript code.
`npm run build`
Step 2: Run the service.
`npm start`
## How to use the service
The service is running on port 3000.
Visit/send a request with fileName, numberLines(Optional), and keyword(Optional) as query parameters to use the service.

fileName: a filename within /var/log.
numberLines: number of log entries to retrieve, default to 10 if not provided.
keyword: text/keyword matches for the log entries.

Example: If the service is running on localhost and we want to send a request with the following query parameters.

fileName: system.log
numberLines: 3
keyword: hello

The url would be: 
`localhost:3000/?fileName=system.log&numberLines=3&keyword=hello`