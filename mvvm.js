function Zhufeng(options={}){
	this.$options=options;
	var data=this._data=this.$options.data;
	observe(data);
	for(let key in data){
		Object.defineProperty(this,key,{
			enumerable:true,
			get(){
				return this._data[key];
			},
			set(newVal){
				this._data[key]=newVal;
			}
		})
	}
	new Compile(options.el,this);
}
function Compile(el,vm){
 vm.$el=document.querySelector(el);
	let fragment=document.createDocumentFragment();
	while(child=vm.$el.firstChild){
		fragment.appendChild(child)
	};
	console.log(fragment);
	replace(fragment);
	function replace(fragment){
		Array.from(fragment.childNodes).forEach(function(node){
			let text=node.textContent;
			let reg=/\{\{(.*)\}\}/;
			if(node.nodeType===3&&reg.test(text)){
				console.log(RegExp.$1);
				let arr=RegExp.$1.split('.');
				let val = vm;
				arr.forEach(function(k){
					val=val[k]
				})
				// 替换逻辑
				new Watcher(vm, RegExp.$1,function(newVal){
					node.textContent=text.replace(/\{\{(.*)\}\}/,newVal);
					
				})
				node.textContent=text.replace(/\{\{(.*)\}\}/,val);
			};
			if(node.childNodes){
				replace(node)
			}
		})
	}
	vm.$el.appendChild(fragment)
	
}
function Observe(data){
	let dep=new Dep()
	for(let key in data){
		let val=data[key];
		observe(val)
		Object.defineProperty(data,key,{
			enumerable:true,
			get(){
				console.log(Dep.target,dep)
				Dep.target&&dep.addSub(Dep.target)
				return val;
			},
			set(newVal){
				if(newVal==val){
					return
				}
				val=newVal;
				observe(val);
				dep.notify()
			}
		})
	}
}
function observe(data){
	if(typeof data!=="object")return;
	return new Observe(data)
}

// 发布订阅模式
function Dep(){
	this.subs=[];
}
Dep.prototype.addSub=function(sub){
	this.subs.push(sub);
}
Dep.prototype.notify=function(sub){
	this.subs.forEach(sub=>sub.update())
}

/git提交测试3/
/git提交测试2/

/master提交/

/xuwh提交/

//xuwh提交2

//xuwh3


//master提交1
function Watcher(vm,exp,fn){
	this.fn=fn
	this.vm=vm;
	this.exp=exp;
	Dep.target=this;
	let val=vm;
	let arr=exp.split('.');
	arr.forEach(function(k){
		val=val[k]
	})
	Dep.target=null;
}
Watcher.prototype.update=function(){
	let val=this.vm;
	let arr=this.exp.split('.');
	arr.forEach(function(k){
		val=val[k];
	})
	this.fn(val)
}
