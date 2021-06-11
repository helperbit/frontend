# Helperbit Frontend

## Install deps

```bash
npm install
cd app/widgets 
npm install
```


## Build

### Build with development env

```bash
npm run build:dev
```

The widget will build separately; to start the widget build, first build the angular app,
then run:

```bash
npm run widget
```

Then run again the angular build.

### Build with production env testnet

```bash
npm run build:testnet
```

### Build with production env mainnet

```bash
npm run build:mainnet
```

## Run

```bash
npm run watch:dev
```

## Bundle analyzer

```bash
npm run build:stats
npm run bundle-report
```
