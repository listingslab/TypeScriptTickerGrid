# TypeScript TickerGrid

**Developed in TypeScript using Sublime.** The project is far from perfect and there are some clumsy workarounds here and there. I did want to use an Event based approach, but found problems in Internet Explorer (natch). Setting up the project locally needs a few things...

## Clone the repository
cd to the folder you want to contain your new project and run 
```
git clone git@github.com:listingslab/TypeScriptTickerGrid.git
```

## TypeScript Compiler
The Typescript compiler wrapper. Exposes the [TypeScript command line compiler](https://www.npmjs.com/package/typescript-compiler) to your code.
```
npm install typescript-compiler
```
allows us to run commands like the following to compile and concatonate our JavaScript into the public folder
```
tsc -out public/js/tickergrid.js src/Main.ts
```
## Grunt & LiveReload workflow
We use Grunt to facilitate workflow. The Gruntfile.js is very simple, it's default task is to watch for changes in the /src directory and then compile the TypeScript code into a single file: /public/js/tickergrid.js. There are a few dependencies to install to enable this. cd to the project directory and run
```
npm install
```
Once these components are installed we can simply run the command ```grunt``` in our project directory. Any changes made to .ts files in the /src directory will immediately be compiled into the file /public/js/tickergrid.js. [LiveReload](http://livereload.com/) will pick up the change and refresh the browser for us. 

### Http Server
Due to security factors in some browsers, the XMLHttpRequest used to load the .csv files will not work unless the project is served via an http server. The simplest and easiest way to do this is to install node's [http-server](https://www.npmjs.com/package/http-server). It's is a simple, zero-configuration command-line http server. Simply install it globally by running
```
npm install http-server -g
```
Then type ```http-server``` in the command line from the project directory. The server will automagically serve files from the ./public folder if one exists. Which it does. Then point your browser to http://127.0.0.1:8080/