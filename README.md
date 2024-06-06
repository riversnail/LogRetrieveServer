# Log Retriever Service
## Introduction
Hello, welcome to my first project with NodeJS. This service provide on-demand monitoring without the user needing to login to the machine and open the log files.

The service provides support to specify filename with /var/log, number of log entries to retrieve, and keyword matches for the log entries. The logs being retured by this service is newest log event first.

## Design
![design](https://github.com/riversnail/LogRetrieveServer/blob/main/docs/design.png)\
Since we need to be able to read large log files effeciently, instead of read the whole file all at once, we want to only read as much data as we need.

The log retriever opens the file, read a chunk of data into a buffer from the bottom of the file(buffer size is configurable in src/constants.ts). Then the log retriever process the data from the buffer backwards to build log entries with newline character as eliminator. Continue reading from the log file to get the next buffer after finished processing the current buffer. Stop processing and return the data if it reachs to the n number of entries that user specified or the whole log file has been processed.

## How to run the service
Step 1: Compile the TypeScript code.\
`npm run build`\
Step 2: Run the service.\
`npm start`
## How to use the service
The service is running on port 3000.\
Visit/send a request with fileName, numberLines(Optional), and keyword(Optional) as query parameters to use the service.

fileName: a filename within /var/log.\
numberLines: number of log entries to retrieve, default to 10 if not provided.\
keyword: text/keyword matches for the log entries.

Example: If the service is running on localhost and we want to send a request with the following query parameters.

fileName: system.log\
numberLines: 3\
keyword: hello

The url would be: \
`localhost:3000/?fileName=system.log&numberLines=3&keyword=hello`