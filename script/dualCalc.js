var dualCalc;

(function(){
	
	dualCalc = {
		
		getNextPrimFromBits : function(n){
			var bitArray = new Array();
			bitArray[0] = true;
			for(var i=1;i<n-1;i++){
				bitArray[i] = Math.random()>.5?true:false;
			}
			bitArray[n-1]=true;
			return this.getNextPrimFromDual(bitArray);
		},
		
		getNextPrimFromDez : function(n){
			return this.getNextPrimFromDual(this.dezToDual(n));
		},
		
		
		getNextPrimFromDual : function(n){
			if(n[0]==false)
				n[0]=true;
			var hochN = n.slice(0);
			hochN = dualSubtr(hochN,this.dezToDual(1),true);
			
			//Teste Zahl
			var anzTests=3;
			var _n = n.slice(0);
			var testZahl = this.dezToDual(2);
			var counter = 1;
			
			while(counter<anzTests){
				var erg = primTest(testZahl,_n,hochN);
				if(erg.length==1 && erg[0]==true){
					counter++;
					testZahl = this.dezToDual(counter+1);
				}else{
					hochN= dualMultiAddi(hochN,this.dezToDual(2),0);
					_n = dualMultiAddi(_n,this.dezToDual(2),0);
					counter=1;
				}
				
			}
			return _n;
		},
		
		
		dezToDual : function(n){
			var dualS='';
			while(n!==0){
				if(n%2===1){
					dualS+='1';
					n--;
				}else{
					dualS+='0';	
				}
				n=n/2;
			}
			var dualA=new Array();
			for (var i=0;i<dualS.length;i++){
				dualA[i]=parseInt(dualS.charAt(i))==0?false:true;
			}
			return dualA;
		},
		
		
		dualToDez : function(a){
			var z=0;
			var tmp=1;
			for (var i=0;i<a.length;i++){
				if(a[i]==true){
					z+=tmp;
				}	
				tmp*=2;
			}
			return z;
		},
		
		
		dualAddition : function(a,b){
			return dualMultiAddi(a,b,0);
		},
		
		dualSubtract : function(a,b){
			return dualSubtr(a,b,true);
		},
		
		dualMulti : function(a,b){
			var multiA= new Array();
			var aLength=a.length;
			for(var i=0;i<aLength;i++){
				
				if(a[i]==true){
					multiA[i]=new Array();
					for(var n=0;n<b.length;n++){
						multiA[i][i+n]=b[n];
					}
				}
			}
			if(multiA.length>1){
				var retA= multiA[0];
				var counter = 0;
				while(!retA){
					counter++;
					retA = multiA[counter];
				}
				for(var i=1+counter;i<multiA.length;i++){
					if(multiA[i])
						retA = dualMultiAddi(retA,multiA[i],0);
				}
				return retA;
			}else{
				return multiA[0];
			}
			
		},
		
		
		
		dualDivi : function(a,b,mod){
			var anz=new Array();
			var divA= new Array();
			var bLength=b.length;
			
			var counter=0;
			
			if(!isGreater(a,b)){
				return a;
			}
			
			var zusatz=0;
			var stand=0;
			
			while(a.length>=b.length){
					
			
				var tmpA = new Array();
				for (var i=0;i<b.length + zusatz;i++){
						tmpA[i]=a[a.length-zusatz-b.length+i];
				}
				if(isGreater(tmpA,b)){
					tmpA = dualSubtr(tmpA,b,false);
					for(var i=0;i<tmpA.length;i++){
						a[a.length-1-i]=tmpA[tmpA.length-1-i]
					}
					cleanDual(a);
					anz.splice(0,0,1);
					
					zusatz=0;
				}else{
					zusatz++;
					anz.splice(0,0,0);
				}
				if(!isGreater(a,b)){
					
					if(mod)
						return a;
					return anz;
				}
				
			}
			if(mod)
				return a;
			return anz;
		}
		
	};
	
	
	
	function primTest(zahl,n,hochN){
		var erg = zahl.slice(0);
		
		for(var i=1;i<hochN.length;i++){
			erg = gMalpModn(erg,erg,n);
			if(hochN[hochN.length-1-i] == true){
				erg = gMalpModn(erg,zahl,n);
			}
		}
		return erg;
	}
	
	function gMalpModn(g,p,n){
		var _g=g.slice(0);
		
		return dualCalc.dualDivi(dualCalc.dualMulti(_g,p),n,true);
	}
	
	function dualMultiAddi(a,b,offset){
		var uebertrag = false;
		var counter=0;
		for(var i=0;i<b.length;i++){
			counter=i;
			if(b[i]==true){
				
				if(a[i+offset]==false || !a[i+offset]){
					if(uebertrag){
						a[i+offset]=false;
						uebertrag=true;
					}else{
						uebertrag=false;
						a[i+offset]=true;
					}
				}else{
					if(uebertrag){
						a[i+offset]=true;
						uebertrag=true;
					}else{
						a[i+offset]=false;
						uebertrag=true;
					}
					
				}
			}else if(uebertrag){
				if(a[i+offset]==false  || !a[i+offset]){
					a[i+offset]=true;
					uebertrag=false;
				}else{
					a[i+offset]=false;
					uebertrag=true;
				}
			}
		}
		if(uebertrag){
			var _counter=0;
			while(a[counter+_counter+offset+1]==true && a[counter+_counter+offset+1]!==undefined){
				a[counter+_counter+offset+1]=false;
				_counter++;
			}
			a[counter+_counter+offset+1]=true;
		}
		return a;
	}
	
	function dualSubtr(a,b,clean){
		cleanDual(a);
		if(b.length>a.length)
			return a;
		var uebertrag = false;
		
		for(var i=0;i<b.length;i++){
			if(b[i]==true){
					
				if(a[i]==true){
					if(uebertrag){
						a[i]=true;
						uebertrag=true;
					}else{
						a[i]=false;
						uebertrag=false;
					}
				}else{
					if(uebertrag){
						uebertrag=true;
						a[i]=false;
					}else{
						uebertrag=true;
						a[i]=true;
					}
					
				}
			}else if(uebertrag){
				if(a[i]==true){
					a[i]=false;
					uebertrag=false;
				}else{
					a[i]=true;
					uebertrag=true;
				}
			}
		}
		if(uebertrag){
			var counter = b.length;
			if(a[counter]==true){
				a[counter]=false;
			}else{
				while(counter<=a.length && a[counter]!=true){
					a[counter]=true;
					counter++;
				}
				if(a[counter]){
					a[counter]=false;
				}
			}
		}
		
		//clean a
		if(clean)
			a = cleanDual(a);
		return a;
	}
        
	// ist a größer b
	function isGreater(a,b){
		cleanDual(a);
		cleanDual(b);
		
		if(a.length>b.length)
			return true;
		
		else if(a.length===b.length){
		   for(var i=1;i<a.length;i++){
			   if(a[a.length-1-i]){
				   if(!b[b.length-1-i]){
					   return true;
				   }
			   }else if(b[b.length-1-i]){
				   return false;
			   }
		   }
		}else{
			return false;
		}
			
		return true;
	}
	
	function cleanDual(a){
		var fertig=false;
		var counter=1;
		while(!fertig && (a[a.length-counter]==false || a[a.length-counter] === undefined)){
				counter++;
		}
		a.splice(a.length-counter+1,counter-1)
		return a;
	}
	
})();