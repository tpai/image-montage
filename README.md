# Image Montage
Automatic load random image from imgur.

![](http://i.giphy.com/l0MYDm8HCJ46uQM5a.gif)

## How To Run Demo

**Install Dependencies**

```
npm i
```

**Set Environment Variable**

.env

```
CLIENT="CLIENT ID xxxxxxxx"
```

**Run Server**

```
npm start
```

## How To Develoap / Build

**Babel Watch**

```
npm run dev
```

**Minify With Babili**

```
npm run build
```

## Usage

**Init**

Define default container.

```
var im = new ImageMontage('#targetContainerId');
```

**First Time Launch**

Many random size bricks will fill up window, and start to replace bricks with images which are preloaded.

```
im.initBricks(data);
```

**Infinite Refresh**

Call API for new images every 60s and display.

```
setInterval(function() {
    fetchImages(function(data) { im.displayImages(data); });
}, 60000);
```
