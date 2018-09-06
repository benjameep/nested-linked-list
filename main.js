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
  node.n.p = node.p
  node.p.n = node.next||node.n
  if(node.next != null) node.next.prev = node.prev
  if(node.prev != null) node.prev.next = node.next
  /* If not on top level */
  if(node.parent){
    /* If node is the first child */
    if(node.parent.head == node) {
      node.parent.head = node.next
      node.parent.n = node.next||node.n
      if(node.parent.head == null) node.parent.tail == null;
    }
    /* If node is the last child */
    if(node.parent.tail == node) {
      node.parent.tail = node.prev
      if(node.parent.next) node.parent.next.p = node.p
      if(node.parent.tail == null) node.parent.head == null;
    }
  }
}
const methods = {
  insertBefore(id,data){
    var node = this.create(id,data,this.parent)
    if(this.parent && this.parent.head == this) { this.parent.head = node }
    insert(this,node,'prev','next')
    insert(this,node,'p','n')
    return node.protected
  },
  insertAfter(id,data){
    var node = this.create(id,data,this.parent)
    if(this.parent && this.parent.tail == this) { this.parent.tail = node }
    insert(this,node,'next','prev')
    insert(this,node,'n','p')
    return node.protected
  },
  push(id,data){
    var node = this.create(id,data,this)
    insert(this.next||this.n,node,'p','n')
    // Attach it to our tail
    if(this.tail != null) insert(this.tail,node,'next','prev');
    this.tail = node
    if(this.head == null) this.head = node;
    return node.protected
  },
  unshift(id,data){
    var node = this.create(id,data,this)
    insert(this,node,'n','p')
    // Attach it to our head
    if(this.head != null) insert(this.head,node,'prev','next');
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
    n:null,
    p:null,
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
    get n(){return node.n && (node.n.id!=TAIL||null) && node.n.protected },
    get p(){return node.p && (node.p.id!=HEAD||null) && node.p.protected },
    get next(){return node.next && (node.next.id!=TAIL||null) && node.next.protected},
    get prev(){return node.prev && (node.prev.id!=HEAD||null) && node.prev.protected},
    get head(){return node.head && node.head.protected },
    get tail(){return node.tail && node.tail.protected },
    get parent(){return node.parent && (node.prev.id!=HEAD||node.prev.id!=TAIL||null) && node.parent.protected },
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

  head.next = head.n = tail
  tail.prev = tail.p = head
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

module.exports = Tree