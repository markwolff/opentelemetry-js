'use strict';

const opentelemetry = require('@opentelemetry/core');
const opentelemetryTypes = require('@opentelemetry/types')
/**
 * The trace instance needs to be initialized first, if you want to enable
 * automatic tracing for built-in plugins (HTTP in this case).
 */
const config = require('./setup');
config.setupTracerAndExporters('http-server-service');
const tracer = opentelemetry.getTracer();
const express = require('express');
const app = express();
const axios = require('axios').default;
const util = require('util');
const PORT = 8080;

async function main() {
  const redis = await require('./setup-redis').redis;

  app.get('/deep', (req, res) => {
    const span = tracer.startSpan('express.get(/deep)', {
      parent: tracer.getCurrentSpan(),
      kind: opentelemetryTypes.SpanKind.SERVER
    });

    tracer.withSpan(span, async () => {
      const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await axios.get(`http://localhost:${PORT}/set?args=uuid,${uuid}`);
      const response = await axios.get(`http://localhost:${PORT}/get?args=uuid`);

      if (response.data !== uuid) {
        console.log('UUID did not match', response);
        span.setStatus({ code: opentelemetryTypes.CanonicalCode.INTERNAL, message: 'UUID did not match' });
        res.status(500).send(response);
      } else {
        span.setStatus({ code: opentelemetryTypes.CanonicalCode.OK });
        res.sendStatus(200);
      }
      span.end();
    });
  });

  app.get('/:cmd', (req, res) => {
    if (!req.query.args) {
      res.status(400).send('No args provided');
      return;
    }
    const cmd = req.params.cmd;
    const args = req.query.args.split(',');
    const span = tracer.startSpan(`express.get(/${cmd})`, {
      parent: tracer.getCurrentSpan(),
      kind: opentelemetryTypes.SpanKind.SERVER,
      attributes: {
        component: 'express',
        'http.query.args': req.query.args
      }
    });
  
    tracer.withSpan(span, () => {
      try {
        redis[cmd].call(redis, ...args, (error, result) => {
          if (error) {
            span.setStatus({ code: opentelemetryTypes.CanonicalCode.OK, message: error.message });
            res.status(200).send(error.message);
            return;
          } else {
            res.status(200).send(result);
            span.setStatus({ code: opentelemetryTypes.CanonicalCode.OK });
          }
        });
      } catch (e) {
        span.setStatus({ code: opentelemetryTypes.CanonicalCode.CANCELLED, message: e.message });
        res.status(400).send(e.message);
      }
      span.end()
    });
  });
}

main().then(() => {
  app.listen(PORT);
  console.log(`Listening on http://localhost:${PORT}`)
});
