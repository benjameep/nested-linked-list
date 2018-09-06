const Tree = require('./main')

function log(node){
  var value = {}
  if(!noe3)
  Object.keys(node).forEach(attr => {
    if(node[attr]==null || node[attr].id){
      value[attr] = node[attr] && node[attr].id
    }
  })
  console.log(node.id,value)
}

var tree = Tree()
tree.head.insertAfter('A').push('A1').insertAfter('A3').insertBefore('A2').push('A2.0')
tree.tail.insertBefore('B').push('B1').push('B1.0').insertAfter('B1.1')

for(var node = tree.tail.p; node; node = node.p){
  // log(node)
  console.log(node.id)
}

var i = 0
var node = tree.node("A2.0")
while(node.id != "B1.0"){
  i++
  node = node.n
}