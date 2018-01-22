<p align="center">
  <a href="https://circleci.com/gh/seniorly/SlyReact"><img src="https://circleci.com/gh/seniorly/SlyReact.svg?style=svg"/></a>
</p>

<br />


## `redux-ssr`

- **[Demo](https://arc.js.org)**
- **[Documentation](https://github.com/diegohaz/arc/wiki)**

## Branches

- ### [`master`](https://github.com/diegohaz/arc)

  The basic stack with [React](https://facebook.github.io/react/), [Webpack](https://github.com/webpack/webpack), [react-router](https://github.com/ReactTraining/react-router) and [Jest](https://facebook.github.io/jest/).

  - ### [`redux`](https://github.com/diegohaz/arc/tree/redux) <sup><sub>([compare](https://github.com/diegohaz/arc/compare/master...redux?diff=split#files_bucket))</sub></sup>

    Master plus [redux](https://github.com/reactjs/redux), [redux-saga](https://github.com/yelouafi/redux-saga) and [redux-form](https://github.com/erikras/redux-form).

    - ### [`redux-ssr`](https://github.com/diegohaz/arc/tree/redux-ssr) <sup><sub>([compare](https://github.com/diegohaz/arc/compare/redux...redux-ssr?diff=split#files_bucket))</sub></sup>

      Redux plus [Server Side Rendering](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md)

## Setup

### 1. Get the source code

Just clone one of the ARc [branches](#branches):
```sh
$ git clone -b redux-ssr https://github.com/diegohaz/arc my-app
$ cd my-app
```

You will probably want to remove ARc git history and start a brand new repository:
```sh
$ rm -rf .git
$ git init
```

### 2. Install dependencies

```sh
$ npm install
```

### 3. Run the app

```sh
$ npm run dev
```

It will start the development server with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000](http://localhost:3000) — Development server<br>
> [http://localhost:3001](http://localhost:3001) — Webpack assets server (for `redux-ssr` only)<br>

Now you can open [http://localhost:3000](http://localhost:3000) in browser and start developing.

## Contributing

When submitting an issue, use the following patterns in the title for better understanding:
```bash
[v0.3.1-redux] Something wrong is not right # the v0.3.1 release of the redux branch
[redux] Something wrong is not right # the actual code of the redux branch
Something wrong is right # general, related to master or not directly related to any branch
```

PRs are very appreciated. For bugs/features consider creating an issue before sending a PR.

## License

MIT © [Diego Haz](https://github.com/diegohaz)
