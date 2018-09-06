const ROOT = Symbol('ROOT')
const HEAD = Symbol('HEAD')
const TAIL = Symbol('TAIL')
const properties = {
  insertBefore(data){
    var node = Node(data,this.parent)
    node.prev = this.prev
    if(node.prev != null){ node.prev.next = node }
    node.next = this
    this.prev = node
    return node.protected
  },
  insertAfter(data){
    var node = Node(data,this.parent)
    node.next = this.next
    if(node.next != null){ node.next.prev = node }
    node.prev = this
    this.next = node
    return node.protected
  },
  removeBefore(){
    if(this.prev == null) return this;
    this.prev = this.prev.prev
    if(this.prev == null) return this;
    this.prev.next = this
    return this.protected
  },
  removeAfter(){
    if(this.next == null) return this;
    this.next = this.next.next
    if(this.next == null) return this;
    this.next.prev = this
    return this.protected
  },
  push(data){
    var node = Node(data,this)
    node.prev = this.tail
    if(node.prev != null){ node.prev.next = node }
    this.tail = node
    if(!this.head){ this.head = node }
    return node.protected
  },
  unshift(data){
    var node = Node(data,this)
    node.next = this.head
    if(node.next != null){ node.next.prev = node }
    this.head = node
    if(!this.tail){ this.tail = node }
    return node.protected
  },
  pop(){
    if(this.tail == null) return this;
    this.tail = this.tail.prev
    if(this.tail == null) { this.head = null; return this; }
    this.tail.next = null;
    return this.protected
  },
  shift(){
    if(this.head == null) return this;
    this.head = this.head.next
    if(this.head == null) { this.tail = null; return this; }
    this.head.prev = null;
    return this.protected
  }
}
function Node(data,parent=null){
  var node = {
    data:data,
    parent:parent,
    prev:null,
    next:null,
    head:null,
    tail:null,
  }
  node.protected = {
    get data(){return node.data},
    set data(val){node.data = val},
    get parent(){return node.parent && node.parent.protected },
    get prev(){return node.prev && (node.prev.data!=HEAD||null) && node.prev.protected},
    get next(){return node.next && (node.next.data!=TAIL||null) && node.next.protected},
    get head(){return node.head && node.head.protected },
    get tail(){return node.tail && node.tail.protected },
  }
  Object.keys(properties).forEach(fn => {
    node.protected[fn] = properties[fn].bind(node)
  })
  return node
}

function log(node){
  var value = {}
  Object.keys(node).forEach(attr => {
    if(node[attr]==null || node[attr].data){
      value[attr] = node[attr] && node[attr].data
    }
  })
  console.log(node.data,value)
}

function Root(){
  var root = Node(HEAD)
  var tail = Node(TAIL)
  root.next = tail
  tail.prev = root
  delete root.insertBefore
  delete root.remove
  delete tail.insertAfter
  delete tail.remove
  return root.protected
}

var root = Root()
root.insertAfter('A')
console.log(root.next.data) // => A
console.log(root.next.prev) // => null

// root.insertAfter('0').insertAfter('1').insertAfter('2')

// for(var node = root; node; node = node.prev){
//   log(node)
// }
// root.push(Node('0')).push(Node('0.1'))//.insertAfter(Node('0.2')).push(Node('0.2.0'))
// root.push(Node('1')).push(Node('1.0')).push(Node('1.0.1')).insertBefore(Node('1.0.0'))
// root.push(Node('2')).push(Node('2.0'))