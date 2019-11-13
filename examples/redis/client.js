'use strict'

const opentelemetry = require('@opentelemetry/core');
const types = require('@opentelemetry/types');
const config = require('./setup');
config.setupTracerAndExporters('http-server-service');
const tracer = opentelemetry.getTracer();
const axios = require('axios').default;

function makeRequest() {
    const span = tracer.startSpan('client.makeRequest()', {
        parent: tracer.getCurrentSpan(),
        kind: types.SpanKind.CLIENT
    });

    tracer.withSpan(span, async () => {
        try {
            const res = await axios.get('http://localhost:8080/deep');
            console.log(res.statusText);
        } catch (e) {
            span.setStatus({ code: types.CanonicalCode.UNKNOWN, message: e.message });
        }
        span.end();
    });
}

makeRequest();