import fs from 'fs';
import { promisify } from 'util';
import { BUFFER_LENGTH } from './constants';

const read = promisify(fs.read);
export async function getLinesFromFile(
  fd: number,
  fileSize: number,
  numberLines: number,
  keyword?: string,
): Promise<Buffer> {
  const buffer = Buffer.alloc(BUFFER_LENGTH);
  let charCount = 0;
  let lineCount = 0;
  let reading = true;
  let lines = '';
  let currentLine = '';

  while (reading) {
    const currentChunk = await readPreviousChunk(fd, fileSize, charCount, buffer);
    const currentChunkLen = currentChunk.length;
    if (currentChunkLen === 0) break;

    for (let i = currentChunkLen - 1; i >= 0; i--) {
      currentLine = currentChunk[i] + currentLine;

      if (currentChunk[i] === '\n') {
        const keywordMatch = isKeywordMatch(currentLine, keyword);
        lineCount = updateLineCount(keywordMatch, currentChunkLen, charCount, lineCount, i);
        if (keywordMatch) lines += currentLine;
        currentLine = '';
        if (lineCount >= numberLines) {
          reading = false;
          break;
        }
      }
    }
    charCount += currentChunkLen;
  }
  const keywordMatch = isKeywordMatch(currentLine, keyword);
  if (keywordMatch && currentLine.length > 0) lines += '\n' + currentLine;
  const linesProcessed = removeLeadingNewline(lines);
  return Buffer.from(linesProcessed, 'binary');
}

async function readPreviousChunk(
  fd: number,
  fileSize: number,
  currentTotalCount: number,
  buffer: Buffer,
): Promise<string> {
  const charsToRead = buffer.length;
  const readEnd = fileSize - currentTotalCount;
  const readStart = charsToRead <= readEnd ? readEnd - charsToRead : 0;
  await read(fd, buffer, 0, charsToRead, readStart);
  return buffer.subarray(0, readEnd).toString('binary');
}

function updateLineCount(
  isMatch: boolean,
  currentChunkLen: number,
  charCount: number,
  lineCount: number,
  index: number,
): number {
  if ((charCount > 0 || index < currentChunkLen - 1) && isMatch) return ++lineCount;
  return lineCount;
}

function isKeywordMatch(currentLine: string, keyword?: string): boolean {
  //Always return true if there is no keyword
  if (keyword == null || currentLine.includes(keyword)) {
    return true;
  }
  return false;
}

function removeLeadingNewline(lines: string): string {
  while (lines[0] === '\n') lines = lines.slice(1);
  return lines;
}
