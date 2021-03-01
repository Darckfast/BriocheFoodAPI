FROM node:lts-alpine as builder
WORKDIR /build

COPY . .
RUN yarn && yarn build && rm -rf node_modules

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile

FROM node:lts-alpine
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup

USER appuser

COPY --from=builder /build/dist .
COPY --from=builder /build/node_modules node_modules

EXPOSE 3333

HEALTHCHECK --interval=5s --timeout=10s --start-period=5s --retries=3 \
  CMD wget http://localhost:3333/api/v1/health -q -O - > /dev/null 2>&1

CMD ["node", "server.js"]