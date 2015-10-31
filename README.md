# TypeScript TickerGrid

## 1. TypeScript Module
The internal module encapsulates the functionality, and prevents pollution of the global namespace.

Aside from the Main class, which is entry point to the application, TickerGrid comprises a View class, a Model Class and an interface called iCompany.

These are all compiled into a single JavaScript file called tickergrid.js

## 2. Model Class

The Model handles the loading, storage and parsing of the data. It's first job is to load the snapshot file, parse it into an array of Company objects and then send a message to the View to render the grid to the DOM.

The second part of the model's job is to provide an engine to process the deltas, update the Company objects with new data and then communicate those changes to the View to be shown in the UI.

## 3. View Class
The view's job is to interact with the DOM as efficiently as possible using the Model's data. The approach I've taken is to create and render a table to an existing div on the page.

When the Model emits a message to update a row, the view class creates a new 'tr' element and replaces the old row with the new element.

## 4. CSS Animation

Notification that an item has been updated via a visual flare in the UI is handled by <a href="css/style.css" target="_blank">CSS</a>, thus offloading animation logic to the browser itself, which it is efficient at.

I wanted to try out the CSS3 @keyframes technique because I used to be a Flash Developer and was interested to discover more options for making a UI look and feel great.

**Developed in TypeScript using Sublime.**

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
Once these components are installed we can simply run the command ```grunt``` in our project directory. Any changes made to .ts files in the /src directory will immediately be compiled into the file /public/js/tickergrid.js.

### Http Server
Because of browser secrurity restrictions we need a local webserver to run the TickerGrid app. We use a NodeJS static http server called live-server because it automatically reloads the page when the code changes.
```
npm install -g live-server
```
cd to the public folder and run ```live-server``` and hey presto.
