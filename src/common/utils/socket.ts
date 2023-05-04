import os from 'os';
import { Readable } from 'stream';

import nodeFetch, { RequestInit } from 'node-fetch-unix';
import { ReadableStream } from 'stream/web';

import { API_SCHEMA } from '../constants/meta';

export function getSocketPath(socketName: string) {
  if (os.platform() === 'win32') {
    return `//./pipe/${socketName}`;
  }
  return `/tmp/${socketName}.sock`;
}

export function getSocketUrl(socketName: string, pathname = '') {
  if (os.platform() === 'win32') {
    return `unix:////./pipe/${socketName}:${pathname}`;
  }
  return `unix:///tmp/${socketName}.sock:${pathname}`;
}

export function redirectRequest(req: Request) {
  const url = req.url;
  const urlObj = new URL(url);
  const newUrl = getSocketUrl(API_SCHEMA, urlObj.pathname);

  const body = req.body
    ? Readable.fromWeb(req.body as ReadableStream<Uint8Array>)
    : undefined;
  const newReq: RequestInit = {
    ...req,
    method: req.method,
    headers: req.headers as any,
    body,
  };

  return nodeFetch(newUrl, newReq).then((res) => {
    const readable = new Readable().wrap(res.body);
    return {
      ...res,
      status: res.status,
      headers: res.headers || {},
      body: Readable.toWeb(readable),
    } as unknown as Response;
  });
}
