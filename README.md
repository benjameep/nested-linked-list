# Nested Linked List

Tree structures are really annoying to traverse through, 
especially when you have to start at a leaf node
```
A               B
  A1 A2      A3   B1
        A2.0         B1.0 B1.1
```
Now find `A2.0`'s surrounding parents (`A2` & `A3`),
or it's distance from `B1.0` (`4`)

These seem like they should be very simple tasks, but usually 
require several awfull unreadable recursive functions

This library does not write those awfull recursive functions
for you, rather it supplies all the references you need to make
those functions not recursive and easy to understand.

## Example
``` js
const root = Root()

/* Create the tree from the above example

    A               B
      A1 A2      A3   B1
            A2.0         B1.0 B1.1
*/
root.push('A').push('A1').insertAfter('A3').insertBefore('A2').push('A2.0')
root.push('B').push('B1').push('B1.0').insertAfter('B1.1')

/* Iterate through all nodes in order */
for(var node = root.n; node != null; node = node.n){
  console.log(node.data)
}
// => A A1 A2 A2.0 A3 B B1 B1.0 B1.1

/* Iterate through just A's direct children */
for(var node = root.head.head; node != null; node = node.next){
  console.log(node.data)
}
// => A1 A2 A3
```

## Reference
#### Tree
- _tree._[root]() <*Node*>
- _tree._[node(id)]() <*Node*|*null*>

#### Node
- _node_[.id]() <*String*>
- _node_[.data]() <*Any*>
- _node_[.n]() <*Node*|*null*>
- _node_[.p]() <*Node*|*null*>
- _node_[.next]() <*Node*|*null*>
- _node_[.prev]() <*Node*|*null*>
- _node_[.head]() <*Node*|*null*>
- _node_[.tail]() <*Node*|*null*>
- _node_[.parent]() <*Node*|*null*>
- _node_[.insertBefore(id [,data])]() <*Node*>
- _node_[.insertAfter(id [,data])]() <*Node*>
- _node_[.push(id [,data])]() <*Node*>
- _node_[.unshift(id [,data])]() <*Node*>
- _node_[.remove()]()
- _node_[.pop()]() <*Node*>
- _node_[.shift()]() <*Node*>



## Magic Disclaimer
Warning, this library does some weird voodoo witch craft

##### Root node is invisible to siblings
```
var root = Root()
var a = root.insertAfter('a')
root.next // => a
a.prev    // => null
```
##### References are immutable
```
a.next // => null
a.next = new CoolThing()
a.next // => null
```

## API
All operations are `O(1)`

###### _node_.**id** <*String*>
The id given when the node was created (not able to set again)

###### _node_.**data** <*any*>
Optional data  to store other data you want attached to the node (able to set a again)

###### _node_.**n** <*Node*|*null*>
The next node in the tree's sequence. That being the first child if node has children, the next sibling if no children or the next branch if it is the last child. Only `null` if at end of entire tree.

###### _node_.**p** <*Node*|*null*>
The previous node in the tree's sequence, being the counter for `.n`. Only `null` if at begining of entire tree.

###### _node_.**next** <*Node*|*null*>
The next sibling of the node (skips over node's children). `null` if node is the last child.

###### _node_.**prev** <*Node*|*null*>
The previous sibling of the node (skips over previous sibling's children). `null` if node is the first child.

###### _node_.**head** <*Node*|*null*>
The first of this node's children. `null` if no children.

###### _node_.**tail** <*Node*|*null*>
The last of this node's children. `null` if no children.

###### _node_.**parent** <*Node*|*null*>
The parent of the node. `null` if sibling of root.