# boxnote2markdown
[BoxNote2Markdown](https://communicatehealth.github.io/boxnote2markdown) provides the javascript to enable a bookmarklet, [boxnote2markdown.js](https://communicatehealth.github.io/boxnote2markdown/boxnote2markdown.js) that, when run on a [Box Notes](https://www.box.com/notes) page, converts the content of that page to markdown text.

Example bookmarklet code:
```
javascript:(function(){var s=document.createElement("script");s.src="https://communicatehealth.github.io/boxnote2markdown/boxnote2markdown.js";document.body.appendChild(s);})()
```
