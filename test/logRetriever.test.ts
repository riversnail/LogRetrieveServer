import { getLinesFromFile } from '../src/logRetriever';
import { promises as fsp } from 'fs';

describe('Test log retriever', () => {
  it('should be able to return the last 5 lines of logs', async () => {
    const fileHandle = await fsp.open('test/data/system.log');
    const fileSize = (await fileHandle.stat()).size;
    const logsBinary = await getLinesFromFile(fileHandle.fd, fileSize, 5);
    const logs = logsBinary.toString('binary');
    const expected = [
      'Jun  5 15:30:50 ZhangXideMacBook-Pro syslogd[112]: This is test log L30',
      'Jun  5 15:19:52 ZhangXideMacBook-Pro syslogd[112]: This is test log L29',
      'Jun  5 15:30:50 ZhangXideMacBook-Pro syslogd[112]: This is test log L28',
      'Jun  5 15:19:52 ZhangXideMacBook-Pro syslogd[112]: This is test log L27',
      'Jun  5 15:07:25 ZhangXideMacBook-Pro syslogd[112]: This is test log L26 with keyword',
    ].join('\n');
    expect(logs).toEqual(expected);
  });

  it('should be able to return the last 5 lines of logs with keyword', async () => {
    const fileHandle = await fsp.open('test/data/system.log');
    const fileSize = (await fileHandle.stat()).size;
    const logsBinary = await getLinesFromFile(fileHandle.fd, fileSize, 5, 'keyword');
    const logs = logsBinary.toString('binary');
    const expected = [
      'Jun  5 15:07:25 ZhangXideMacBook-Pro syslogd[112]: This is test log L26 with keyword',
      'Jun  5 15:19:52 ZhangXideMacBook-Pro syslogd[112]: This is test log L23 with keyword',
      'Jun  5 15:19:52 ZhangXideMacBook-Pro syslogd[112]: This is test log L19 with keyword',
      'Jun  5 15:07:25 ZhangXideMacBook-Pro syslogd[112]: This is test log L6 with keyword',
      'Jun  5 15:30:50 ZhangXideMacBook-Pro syslogd[112]: This is test log L4 with keyword',
    ].join('\n');
    expect(logs).toEqual(expected);
  });

  it('Should return whole logfile if number of lines requested is greater than the total', async () => {
    const fileHandle = await fsp.open('test/data/system.log');
    const fileSize = (await fileHandle.stat()).size;
    const logsBinary = await getLinesFromFile(fileHandle.fd, fileSize, 1000);
    const logs = logsBinary.toString('binary');
    const expectedLogs = await fsp.readFile('test/data/system.log');
    let expected = expectedLogs.toString('binary').split('\n').reverse().join('\n').slice(1);
    expect(logs).toEqual(expected);
  });

  it('Should still able to return the whole line when the buffer size is smaller than a line', async () => {
    jest.mock('../src/constants', () => ({
      BUFFER_LENGTH: '2',
    }));
    const fileHandle = await fsp.open('test/data/system.log');
    const fileSize = (await fileHandle.stat()).size;
    const logsBinary = await getLinesFromFile(fileHandle.fd, fileSize, 1);
    const logs = logsBinary.toString('binary');
    const expected = 'Jun  5 15:30:50 ZhangXideMacBook-Pro syslogd[112]: This is test log L30';
    expect(logs).toEqual(expected);
  });
});
