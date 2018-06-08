(function(){
  var service_iframe = document.getElementById('service_iframe');
  if(service_iframe){
    alert("Please run this bookmarklet again when the page reloads.");
    document.location = service_iframe.getAttribute("src");
    return;
  }
  var frame = document.querySelector('.pad[data-active-state="active"] iframe');
  if(!frame) frame = document.querySelector('.pad iframe');
  var doc = frame.contentWindow.document.getElementById("innerdocbody");
  var out = "# "+doc.querySelector('#titleContainer h1').innerHTML+"\n";
  var nodes = doc.querySelector('#editor-content-editable').childNodes;
  function parseDiv(nodes, noReturn){
    var out = '',i,h2=false,h3=false,spanCount=0;
    for(i=0;i<nodes.length;++i){
      var node = nodes[i];
      switch(node.nodeName){
      case "SPAN": 
        ++spanCount;
        h2 |= node.classList.contains("font-size-verylarge") ? 1:0;
        h3 |= node.classList.contains("font-size-large") ? 1:0;
      }
    }
    if(h2){
      out += "## "
      h3=false;
    }
    if(h3){
      out += "### "
      h3=false;
    }
    for(i=0;i<nodes.length;++i){
      var node = nodes[i],indent,li;
      switch(node.nodeName){
      case "DIV":
        out += parseDiv(node.childNodes); 
        break;
      case "SPAN":
        if( node.classList.contains("font-size-small") ) out += "<sup><sub>";
        if( node.classList.contains("u") ) out += "<ins>";
        if( node.classList.contains("b") ) out += "**";
        if( node.classList.contains("i") ) out += "*";
        out+=node.innerHTML.replace(/\*/g,"\\*").replace(/_/g,"\\_").replace(/<\/?[bui]>/g,"");
        if( node.classList.contains("i") ) out += "*";
        if( node.classList.contains("b") ) out += "**";
        if( node.classList.contains("u") ) out += "</ins>";
        if( node.classList.contains("font-size-small") ) out += "</sub></sup>";
        break;
      case "OL":
      case "UL":
        indent = parseInt(node.className.replace(/.*(\d+).*/,"$1")) || 1;
        out+="                     ".substr(0,(indent-1)*3);
        if(node.className.indexOf("list-number")>-1) out += "1. ";
        if(node.className.indexOf("list-unchecked")>-1) out += "- [ ] ";
        if(node.className.indexOf("list-checked")>-1) out += "- [X] ";
        if(node.className.indexOf("list-bullet")>-1) out += "* ";
        li = node.querySelector('li');
        out += parseDiv(li.childNodes,true); 
        break;
      }
    }
    if(!noReturn) out += "\n\n";
    return out;
  }
  function parseTable(nodes){
    var out = '', i, node, firstRow = true, firstCol, cols, tds, j, td, k, div;
    for(i=0;i<nodes.length;++i){
      node = nodes[i];
      switch(node.nodeName){
        case "TR": 
          tds = node.childNodes;
          firstCol = true, cols = 0;
          for(j=0;j<tds.length;++j){
            td = tds[j];
            if(td.nodeName === "TD") {
              ++cols;
              if(!firstCol) out += " | ";
              firstCol = false;
              for(k=0;k<td.childNodes.length;++k){
                var div = td.childNodes[k];
                if(div.nodeName === "DIV"){
                  out += parseDiv(div.childNodes,true);
                }
              }
            }
          }
          out += "\n";
          if(firstRow) {
            firstCol = true;
            for(j=0;j<cols;++j){
              if(!firstCol) out += " | ";
              firstCol = false;
              out += "---";
            }
            out += "\n";
          }
          firstRow = false;
        break
      }
    }
    return out;
  }
  for(var i=0;i<nodes.length;++i){
    var node = nodes[i];
    switch(node.nodeName){
      case "DIV": out += parseDiv(node.childNodes); break;
      case "TABLE": out += parseTable(node.childNodes); break;
      break
    }
  }
  var popover = document.createElement('textarea');
  popover.id="popover";
  popover.setAttribute("style","position:fixed;top:5%;left:5%;bottom:5%;right:5%;width:90%;padding:20px;z-index:999;background:#eee;border:1 px solid black");
  popover.value=out;
  document.body.appendChild(popover);
  var closePop = document.createElement('button');
  closePop.setAttribute("type","button");
  closePop.innerHTML = "<b>X</b>"
  closePop.setAttribute("style","position:fixed;top:5%;right:5%;background:red;color:white;padding:5px;z-index:999;");
  closePop.onclick=function(){
    document.body.removeChild(closePop);
    document.body.removeChild(popover);
  };
  document.body.appendChild(closePop);
  
})();
