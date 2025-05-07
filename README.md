# Boilerplat service
Ready to use for all service in the project.

## Tech stack:
- ExpressJS
- Mongoose
- Kafka
- Redis
- Docker

## This template included:
- Authentication middleware
- Cache (redis) middleware
- Cross Service middleware
- params, response middleware
- TraceId middleware

- Redis singleton wrapper
- Kafka singleton wrapper
- Jest test
- Winston logger


## Installation

ensure your local environment installed Docker, yarn, nodejs

```bash
yarn
```

## Usage

Before running, don't forget generate service key for cross service api calling use:

```
sh bin/genkey.sh -v=v1
```
The public key need to be store in the config service like this

![Alt text](./cross-service-key-stored.png?raw=true "Title")



for local development

```
yarn up local
```

for prodution

```
yarn up prod
```

## Contributing

Contributions are welcome!

## License

MIT