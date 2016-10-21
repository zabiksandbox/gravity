function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function getRandom(min, max){
  return (Math.random() * (max - min + 1)) + min;
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

function frameUpdate(){
    if(Game.pause===false){
        for(i=0;i<World.length;i++){
        	if(typeof World[i] === "undefined" ) continue;
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
               if(Game.collapse===false){
					range+=10;
               }
               if(r<range){
               		if(Game.collapse===true){
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
                   }
               }else{
                   iam.addForce(-x,-y);  
               }
            }
        }
        
        for(i in World){
            World[i].Move();
        }
        
        var time = Date.now();
        frames++;

        if(time>prevTime+1000){
            fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
            prevTime = time;
            frames = 0;
            msg.setText("FPS: " + fps + "/" + myfps);
        }
    }
    fabric.util.requestAnimFrame(frameUpdate, Game.frame.getElement());
    Game.frame.renderAll();
};
function updateinfo(){
    $('.info .stars .val').text(World.length);
};
function dogrid(){
     y=50;
     grid=80;
     while(y<$(window).height()){
         x=50;
         while(x<$(window).width()){
             World[World.length]=new fobject(x,y);
             x=x+grid;
         }
         y=y+grid;
     }
     Game.frame.renderAll();
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
        	if(Game.collapse===false){
	        	///this.force.x*=0.9999;
    	        ///this.force.y*=0.9999;
            }
            this.force.x+=x;
            this.force.y+=y;
        };
        this.checkColor=function(){
            if(this.mass>10000&&this.dom.fill!='black'){
                this.dom.fill='black';
                this.dom.set('shadow','0px 0px 0px #000000');
                this.radius=Math.sqrt(this.mass/(10*Math.PI));
            } else if(this.mass<10001) {
                this.radius=Math.sqrt(this.mass/Math.PI);
                rgb=colorTemperatureToRGB(this.mass*10+1000);  
                //console.log('rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')');
                this.dom.fill='rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')';
                this.dom.set('shadow','0px 0px '+parseInt(this.radius*2)+'px rgb('+parseInt(rgb.r)+','+parseInt(rgb.g)+','+parseInt(rgb.b)+')');
            }
        };
        this.Move=function(){
            
            this.position.x+=this.force.x/this.mass;
            this.position.y+=this.force.y/this.mass;
            if((this.position.x+this.radius)>Game.frame.getWidth()+Game.offset.x) {
                if(Game.inf===true){    
                    this.position.x=-Game.offset+this.radius;
                }
                
            }
            if((this.position.y+this.radius)>Game.frame.getHeight()+Game.offset.y){
                if(Game.inf===true){   
                    this.position.y=-Game.offset+this.radius;
                }
                
            }
            
            if(this.position.x-this.radius<-Game.offset.x) {
                if(Game.inf===true){
                    this.position.x=Game.frame.getWidth()+Game.offset-this.radius;                    
                }
                
            }
            if(this.position.y-this.radius<-Game.offset.y) {
                if(Game.inf===true){    
                    this.position.y=Game.frame.getHeight()+Game.offset-this.radius;
                }
            }
            this.dom.set('left',this.position.x);
            this.dom.set('top',this.position.y);
            this.dom.set('radius',this.radius);
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
        return this;
};

var myfps = 60;
Game=function(){
    this.pause=false;
    this.inf=true;
    this.gravity=0.1;
    this.frame='';
    this.defmass=1;
    this.offset=[];
    this.offset.x=$('#frame').width();
    this.offset.y=$('#frame').height();
    this.collapse=true;
    this.start=function(){
        this.frame=new fabric.Canvas('frame',{width:$(window).width(),height:$(window).height(),renderOnAddRemove:false,});    
        this.frame.selection = false; 
        this.frame.setBackgroundColor({
          source: 'space.png',
          repeat: 'repeat',
          offsetX: 0,
          offsetY: 0
        });
        msg = new fabric.Text('FPS: 0/' + myfps, {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 'white',
          fontWeight: 'bold',
          left: 10,
          top: 15,
          selectable: false,
          hasRotatingPoint:false,
          hasControls:false,
        });
        Game.frame.add(msg);

        frames = 0;
        startTime = Date.now(), prevTime = startTime;       
        frameUpdate();
        
    };    
};







$(document).ready(function(){
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
    $('.upper-canvas').mousedown(function(e){
        lx = e.pageX;
        ly = e.pageY;
    })
    $('.upper-canvas').mouseup(function(e){
        World[World.length]=new fobject(e.pageX,e.pageY);
        World[World.length-1].force.x = (e.pageX - lx) * World[World.length-1].mass / 50;
        World[World.length-1].force.y = (e.pageY - ly) * World[World.length-1].mass / 50;
    });
    $('.pause input').click(function(){
        Game.pause===true?Game.pause=false:Game.pause=true;
    })
    $('.gravity input').change(function(){
        Game.gravity=$(this).val()/10;        
        $('.gravity .val').text($(this).val()/10)
        if($(this).val()<0){
            $('.inf input').prop('checked',true);
            Game.inf=true;
        }
    })
    $('.inf input').change(function(){
        if($(this).prop('checked')==true){
            Game.inf=true;
        } else {
            Game.inf=false;
        }
    });
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
            World[World.length]=new fobject(getRandomInt(0,$('#frame').width()),getRandomInt(0,$('#frame').height()));
            World[World.length-1].addForce(getRandom(-Game.gravity,Game.gravity)/5,getRandom(-Game.gravity,Game.gravity)/5)
        }
    },$('.randomgen .limit').val()/Game.gravity/5)
});
$(window).resize(function(){
    Game.frame.setWidth($(window).width());
    Game.frame.setHeight($(window).height());
    Game.frame.renderAll();
    $('.info').css({'font-size':$('#frame').width()/100})
});
