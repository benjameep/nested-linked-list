function insert(n1,n2,n,p,backRef=true){
  if(n2 != null){
    n2[n] = n1[n]
    if(n2[n] != null){ n2[n][p] = n2 }
    if(backRef){ n2[p] = n1 }
  }
  n1[n] = n2
}
function protect(node){
  return Object.defineProperties({},Object.entries(node).reduce((props,[key,value]) => {
    if(typeof value == 'function'){
      props[key] = {
        value:value,
        enumerable:true,
      }
    // } else if(node.parent==null && (node.prev==null || node.next==null)){
    //   props[key] = {
    //     get(){return node.n && node.n[key]},
    //     enumerable:true,
    //   }
    } else {
      props[key] = {
        get(){return node[key]},
        enumerable:true,
      }
    }
    return props
  },{}))
}
const Node = (data,parent=null) => ({
  data:data,
  parent:parent,
  prev:null,
  next:null,
  head:null,
  tail:null,
  n:null,
  p:null,
  insertBefore(data){
    var node = Node(data,this.parent)
    if(this.parent && this.parent.head == this) { this.parent.head = node }
    insert(this,node,'prev','next')
    insert(this,node,'p','n')
    return protect(node)
  },
  insertAfter(data){
    var node = Node(data,this.parent)
    if(this.parent && this.parent.tail == this) { this.parent.tail = node }
    insert(this,node,'next','prev')
    insert(this,node,'n','p')
    console.log('*************')
    this.prev = 
    log(this)
    return protect(node)
  },
  push(data){
    var node = Node(data,this)
    insert(this.next||this.n,node,'p','n')
    // Attach it to our tail
    if(this.tail != null) insert(this.tail,node,'next','prev');
    this.tail = node
    if(this.head == null) this.head = node;
    return protect(node)
  },
  unshift(data){
    var node = Node(data,this)
    node.parent = this
    insert(this,node,'n','p')
    
    // Attach it to our head
    if(this.head != null) insert(this.head,node,'prev','next');
    this.head = node
    if(this.tail == null) this.tail = node;
    return protect(node)
  },
  remove(){
    if(this.next != null){
      this.next.p = this.p
      this.next.prev = this.prev
    }
    if(this.prev != null){
      this.prev.next = this.next
      this.prev.n = this.next||this.n
    }
    if(this.parent.head == this) {
      this.parent.head = this.next
      this.parent.n = this.next||this.n
      if(this.parent.head == null) this.parent.tail == null;
    }
    if(this.parent.tail == this) { 
      this.parent.tail = this.prev
      this.parent.next.p = this.p
      if(this.parent.tail == null) this.parent.head == null;
    }
  },
  pop(){
    if(this.tail != null) this.tail.remove()
    return this
  },
  shift(){
    if(this.head != null) this.head.remove()
    return this
  }
})

const log = function(node){
  var tag = node.data+': '
  var str = tag+['parent','next','prev','head','tail','n','p'].map((p,i) => ''.padEnd(i&&tag.length)+(p+': ').padStart(7)+(node[p] && node[p].data)).join('\n')
  console.log(str)
}

function Root(){
  return protect(Node('<').insertBefore('>'))
}

var root = Root()
root.insertAfter('0').insertAfter('1')
// log(root)
// var prox = protect(root)
// root.next.insertAfter('1')
// log(prox)
//.insertBefore('>')
// root.push('1')
// root.unshift('0').push('0.1')
// root.push('2')

for(var node = root; node; node = node.n){
  log(node)
}