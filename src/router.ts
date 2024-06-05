import express from 'express';
import { promises as fsp } from 'fs';
import { DEFAULT_LINENO } from './constants';
import { getLinesFromFile } from './logRetriever';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    var query = require('url').parse(req.url, true).query;
    const fileName = '/var/log/' + query.fileName;
    const fileHandle = await fsp.open(fileName);
    const fileSize = (await fileHandle.stat()).size;
    const numberLines = query.numberLines == null ? DEFAULT_LINENO : query.numberLines;
    const logs = await getLinesFromFile(fileHandle.fd, fileSize, numberLines, query.keyword);
    await fileHandle.close();
    res.send(logs);
  } catch (e) {
    if (isErrnoException(e) && e.code === 'ENOENT')
      res.send('File not found: ' + '/var/log/' + req.body.fileName);
    else {
      console.log(e);
      res.status(500).send('Internal Server Error');
    }
  }
});

function isErrnoException(e: unknown): e is NodeJS.ErrnoException {
  if ('code' in (e as any)) return true;
  else return false;
}

export default router;