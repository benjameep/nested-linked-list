const HEAD = Symbol('HEAD')
const TAIL = Symbol('TAIL')

function insert(n1,n2,n,p){
  if(n2 != null){
    n2[n] = n1[n]
    if(n2[n] != null){ n2[n][p] = n2 }
    n2[p] = n1
  }
  n1[n] = n2
}
function remove(node){
  if(node.next != null){
    node.next.prev = node.prev
    node.next.Bprev = node.Bprev
    node.next.Aprev = node.prev||node.Aprev
  }
  if(node.prev != null){
    node.prev.next = node.next
    node.prev.Bnext = node.next||node.Bnext
    node.next.Anext = node.Anext
  }
  if(node.parent.head == node) {
    node.parent.head = node.next
    node.parent.Bnext = node.next||node.Bnext
    node.parent.prev.Anext = node.Anext
    if(node.parent.head == null) node.parent.tail == null;
  }
  if(node.parent.tail == node) {
    node.parent.tail = node.prev
    node.parent.next.Bprev = node.Bprev
    node.parent.Aprev = node.prev||node.Aprev
    if(node.parent.tail == null) node.parent.head == null;
  }
}
const methods = {
  insertBefore(id,data){
    var node = this.create(id,data,this.parent)
    if(this.parent && this.parent.head == this) { this.parent.head = node }
    insert(this,node,'prev','next')
    insert(this,node,'Bprev','Bnext')
    return node.protected
  },
  insertAfter(id,data){
    var node = this.create(id,data,this.parent)
    if(this.parent && this.parent.tail == this) { this.parent.tail = node }
    insert(this,node,'next','prev')
    insert(this,node,'Bnext','Bprev')
    return node.protected
  },
  push(id,data){
    var node = this.create(id,data,this)
    insert(this.next||this.Bnext,node,'Bprev','Bnext')
    // Attach it to our tail
    if(this.tail != null) insert(this.tail,node,'next','prev');
    this.tail = node
    if(this.head == null) this.head = node;

    console.log(this.tail && this.tail.id,this.id)
    return node.protected
  },
  unshift(id,data){
    var node = this.create(id,data,this)
    insert(this,node,'Bnext','Bprev')
    // insert(this.prev||this.Aprev,node,'Aprev','Anext')
    // Attach it to our head
    if(this.head != null) insert(this.head,node,'prev','next');
    // if(this.head != null) insert(node,this.head,'next','prev');
    this.head = node
    if(this.tail == null) this.tail = node;
    return node.protected
  },
  remove(){
    remove(this)
  },
  pop(){
    if(this.tail != null) remove(this.tail)
    return this
  },
  shift(){
    if(this.head != null) remove(this.head)
    return this
  }
}

function Node(id,data,parent=null){

  // Remove the last one with this id 
  // (just assuming that they want to move this node)
  if(this.dictionary[id]){
    this.dictionary[id].remove()
  }

  var node = {
    id:id,
    Bnext:null,
    Bprev:null,
    next:null,
    prev:null,
    head:null,
    tail:null,
    parent:parent,
    create:Node.bind(this)
  }
  
  node.protected = {
    data:data,
    get id(){return node.id},
    get Bnext(){return node.Bnext && (node.Bnext.id!=TAIL||null) && node.Bnext.protected },
    get Bprev(){return node.Bprev && (node.Bprev.id!=HEAD||null) && node.Bprev.protected },
    get next(){return node.next && (node.next.id!=TAIL||null) && node.next.protected},
    get prev(){return node.prev && (node.prev.id!=HEAD||null) && node.prev.protected},
    get head(){return node.head && node.head.protected },
    get tail(){return node.tail && node.tail.protected },
    get parent(){return node.parent && node.parent.protected },
  }

  Object.keys(methods).forEach(fn => {
    node.protected[fn] = methods[fn].bind(node)
  })

  this.dictionary[id] = node. protected

  return node
}

function Tree(){
  var dictionary = this.dictionary = {}
  var head = Node.call(this,HEAD)
  var tail = Node.call(this,TAIL)

  head.next = head.Bnext = tail
  tail.prev = tail.Bprev = head
  delete head.protected.insertBefore
  delete head.protected.remove
  delete tail.protected.insertAfter
  delete tail.protected.remove
  delete tail.protected.push
  delete tail.protected.unshift
  
  return {
    head:head.protected,
    tail:tail.protected,
    _head:head,
    _tail:tail,
    node(id){ return dictionary[id] },
  }
}

function log(node){
  var value = {}
  Object.keys(node).forEach(attr => {
    if(node[attr]==null || node[attr].id){
      value[attr] = node[attr] && node[attr].id
    }
  })
  console.log(node.id,value)
}

var tree = Tree()
tree.head.push('0')//.push('0.0')
// tree.head.insertAfter('A').push('A1').insertAfter('A3').insertBefore('A2').push('A2.0')
// tree.tail.insertBefore('B').push('B1').push('B1.0').insertAfter('B1.1')

log(tree._head)

for(var node = tree.head.Anext; node; node = node.Anext){
  log(node)
  // console.log(node.id)
}
