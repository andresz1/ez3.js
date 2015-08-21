EZ3.Stack = function(){
  this.stack = [];
};

EZ3.Stack.prototype.push = function(item) {
  this.stack.push(item);
};

EZ3.Stack.prototype.pop = function() {
  if(!this.isEmpty())
    this.stack.pop();
};

EZ3.Stack.prototype.top = function() {
  return (this.isEmpty()) ? null : this.stack[this.stack.length-1];
};

EZ3.Stack.prototype.isEmpty = function() {
  return (this.stack.length > 0) ? false : true;
};
