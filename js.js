function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandom(min, max){
  return (Math.random() * (max - min + 1)) + min;
}

fabric.Canvas.prototype.getItemsByName = function (name) {
	var objectList = [],
	objects = this.getObjects();

	for (var i = 0, len = this.size(); i < len; i++) {
		if (objects[i].name && objects[i].name == name) {
			objectList.push(objects[i]);
		}
	}
    if(objectList[0])
	return objectList;
    else 
    return false;
};

fabric.Object.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            name: this.name,
        });
    };
})(fabric.Object.prototype.toObject);

function lateUpdate(){
    for(i=0;i<World.length;i++){
        World[i].checkColor();
    }
}
function frameUpdate(){
        
        for(i=0;i<World.length;i++){
    		for(e=0;e<World.length;e++){
                if(typeof World[i] === "undefined")
                    break;
                else if(e === i || typeof World[e] === "undefined")
                    continue;
                    
                    
                        x=0;
                        y=0;
                        r=Math.sqrt(Math.pow(Math.abs(World[i].position.x-World[e].position.x),2)+Math.pow(Math.abs(World[i].position.y-World[e].position.y),2));
                        rx=(World[i].position.x-World[e].position.x);
                        ry=(World[i].position.y-World[e].position.y);
                        //f - gravity
                        f =parseFloat(Game.gravity*((World[i].mass+World[e].mass)/Math.pow(r,2)));
                        fe=parseFloat(1*((World[i].mass+World[e].mass)/Math.pow(r,2)));
                        fe=0;
                        if(Math.abs(rx)>(World[i].radius+World[e].radius+10) || Math.abs(ry)>(World[i].radius+World[e].radius+10)){
                            if(Math.abs(rx)==Math.abs(ry) && rx!=0 && ry!=0 ){
                                x=f;
                                y=f;
                                k=1;
                            } else if (Math.abs(rx)>Math.abs(ry)){
                                k=Math.abs(ry)/Math.abs(rx)
                                y=(f)*k;
                                x=(f)-x;
                            } else {
                                k=Math.abs(rx)/Math.abs(ry);
                                x=(f)*k;
                                y=(f)-y;
                            }
                        } else {
                            if(Math.abs(rx)==Math.abs(ry) && rx!=0 && ry!=0 ){
                                x=f-fe;
                                y=f-fe;
                                k=1;
                            } else if (Math.abs(rx)>Math.abs(ry)){
                                k=Math.abs(ry)/Math.abs(rx)
                                y=(f-fe)*k;
                                x=(f-fe)-y;
                            } else {
                                k=Math.abs(rx)/Math.abs(ry);
                                x=(f-fe)*k;
                                y=(f-fe)-x;
                            }
                            
                        }
                        newmass=World[i].mass+World[e].mass;
                        range=World[i].radius+World[e].radius;
                        if(range<3)range=3;
                        if(rx<(range) && rx>(range)*-1 && ry>(range)*-1 && ry<(range)){                     
                            if(World[i].mass>World[e].mass){
                                maxk=i;
                                mink=e;
                            } else if(World[i].mass<World[e].mass){
                                maxk=e;
                                mink=i;
                            } else {
                                maxk=i;
                                mink=e;
                            }
                            World[maxk].force.x=(World[maxk].force.x+World[mink].force.x);
                            World[maxk].force.y=(World[maxk].force.y+World[mink].force.y);
                            World[maxk].mass=World[maxk].mass+World[mink].mass;
                            World[mink].remove();
                        } else {
                            if(World[i].position.x>World[e].position.x) x=x*-1;
                            if(World[i].position.y>World[e].position.y) y=y*-1;
                            World[i].addForce(x,y);    
                            xx=-1*0.0000011;
	                        yy=-1*0.0000011;
	                        if(World[i].position.x>World[e].position.x) xx=xx*-1;
	                        if(World[i].position.y>World[e].position.y) yy=yy*-1;
	                           World[i].addForce(xx,yy);
                        }
                    
        	}
    	}
        for(var i in World){
    			World[i].Move();
    	}
        
        fabric.util.requestAnimFrame(frameUpdate, Game.frame.getElement());
        Game.frame.renderAll();
};
function updateinfo(){
	$('.info .stars .val').text(World.length);
}
fobject=function(x,y,m,force){
		this.dom=null;
        this.mass=m?m:1;
        this.radius=1;
		this.force=[];
		this.force.x=0;
		this.force.y=0;
		this.position=[];
		this.position.x=0;
		this.position.y=0;
		this.addForce=function(x,y){
			this.force.x+=x;
			this.force.y+=y;
		};
        this.checkColor=function(){
            if(this.mass>10000&&this.dom.fill=='rgb(255,165,84)'){
				this.dom.fill='black';
				this.dom.set('shadow','0px 0px 0px #ffffff');
		    } else {
                rgb=colorTemperatureToRGB(this.mass*3.5+2660);  
                this.dom.fill='rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')';
                this.dom.set('shadow','0px 0px '+parseInt(this.radius*2)+'px rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')');
            }
        };
		this.Move=function(){
            //trenie
//          this.force.x=this.force.x*0.99;
//          this.force.y=this.force.y*0.99;
			this.radius=Math.sqrt(this.mass/Math.PI);
			this.position.x+=this.force.x/this.mass;
			this.position.y+=this.force.y/this.mass;
            if((this.position.x+this.radius)>Game.frame.getWidth()) {
            	if(Game.pong===false)	
            		console.clear(); //this.remove();
            	else{
					this.position.x=0+this.radius;
				}
            	
            }
            if((this.position.y+this.radius)>Game.frame.getHeight()){
            	if(Game.pong===false)	
            		console.clear(); //this.remove();
            	else{
					this.position.y=0+this.radius;
				}
            	
            }
            
            if(this.position.x-this.radius<0) {
            	if(Game.pong===false)	
            		console.clear(); //this.remove(); 
            	else
            	{
					this.position.x=Game.frame.getWidth()-this.radius;					
				}
            	
            }
            if(this.position.y-this.radius<0) {
            	if(Game.pong===false)	
            		console.clear(); //this.remove(); 
            	else{
					this.position.y=Game.frame.getHeight()-this.radius;
				}
            }
			this.dom.set('left',this.position.x);
			this.dom.set('top',this.position.y);
			this.dom.set('radius',this.radius);
		}
        this.explode=function(){
        }
        this.remove=function(){
        	World.splice(World.indexOf(this),1);
            this.dom.remove();
            updateinfo();
        }
		this.init=function(){
			this.position.x=x;
			this.position.y=y;
			this.dom = new fabric.Circle({
			  radius: this.radius, 
			  fill: 'rgb(255,165,84)', 
			  left: this.position.x, 
			  top: this.position.y,
			  shadow: '0px 0px 5px #FFFF00',
			  hasRotatingPoint:false,
			  hasControls:false,
			  selectable:false,
			  originX:'center',
			  originY:'center' 
		  
			});
			Game.frame.add(this.dom);
			World.push(this);
			updateinfo();
		}
		this.init();
		return this;
	}
Game=function(){
	this.pong=true;
	this.gravity=0.1;
	this.frame='';
	this.speed=10;
	this.defmass=1;
	this.start=function(){
		this.frame=new fabric.Canvas('frame',{width:$(window).width(),height:$(window).height(),renderOnAddRemove:false,});	
        this.frame.selection = false; 
		this.frame.setBackgroundColor({
		  source: 'space.png',
		  repeat: 'repeat',
		  offsetX: 0,
		  offsetY: 0
		}, this.frame.renderAll.bind(this.frame));
        frameUpdate();
	}
	/*this.interval=setInterval(function(){
    	frameUpdate();
	},this.speed);*/

	
}
$(document).ready(function(){
	World=[];
	Game=new Game();
	Game.start();
    setInterval(function(){
    	lateUpdate();
	},1000);
    
	$('.gravity .val').text(Game.gravity);
	$('.gravity input').val(Game.gravity*10);
    /*$('.upper-canvas').click(function(e){
		World[World.length]=new fobject(e.pageX,e.pageY,Game.defmass);
		console.log();
    })*/ 
    console.log('http://pikabu.ru/story/gravitatsionnaya_js_zalipalka_4552933')
    console.log('Thanks to:');
    console.log('prgr');
    console.log('iiyctou');
    console.log('brainfick');
    console.log('impcyber')
     
    
    var lx = 0; 
    var ly = 0;
    $('.upper-canvas').mousedown(function(e){
        lx = e.pageX; ly = e.pageY;
    })
    $('.upper-canvas').mouseup(function(e){
        World[World.length]=new fobject(e.pageX,e.pageY);
        World[World.length-1].force.x = (e.pageX - lx) * World[World.length-1].mass / 100;
        World[World.length-1].force.y = (e.pageY - ly) * World[World.length-1].mass / 100;
        
    });

    $('.gravity input').change(function(){
    	Game.gravity=$(this).val()/10;    	
    	$('.gravity .val').text($(this).val()/10)
    	if($(this).val()<0){
			$('.pong input').prop('checked',true);
			Game.pong=true;
		}
    })
    $('.pong input').change(function(){
    	if($(this).prop('checked')==true){
			Game.pong=true;
		} else {
			Game.pong=false;
		}
    });
    $('.defmass input').change(function(){
    	Game.defmass=$(this).val();
    	console.log($(this).val())
    })
    $('.freez input').click(function(){
    	for(var i in World){
			World[i].force.x=0;
			World[i].force.y=0;
    	}
    });
	$('.info').css({'font-size':$('#frame').width()/100})
});
$(window).resize(function(){
	Game.frame.setWidth($(window).width());
	Game.frame.setHeight($(window).height());
	Game.frame.renderAll();
    $('.info').css({'font-size':$('#frame').width()/100})
})
function dogrid(){
     y=50;
     grid=100;
     while(y<$(window).height()){
         x=50;
         while(x<$(window).width()){
             World[World.length]=new fobject(x,y);
             x=x+grid;
         }
         y=y+grid;
     }
     Game.frame.renderAll();
}
