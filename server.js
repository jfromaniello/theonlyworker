const express = require('express');
const Jimp = require("jimp");
const favicon = require('serve-favicon');
const path = require('path');

const templatePath = 'template.jpg';
const app = express();
const { promisify } = require('util');

app.use(favicon(path.join(__dirname, templatePath)));

app.get('/:name', async (req, res ,next ) => {
  const name = req.params.name.replace(/.png$/, '');
  const template = await  Jimp.read(templatePath);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  await template.print(font, 175, 570, name);

  //a hack to promisify the getBuffer function
  const getBuffer = promisify(template.getBuffer.bind(template));
  //endof hack

  const buffer = await getBuffer(Jimp.MIME_JPEG);
  res.setHeader('content-type', Jimp.MIME_JPEG);
  res.send(buffer);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
})
