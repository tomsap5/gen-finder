import { init as initWebserver } from "../../src/setup/webserver/init-web-server";
import { Express } from "express";
import request from "supertest";
import _ from "lodash";

export async function getTestWebServer(baseUrl?: string) {
  const { app, server } = await initWebserver(0);
  return new TestWebserver(app, server, baseUrl);
}

export class TestWebserver {
  constructor(private app: Express, private server, private baseUrl) {}

  request() {
    return new TestWebRequest(this.app, this.baseUrl);
  }

  close() {
    return this.server.close();
  }
}

export class TestWebRequest {
  app: Express;
  baseUrl: string;

  constructor(app: Express, baseUrl: string) {
    this.app = app;
    this.baseUrl = baseUrl;
  }

  async get({ path, queryParams = {} }: { path?: string; queryParams?: any } = {}) {
    const headers: Headers = await this.getHeaders();
    return request(this.app).get(this.buildUrl(path)).query(queryParams).set(headers);
  }

  async post({ path, payload = {} }: PathAndPayload = {}) {
    const headers: Headers = await this.getHeaders();
    return request(this.app).post(this.buildUrl(path)).send(payload).set(headers);
  }

  async put({ path, payload = {} }: PathAndPayload = {}) {
    const headers: Headers = await this.getHeaders();
    return request(this.app).put(this.buildUrl(path)).send(payload).set(headers);
  }

  async del({ path, payload = {} }: PathAndPayload = {}) {
    const headers: Headers = await this.getHeaders();
    return request(this.app).del(this.buildUrl(path)).send(payload).set(headers);
  }

  private async getHeaders(): Promise<Headers> {
    const headers: Headers = {};
    return _.pickBy(headers);
  }

  private buildUrl(path: string) {
    if (!this.baseUrl) {
      return path;
    }
    return `${this.baseUrl}${path || ""}`;
  }
}

type PathAndPayload = {
  path?: string;
  payload?: any;
};

type Headers = Partial<{
  Authorization: string;
}>;
