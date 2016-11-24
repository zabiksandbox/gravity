if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
};
function getRandom(min, max){
  return (Math.random() * (max - min)) + min;
};

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
var time=Date.now();
var deltaTime=0;
function updateinfo(){
    $('.info .stars .val').text(World.length);
};

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
            x=parseFloat(x);
        	/*if(Game.collapse===false){
	        	this.force.x*=0.9999;
    	        this.force.y*=0.9999;
            }*/            
            this.force.x+=(deltaTime/Game.timescale)*x;
            this.force.y+=(deltaTime/Game.timescale)*y;
        };
        this.checkColor=function(){
            if(this.mass>10000&&this.dom.fill!='black'){
                this.dom.fill='black';
                this.dom.set('shadow','0px 0px 0px #000000');
                this.radius=Math.sqrt(this.mass/(10*Math.PI));
            } else if(this.mass<10001) {
                this.radius=Math.sqrt(this.mass/Math.PI);
                rgb=colorTemperatureToRGB(this.mass*10+1000);  
                this.dom.fill='rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')';
                this.dom.set('shadow','0px 0px '+parseInt((this.radius*4)>5?(this.radius*4):5)+'px '+this.dom.fill);             
            }
            
        };
        this.Move=function(){
            //if(this.dom.selected===false){
	            this.position.x+=this.force.x/this.mass;
	            this.position.y+=this.force.y/this.mass;
	            this.dom.set('left',this.position.x);
	            this.dom.set('top',this.position.y);
	            this.dom.set('radius',this.radius);
            //}
        };
        this.explode=function(){
            //BADABUM
        };
        this.remove=function(){
            World.splice(World.indexOf(this),1);
            this.dom.remove();
            updateinfo();
        };
        this.init=function(){
            this.position.x=x;
            this.position.y=y;
            this.dom = new fabric.Circle({
                  radius: this.radius, 
                  left: this.position.x, 
                  top: this.position.y,
                  shadow: '0px 0px 5px #FFFF00',
                  hasRotatingPoint:false,
                  hasControls:false,
                  selectable:false,
                  originX:'center',
                  originY:'center' 
            });
            this.dom.vx=0;
            this.dom.vy=0;
            Game.frame.add(this.dom);
            this.checkColor();
            //World.push(this);
            updateinfo();
        };
        this.init();
        World[World.length]=this;
        return this;
};


Game=function(){
    this.maxv=0;
    this.maxd=0;
    this.timescale=15;
    this.pause=false;
    this.gravity=0.1;
    this.frame='';
    this.defmass=1;
    this.offset=[];
    this.offset.x=$('#frame').width();
    this.offset.y=$('#frame').height();
    this.collapse=true;
    this.start=function(){
        this.frame=new fabric.Canvas('frame',{width:$(window).width(),height:$(window).height(),renderOnAddRemove:false,centeredScaling:true});    
        this.frame.selection = false; 
        this.frame.setBackgroundColor('black');
	    this.frame.on('mouse:down',function(options){
	        lx = options.e.pageX;
	        ly = options.e.pageY;
	    })
	    this.frame.on('mouse:up',function(options){
	        new fobject((options.e.pageX-Game.frame.viewportTransform[4])/Game.frame.getZoom(),(options.e.pageY-Game.frame.viewportTransform[5])/Game.frame.getZoom()).addForce(((options.e.pageX - lx) * World[World.length-1].mass / 50),((options.e.pageY - ly) * World[World.length-1].mass / 50))
	    });
        Game.frameUpdate();        
    };
    this.frameUpdate=function(){
    	deltaTime=Date.now()-time;
    	time=Date.now();
        if(Game.pause==false){
            if(Game.collapse===true){
                Game.moveStars();
            } else {
                Game.moveAtoms();
            }
            
            for(i in World){
                World[i].Move();
            }
        }
        fabric.util.requestAnimFrame(Game.frameUpdate, Game.frame.getElement());
        Game.frame.renderAll();
    };
    this.limits=function(iam){
        var maxv=Math.sqrt(Math.pow(iam.force.x,2)+Math.pow(iam.force.y,2));
        if(Game.maxv<maxv)Game.maxv=maxv; 
        var d=iam.radius*2;
        if(Game.maxd<d) Game.maxd=d;
        
        
        if(Game.maxv>Game.maxd){
            //console.log(Game.maxv+'>'+Game.maxd+'   '+Game.timescale)
            if(Game.timescale>1 && Game.timescale<=15){
                Game.timescale=Game.timescale+2;    
                //console.log(Game.timescale);
            } 
        } 
        if (Game.timescale>15) Game.timescale=15;
        if (Game.timescale<1) Game.timescale=1;
        
        
        
    };
    this.moveAtoms=function(){
        for(i=0;i<World.length;i++){
        	if(typeof World[i] === "undefined" ) continue;
            this.limits(World[i]);
            for(e=0;e<World.length;e++){
                if(e === i || typeof World[e] === "undefined" ) continue;
				iam =     World[i];
                target =  World[e];
                var x=0,
                    y=0,
                    r=Math.sqrt(Math.pow(Math.abs(iam.position.x-target.position.x),2)+Math.pow(Math.abs(iam.position.y-target.position.y),2)),
                    rx=(iam.position.x-target.position.x),
                    ry=(iam.position.y-target.position.y),
                    f=parseFloat(Game.gravity*((iam.mass*target.mass)/Math.pow(r,2)));
    
               if(r>0){
                   x=f*(rx/r);
                   y=f*(ry/r);                             
               }
                        
               newmass=iam.mass+target.mass;
               range=iam.radius+target.radius;
               
               if(range<3)range=3;
               
               if(
               r<(range+iam.force.x+target.force.x+x*-1)||
               r<(range+iam.force.y+target.force.y+y*-1)
               ){
                   if(iam.mass>=target.mass){
                       maxk=iam;
                       mink=target;
                   }else{
                       maxk=target;
                       mink=iam;
                   }
	               maxk.force.x=(maxk.force.x+mink.force.x);
  	               maxk.force.y=(maxk.force.y+mink.force.y);
  	               maxk.mass=maxk.mass+mink.mass;
  	               maxk.checkColor();
   	               mink.remove();
              }else if (r<range+50){
                  iam.addForce(x*0.2,y*0.2);                       
              } else{
                  iam.addForce(x*-1,y*-1); 
              }
           }
        }
        Game.maxv=0;
        Game.maxd=0;
    };
    this.moveStars=function(){
        for(i=0;i<World.length;i++){
        	if(typeof World[i] === "undefined" ) continue;
            this.limits(World[i]);
            for(e=0;e<World.length;e++){
                
                if(e === i || typeof World[e] === "undefined" || typeof World[i]==='undefined') continue;
				iam =     World[i];
                target =  World[e];
                var x=0,
                    y=0,
                    r=Math.sqrt(Math.pow(Math.abs(iam.position.x-target.position.x),2)+Math.pow(Math.abs(iam.position.y-target.position.y),2)),
                    rx=(iam.position.x-target.position.x),
                    ry=(iam.position.y-target.position.y),
                    f=parseFloat(Game.gravity*((iam.mass*target.mass)/Math.pow(r,2)));
    
               if(r>0){
                   x=f*(rx/r);
                   y=f*(ry/r);                             
               }
                        
               newmass=iam.mass+target.mass;
               range=iam.radius+target.radius;
               
               if(range<5)range=5;
               if(r<range){
	               if(iam.mass>=target.mass){
	                   maxk=iam;
	                   mink=target;
	                }else{
	                   maxk=target;
	                   mink=iam;
	                }
	               maxk.force.x=(maxk.force.x+mink.force.x);
	               maxk.force.y=(maxk.force.y+mink.force.y);
	               maxk.mass=maxk.mass+mink.mass;
	               maxk.checkColor();
	               mink.remove();
               }else{
                   iam.addForce(x*-1,y*-1);  
               }
            }
        }
        Game.maxv=0;
        Game.maxd=0;
    };
    this.dogrid=function(){
         y=50;
         grid=80;
         while(y<$(window).height()){
             x=50;
             while(x<$(window).width()){
                 new fobject(x,y);
                 x=x+grid;
             }
             y=y+grid;
         }
    };
    this.moveFrame=function(s){
    	switch(event.code){
    		case 'ArrowLeft':{
    			delta = new fabric.Point(10,0);
        		Game.frame.relativePan(delta);
    			break;
    		}
    		case 'ArrowRight':{
    			delta = new fabric.Point(-10,0);
        		Game.frame.relativePan(delta);
    			break;
    		}
    		case 'ArrowUp':{
    			delta = new fabric.Point(0,10);
        		Game.frame.relativePan(delta);
    			break;
    		}
    		case 'ArrowDown':{
    			delta = new fabric.Point(0,-10);
        		Game.frame.relativePan(delta);
    			
    			break;
    		}
    	}
    };
    this.scaleWorld=function(k, point){    	
    	if(Game.frame.getZoom()>=0.4 || k>1){
    		Game.frame.zoomToPoint(point, Game.frame.getZoom() * k )
    		if(parseInt($(window).width()/Game.frame.getZoom())>$(window).width()){
    			Game.frame.setWidth(parseInt($(window).width()/Game.frame.getZoom()));
    			Game.frame.setHeight(parseInt($(window).height()/Game.frame.getZoom()));		
    		}
    		
    	}
    	
    };
};







$(document).ready(function(){
	$(document).keydown(function(){
		
		if($('.gravity input:not(:focus)').length==1){
			Game.moveFrame(event.code)	
		}
		
	});
	$(document).on('mousewheel',function(){
		
		point = new fabric.Point(event.pageX,event.pageY);
		deltaY=event.deltaY;
		if(deltaY>0){
			Game.scaleWorld(0.9,point);
		} else {
			Game.scaleWorld(1.1,point);
		}
	});
    World=[];
    Game=new Game();
    Game.start();
    
    
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
        
    
    $('.pause input').click(function(){
        Game.pause===true?Game.pause=false:Game.pause=true;
    })
    
    $('.gravity input').change(function(){
        Game.gravity=$(this).val()/10;        
        $('.gravity .val').text($(this).val()/10)
    })
     
    $('.clear input').click(function(){
        Game.pause=true;
        Game.frame.clear();
        World=[];
        Game.pause=false;
    });
    $('.collapse input').change(function(){
        if($(this).prop('checked')==true){
            Game.collapse=true;
        } else {
            Game.collapse=false;
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
    
    $('.info').css({'font-size':$('#frame').width()/120})
    setInterval(function(){
        if($('.randomgen input.randomgen').prop('checked') && World.length<$('.randomgen .limit').val() && Game.pause===false){
            new fobject(getRandomInt(0,$('#frame').width()),getRandomInt(0,$('#frame').height())).addForce(getRandom(Game.gravity*-1,Game.gravity)/5,getRandom(Game.gravity*-1,Game.gravity)/5)
        }
    },$('.randomgen .limit').val()/Game.gravity/5)
});
$(window).resize(function(){
    Game.frame.setWidth($(window).width());
    Game.frame.setHeight($(window).height());
    Game.frame.renderAll();
    $('.info').css({'font-size':$('#frame').width()/100})
});
