//? - Dialog, ?Q - quest, ?F - finish quest, ?N - finish quest dialog
var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
//положение игрока относительно экрана
var x = canvas.width/2;
var y = canvas.height/2;
//данные игрока
var heals;
var mana;
var Inv=[];
var invx;
var invy;
var xp;
var lvl;
var gold;
//параметры
var BG_Rec; //размер квадрата игрока
var razmer; //размер квадрата на "поясе"
var BG_Speed; //скорость игрока
var BG_X, BG_Y; //начальное положение игрока
var BG_Protect; //защита игрока
var BG_DM; //сила игрока
var BG_Map_X; //размер карты в тайлах по X
var BG_Map_Y; //размер карты в тайлах по Y
var BG_Player_Slide; //колличество кадров анимации игрока
var cadr=0; //кадр анимации
var player_walk=0; //направление игрока
var initialization = false; //флаг инициализации
var Atacks=[]; //атаки
var Skills=[]; //скилы
//флаги управления
var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var upPressed = false;
var escPressed = false;
var enterPressed = false;
var onePressed = false;
var twoPressed = false;
var threePressed = false;
var fourPressed = false;
var flag = false;
var btn=1; //пункт в target
//игровые объекты
let objects=[];
let NPC=[];
let Items=[];
let Mobs=[];
let Party=[[]];
//загрузка текстур
var grass = new Image();
var player= new Image();
var MFon = new Image();
var BGame = new Image();
var BInventory = new Image();
var BAbout = new Image();
var BExit = new Image();
var BGameN = new Image();
var BInventoryN = new Image();
var BAboutN = new Image();
var BExitN = new Image();
var Dialog = new Image();
var TargetGUI = new Image();
var Button = new Image();
var ButtonN = new Image();
//переменные меню
var PMenu=1;
var MFlag=true;
var targetTXT=[];
//дополнительные переменные
var testflag=0; //переходы 
var target_ind=-1; //0-передвижение 1-меню 2-диалог 3-выход на карту 4-target бой
var j=0;
var BG_Delay=-1; //задержка нажатия
//диалог
var Dialog_NPC=-1;
var DText=[[]];//текст персонажа
var DAnsver=[[]];//текст ответов
var DPoint=0;
var DFlag=false;
var QAnsver=[]; //принять или отклонить квест
//квесты
var Quests=[[]]; //квесты
//target
var atack=false;
var init=false;
var skill=false;
var bag=false;
var kolvo=0;
var bg_btn=0;
var sk=[];
var hills=[];
var targ=1;
var Ogold=0;
var Oxp=0;
var flagS=false;
var targS=false;
var kontrflag=false;

//слушатель нажатия
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//создание инвентаря
function obnul()
{
	for(var i=0; i<invx; i++)
	{
		Inv[i]=[];
		for(var j=0; j<invy; j++)
		{
			Inv[i][j]=-1;
		}
	}
}

//загрузка объектов
function DownObject()
{
	obnul();
	initialization=true;
	xp=0;
	lvl=1;
	gold=0;
}

function Bag()
{
	kolvo=0;
	for(var i=0; i<invx; i++)
	{
		for(var j=0; j<invy; j++)
		{
			//kolvo++;
			if(Inv[i][j]!=-1)
			if(Items[Inv[i][j]].potion!=null)
			{
				sk[kolvo]=[{i, j}];
				sk[kolvo].i=i;
				sk[kolvo].j=j;
				kolvo++;
			}
		}
	}
}

//боевка
function target()
{
	//инициализация противников
	if(!init)
	{
		for(var i=1; i<Party[target_ind].length; i++)
		{
			hills[i]=Mobs[Party[target_ind][i]-1].HP;
		}
		init=true;
		flagS=false;
		targS=false;
	}
	//отрисовка экрана
	var tempBG = new Image();
	tempBG.src="./texture/"+Party[target_ind][0];
	ctx.drawImage(tempBG, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(TargetGUI, 0, 0, canvas.width, canvas.height)
	//отрисовка противников
	var test=false;
	for(var i=1; i<Party[target_ind].length; i++)
	{
		if(Party[target_ind][i]!=-1)
		{
			test=true;
			var temp = new Image();
			temp.src = './texture/'+Mobs[Party[target_ind][i]-1].img;
			ctx.drawImage(temp,temp.width/Mobs[Party[target_ind][i]-1].slide*2, 0, temp.width/Mobs[Party[target_ind][i]-1].slide, temp.height/4 , canvas.width-((BG_Rec*2+30)*(i)), 30, BG_Rec*2, BG_Rec*2);
			temp.remove();
			ctx.fillStyle="#f00";
			ctx.fillRect(canvas.width-((BG_Rec*2+30)*(i)), BG_Rec*3, 10*hills[i], 10);
		}
	}
	ctx.fillStyle = "#FFF";
	ctx.font = "italic 20pt Arial";
	ctx.drawImage(player, player.width/BG_Player_Slide*2, player.height/4*3, player.width/BG_Player_Slide, player.height/4, 30, canvas.height/2-BG_Rec*2, BG_Rec*2, BG_Rec*2);
	
	if(btn==1) ctx.drawImage(ButtonN, 20, canvas.height/2+ButtonN.height/2, canvas.width/4-30, canvas.height/6-30);
	else ctx.drawImage(Button, 20, canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/6-30);
	ctx.fillText(targetTXT[0], canvas.width/10, canvas.height/8*5);

	if(btn==2) ctx.drawImage(ButtonN, 20+canvas.width/4, canvas.height/2+ButtonN.height/2, canvas.width/4-30, canvas.height/6-30);
	else ctx.drawImage(Button, 20+canvas.width/4, canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/6-30);
	ctx.fillText(targetTXT[1], canvas.width/11*4, canvas.height/8*5);

	if(btn==3) ctx.drawImage(ButtonN, 20, canvas.height/2+ButtonN.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
	else ctx.drawImage(Button, 20, canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
	ctx.fillText(targetTXT[2], canvas.width/10, canvas.height/10*8);

	if(btn==4) ctx.drawImage(ButtonN, 20+canvas.width/4, canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
	else ctx.drawImage(Button, 20+canvas.width/4, canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
	ctx.fillText(targetTXT[3], canvas.width/11*4, canvas.height/10*8);

	//GUI
	ctx.fillStyle = "#F00";
	ctx.drawImage(player, player.width/BG_Player_Slide*2, 0, player.width/BG_Player_Slide, player.height/4, 20, canvas.height-BG_Rec*2, BG_Rec, BG_Rec);
	ctx.fillRect(20+BG_Rec, canvas.height-BG_Rec*5/3, 10*heals, 10);
	ctx.fillStyle = "#00F"
	ctx.fillRect(20+BG_Rec, canvas.height-BG_Rec*4/3, 10*mana, 10);
	ctx.fillStyle = "#FFF"

	//управление
	if(rightPressed && !atack && (btn==1 || btn==3))btn++;
	if(leftPressed && !atack && (btn==2 || btn==4))btn--;
	if(downPressed && !atack && (btn==1 || btn==2))btn+=2;
	if(upPressed && !atack && (btn==4 || btn==3))btn-=2;

	//проверка наличия противников
	if(!test)
	{
		Mobs[target_ind].HP=-1;
		gold+=Ogold;
		xp+=Oxp;	
		testflag=3;
	}

	//проверка на здоровье
	if(heals<0)
	{
		window.location.reload();
	}

	//контратака
	if(kontrflag)
	{
		for(var i=1; i<Party[target_ind].length; i++)
		{
			if(Party[target_ind][i]!=-1)
			{
				if(BG_Protect-Mobs[Party[target_ind][i]-1].DM<0)
					heals+=BG_Protect-Mobs[Party[target_ind][i]-1].DM;
			}
		}
		kontrflag=false;
	}

	//обработка нажатия
	//побег
	if(!atack && btn==4 && enterPressed)
		BG_Delay=30;
	if(BG_Delay==30 && !enterPressed)
	{
		var rand=0;
		for(var i=1; i<hills.length; i++)
		{
			if(hills[i]>0)
				rand+=Mobs[Party[target_ind][i]-1].DM;
		}
		var run=Math.floor(Math.random()*rand)+1;
		if(BG_Protect>run)
		{
			testflag=3;
			Mobs[target_ind].HP=-1;
		}
		else
		{
			if(rand-BG_Protect>0)
				heals-=rand-BG_Protect;
			BG_Delay=-1;
		}
	}

	//сумка
	if(!atack && btn==3 && enterPressed)
		BG_Delay=6;
	if(BG_Delay==6 && !enterPressed)
		atack=true;
	if(atack && btn==3)
	{
		if(!bag)
		{
			Bag();
			BG_Delay=-1
			bag=true;
			bg_btn=0;
		}

		var j=0, l=0, step=0, j1=0, i1=0;
		for(var i=0; i<kolvo; i++)
		{
			if(bg_btn==i)
			{
				j1=j; 
				i1=i;
				var temp=new Image();
				ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15)*l, canvas.height/2+Button.height/2+(BG_Rec+15)*j, BG_Rec, BG_Rec);
				temp.src='./texture/'+Items[Inv[sk[i].i][sk[i].j]].img;
				ctx.drawImage(temp, (canvas.width/4)*2+(BG_Rec+15)*l, canvas.height/2+Button.height/2+(BG_Rec+15)*j, BG_Rec, BG_Rec);
				temp.remove();
			}
			else 
			{
				var temp=new Image();
				temp.src='./texture/'+Items[Inv[sk[i].i][sk[i].j]].img;
				ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15)*l, canvas.height/2+Button.height/2+(BG_Rec+15)*j, BG_Rec, BG_Rec);
				ctx.drawImage(temp, (canvas.width/4)*2+(BG_Rec+15)*l, canvas.height/2+Button.height/2+(BG_Rec+15)*j, BG_Rec, BG_Rec);
				temp.remove();
			}

			l++;
			if((canvas.width/4)*2+(BG_Rec+15)*l-BG_Rec>=canvas.width-BG_Rec-20)
			{
				step=l;
				l=0;
				j++;
			}
		}

		if(kolvo==0 || escPressed)atack=false;
		if(rightPressed && bg_btn<kolvo-1)
			BG_Delay=1;
		if(BG_Delay==1 && !rightPressed)
		{
			bg_btn++;
			BG_Delay=-1;
		}

		if(leftPressed && bg_btn>0)
			BG_Delay=2;
		if(BG_Delay==2 && !leftPressed)
		{
			bg_btn--;
			BG_Delay=-1;
		}

		if(downPressed && bg_btn+step<kolvo)
			BG_Delay=3;
		if(BG_Delay==3 && !downPressed)
		{
			bg_btn+=step;
			BG_Delay=-1;
		}

		if(upPressed && bg_btn-step>=0)
			BG_Delay=4;
		if(BG_Delay==4 && !upPressed)
		{
			bg_btn-=step;
			BG_Delay=-1;
		}

		if(enterPressed && BG_Delay==-1)
			BG_Delay=7;
		if(BG_Delay==7 && ! enterPressed)
		{
			if(Items[Inv[sk[i1].i][sk[i1].j]].potion=="MP")
				mana+=Items[Inv[sk[i1].i][sk[i1].j]].point;
			if(Items[Inv[sk[i1].i][sk[i1].j]].potion=="HP")
				heals+=Items[Inv[sk[i1].i][sk[i1].j]].point;
			if(Items[Inv[sk[i1].i][sk[i1].j]].potion=="DM")
				BG_DM+=Items[Inv[sk[i1].i][sk[i1].j]].point;
			if(Items[Inv[sk[i1].i][sk[i1].j]].potion=="PR")
				BG_Protect+=Items[Inv[sk[i1].i][sk[i1].j]].point;
			atack=false;
			btn=1;
			bag=false;
			bg_btn=0;
			Bag();
			Inv[j1][i1]=-1;
			BG_Delay=-1;
		}
	}

	//атака
	if(!atack && btn==1 && enterPressed && !skill)
	{
		atack=true;
		bg_btn=0;
	}
	if(atack && !enterPressed && !skill && btn==1) BG_Delay=10;
	if(btn==1 && (BG_Delay==10 || BG_Delay==11 || BG_Delay==12 || BG_Delay==13 || BG_Delay==14 || BG_Delay==15) && atack)
	{
		var temp=new Image();
		if(bg_btn==0)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/6-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/6-30);
		ctx.fillText(Atacks[0].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, canvas.height/2+Button.height/2+(canvas.height/6-30)/2);

		if(bg_btn==1)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/6-30);
			ctx.fillText(Atacks[1].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, canvas.height/2+Button.height/2+canvas.height/6+(canvas.height/6-30)/2);

		if(downPressed && bg_btn==0 && BG_Delay==10)
			bg_btn=1;
		if(upPressed && bg_btn==1 && BG_Delay==10)
			bg_btn=0;
		if(enterPressed && atack)
			skill=true;
		if(!enterPressed && skill && BG_Delay==10)
			BG_Delay=11;
		if(BG_Delay==11 || BG_Delay==12 || BG_Delay==13 || BG_Delay==14 || BG_Delay==15)
		{
			if(leftPressed)
			{
				BG_Delay=12;
			}
			if(rightPressed)
			{
				BG_Delay=13;
			}
			if(BG_Delay==12  && targ<Party[target_ind].length-1 && !leftPressed)
			{
				targ++;
				BG_Delay=11;
			}
			if(BG_Delay==13  && targ>1 && !rightPressed)
			{
				targ--;
				BG_Delay=11;
			}
			if(escPressed)
			{
				BG_Delay=14;
			}
			if(BG_Delay==14 && !escPressed)
			{
				BG_Delay=10;
				skill=false
			}
			if(enterPressed)
				BG_Delay=15;
			if(BG_Delay==15 && !enterPressed)
			{
				if(hills[targ]>0 && (mana-Atacks[bg_btn].mana>=0))
				{
					if(Mobs[Party[target_ind][targ]-1].PR-Atacks[bg_btn].dmg*BG_DM<0)
						hills[targ]+=(Mobs[Party[target_ind][targ]-1].PR-Atacks[bg_btn].dmg*BG_DM);
					mana-=Atacks[bg_btn].mana;
					skill=false;
					atack=false;
					BG_Delay=0;
					if(hills[targ]<0)
					{
						hills[targ]=0;
						if(Party[target_ind][targ]!=-1)
						{
							Oxp+=Mobs[Party[target_ind][targ]-1].xp;
							Ogold+=Mobs[Party[target_ind][targ]-1].gld;
						}
						Party[target_ind][targ]=-1;
					}
					//flag
					kontrflag=true;
				}
			}
			ctx.strokeStyle = "#00F";
			ctx.strokeRect(canvas.width-((BG_Rec*2+30)*(targ)), 30, BG_Rec*2, BG_Rec*2)
		}
		if(escPressed && atack && BG_Delay==10)
		{
			BG_Delay==0;
			atack=false;
		}
	}

	//навыки
	if(!atack && btn==2 && enterPressed && !skill && !flagS)
	{
		atack=true;
		bg_btn=0;
	}
	if(atack && !enterPressed && ! skill && btn==2 && !flagS)
	{
		flagS=true;
		BG_Delay=20;
	}
	if(btn==2 && (BG_Delay==24 || BG_Delay==28 || BG_Delay==27 || BG_Delay==26 || BG_Delay==25 || BG_Delay==20 || BG_Delay==21 || BG_Delay==22 || BG_Delay==23) && atack)
	{
		if(bg_btn==0)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/12-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2, canvas.width/4-30, canvas.height/12-30);
		ctx.fillText(Skills[0].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, (canvas.height/2+Button.height/2)+(canvas.height/12-15)/2);
		if(bg_btn==1)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/12, canvas.width/4-30, canvas.height/12-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/12, canvas.width/4-30, canvas.height/12-30);
		ctx.fillText(Skills[1].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, (canvas.height/2+Button.height/2+canvas.height/12)+(canvas.height/12-15)/2);
		if(bg_btn==2)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/12-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/6, canvas.width/4-30, canvas.height/12-30);
		ctx.fillText(Skills[2].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, (canvas.height/2+Button.height/2+canvas.height/6)+(canvas.height/12-15)/2);
		if(bg_btn==3)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/4, canvas.width/4-30, canvas.height/12-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/4, canvas.width/4-30, canvas.height/12-30);
		ctx.fillText(Skills[3].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, (canvas.height/2+Button.height/2+canvas.height/4)+(canvas.height/12-15)/2);
		if(bg_btn==4)
			ctx.drawImage(ButtonN, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/3, canvas.width/4-30, canvas.height/12-30);
		else
			ctx.drawImage(Button, (canvas.width/4)*2+(BG_Rec+15), canvas.height/2+Button.height/2+canvas.height/3, canvas.width/4-30, canvas.height/12-30);
		ctx.fillText(Skills[4].name, (canvas.width/4)*2+(BG_Rec+15)+(canvas.width/4-30)/3, (canvas.height/2+Button.height/2+canvas.height/3)+(canvas.height/12-15)/2);

		if(downPressed && !skill && bg_btn<4) BG_Delay=21;
		if(BG_Delay==21 && !downPressed) 
		{
			BG_Delay=20;
			bg_btn++;
		}
		if(upPressed && !skill && bg_btn>0) BG_Delay=22;
		if(BG_Delay==22 && !upPressed)
		{
			BG_Delay=20;
			bg_btn--;
		}
		if(escPressed && !skill) BG_Delay=23;
		if(BG_Delay==23 && !escPressed)
		{
			BG_Delay=-1;
			atack=false;
			flagS=false;
		}
		if(enterPressed && atack)
			BG_Delay=24;
		if(BG_Delay==24 && !enterPressed)
			skill=true;
		if(skill)
		{
			if(skill && escPressed)
				BG_Delay=25;
			if(BG_Delay==25 && !escPressed)
			{
				skill=false;
				BG_Delay=20;
			}
			if(mana-Skills[bg_btn].MP>=0)
			{
				if(Skills[bg_btn].class=="HP")
				{
					heals+=Skills[bg_btn].point;
					mana-=Skills[bg_btn].MP;
					BG_Delay=-1;
					skill=false;
					atack=false;
					flagS=false;
				}
				if((Skills[bg_btn].class=="VP" || Skills[bg_btn].class=="SK" || Skills[bg_btn].class=="DD")  && mana>0)
				{
					if(leftPressed && targ<Party[target_ind].length-1)
						BG_Delay=26;
					if(BG_Delay==26 && !leftPressed)
					{
						targ++;
						BG_Delay=24;
					}
					if(rightPressed && targ>1)
						BG_Delay=27;
					if(BG_Delay==27 && !rightPressed)
					{
						targ--;
						BG_Delay=24;
					}
					if(enterPressed && hills[targ]>0)
						BG_Delay=28;
					if(BG_Delay==28 && !enterPressed)
					{
						if(Skills[bg_btn].class=="VP")
						{
							heals+=Skills[bg_btn].point;
							hills[targ]-=Skills[bg_btn].point;
						}
						else if(Skills[bg_btn].class=="SK")
						{
							if(Mobs[Party[target_ind][targ]-1].PR-Skills[bg_btn].DM<0)
							{
								
								hills[targ]+=Mobs[Party[target_ind][targ]-1].PR-Skills[bg_btn].DM;
							}
						}
						else if(Skills[bg_btn].class=="DD")
						{
							if(Mobs[Party[target_ind][targ]-1].PR-(BG_DM*Skills[bg_btn].point)<0)
							{
								
								hills[targ]+=Mobs[Party[target_ind][targ]-1].PR-(BG_DM*Skills[bg_btn].point);
							}
						}
						if(hills[targ]<=0)
						{
							hills[targ]=0;
							Party[target_ind][targ]=-1;
						}
						mana-=Skills[bg_btn].MP;
						BG_Delay=-1;
						targ=1;
						skill=false;
						atack=false;
						flagS=false;
						//flag
						kontrflag=true;
					}
					ctx.strokeStyle = "#00F";
					ctx.strokeRect(canvas.width-((BG_Rec*2+30)*(targ)), 30, BG_Rec*2, BG_Rec*2)
				}
			}
			else
			{
				skill=false;
				BG_Delay=20;
			}
		}
	}

	tempBG.remove();
}

//поднятие предметов
function Put(ind)
{
	if((y+BG_Y-Items[ind].y<=15 && y+BG_Y-Items[ind].y>=-15) && (x+BG_X-Items[ind].x<=15 && x+BG_X-Items[ind].x>=-15))
	{
		var temp2=false;
		for(var i=0; i<invx; i++)
		{
			for(var j=0; j<invy; j++)
			{
				if(Inv[i][j]==-1 && !temp2)
				{
					Inv[i][j]=ind;
					Items[ind].x=null;
					temp2=true;
				}
			}
		}
	}
}

//анимация
function Anim(i, h)
{
	if(i>(100/BG_Player_Slide))
	{
		j++;
		cadr=0;
	}
	if(j>BG_Player_Slide-1)j=0;
	ctx.drawImage(player, player.width/BG_Player_Slide*(j), player.height/4*h, player.width/BG_Player_Slide, player.height/4, x, y, BG_Rec, BG_Rec);
}

//обработка нажатия
function keyDownHandler(e)
{
	if(e.key == "ArrowRight")
	{
		rightPressed = true;
		flag = true;
	}
	else if(e.key == "ArrowLeft")
	{
		leftPressed = true;
		flag = true;
	}
	else if(e.key == "ArrowUp")
	{
		upPressed = true;
		flag = true;
	}
	else if(e.key == "ArrowDown")
	{
		downPressed = true;
		flag = true;
	}
	else if(e.key == "Escape")
	{
		escPressed = true;
	}
	else if(e.key == "Enter")
	{
		enterPressed = true;
	}
	else if(e.key == "1")
	{
		onePressed = true;
	}
	else if(e.key == "2")
	{
		twoPressed = true;
	}
	else if(e.key == "3")
	{
		threePressed = true;
	}
	else if(e.key == "4")
	{
		fourPressed = true;
	}
}

function keyUpHandler(e)
{
	if(e.key == "ArrowRight")
	{
		rightPressed = false;
		flag=false;
	}
	else if(e.key == "ArrowLeft")
	{
		leftPressed = false;
		flag=false;
	}
	else if(e.key == "ArrowUp")
	{
		upPressed = false;
		flag=false;
	}
	else if(e.key == "ArrowDown")
	{
		downPressed = false;
		flag=false;
	}
	else if(e.key == "Escape")
	{
		escPressed = false;
	}
	else if(e.key == "Enter")
	{
		enterPressed = false;
	}
	else if(e.key == "1")
	{
		onePressed = false;
	}
	else if(e.key == "2")
	{
		twoPressed = false;
	}
	else if(e.key == "3")
	{
		threePressed = false;
	}
	else if(e.key == "4")
	{
		fourPressed = false;
	}
}

//столкновения
function collision(oritation)
{
	var colis=true;
	if(oritation=="UP")
	{
		player_walk=3;//анимация направления
		//столкновение с объектом
		for(var i=0; i<objects.length; i++)
		{
			if(objects[i].solid)
			{
				if(((y+BG_Rec/4*3<=(objects[i].y+objects[i].H-BG_Y+5)) && y+BG_Rec/4*3>=(objects[i].y-BG_Y)) && (x+BG_Rec-5>=(objects[i].x-BG_X) && x+10<=(objects[i].x+objects[i].W-BG_X)))
				{
					colis=false;
				}
			}
		}

		//столкновение с НПС
		for(var i=0; i<NPC.length; i++)
		{
			if(NPC[i].solid)
			{
				if(((y+BG_Rec/4*3<=(NPC[i].y+BG_Rec-BG_Y+5)) && y+BG_Rec/4*3>=(NPC[i].y-BG_Y)) && (x+BG_Rec-5>=(NPC[i].x-BG_X) && x+10<=(NPC[i].x+NPC[i].W-BG_X)))
				{
					colis=false;
				}
			}
		}

		//столкновение с мобом
		for(var i=0; i<Mobs.length; i++)
		{
			if((y+BG_Y-Mobs[i].y<=BG_Rec && y+BG_Y-Mobs[i].y>=-BG_Rec) && (x+BG_X-Mobs[i].x<=BG_Rec && x+BG_X-Mobs[i].x>=-BG_Rec) && Mobs[i].HP>0)
			{
				testflag=4;
				target_ind=i;
			}
		}
	}

	if(oritation=="DOWN")
	{
		player_walk=0;//анимация направления
		//столкновение с объектом
		for(var i=0; i<objects.length; i++)
		{
			if(objects[i].solid)
			{
				if(((y+BG_Rec>=(objects[i].y-BG_Y-5)) && y+BG_Rec<=(objects[i].y+objects[i].H-BG_Y)) && (x+BG_Rec-5>=(objects[i].x-BG_X) && x+10<=(objects[i].x+objects[i].W-BG_X)))
				{
					colis=false;
				}
			}
		}

		//столкновение с НПС
		for(var i=0; i<NPC.length; i++)
		{
			if(NPC[i].solid)
			{
				if(((y+BG_Rec>=(NPC[i].y-BG_Y-5)) && y+BG_Rec<=(NPC[i].y+BG_Rec-BG_Y)) && (x+BG_Rec-5>=(NPC[i].x-BG_X) && x+10<=(NPC[i].x+NPC[i].W-BG_X)))
				{
					colis=false;
				}
			}
		}

		//столкновение с мобом
		for(var i=0; i<Mobs.length; i++)
		{
			if((y+BG_Y-Mobs[i].y<=BG_Rec && y+BG_Y-Mobs[i].y>=-BG_Rec) && (x+BG_X-Mobs[i].x<=BG_Rec && x+BG_X-Mobs[i].x>=-BG_Rec) && Mobs[i].HP>0)
			{
				testflag=4;
				target_ind=i;
			}
		}
	}

	if(oritation=="RIGHT")
	{
		player_walk=2;//анимация направления
		//столкновение с объектом
		for(var i=0; i<objects.length; i++)
		{
			if(objects[i].solid)
			{
				if((((x+BG_Rec-5)>=(objects[i].x-BG_X-5)) && x+10<=(objects[i].x+objects[i].W-BG_X)) && (y+BG_Rec>=(objects[i].y-BG_Y) && y+BG_Rec<=(objects[i].y+objects[i].H-BG_Y)))
				{
					colis=false;
				}
			}
		}

		//столкновение с НПС
		for(var i=0; i<NPC.length; i++)
		{
			if(NPC[i].solid)
			{
				if((((x+BG_Rec-5)>=(NPC[i].x-BG_X-5)) && x+10<=(NPC[i].x+NPC[i].W-BG_X)) && (y+BG_Rec>=(NPC[i].y-BG_Y) && y+BG_Rec<=(NPC[i].y+BG_Rec-BG_Y)))
				{
					colis=false;
				}
			}
		}

		//столкновение с мобом
		for(var i=0; i<Mobs.length; i++)
		{
			if((y+BG_Y-Mobs[i].y<=BG_Rec && y+BG_Y-Mobs[i].y>=-BG_Rec) && (x+BG_X-Mobs[i].x<=BG_Rec && x+BG_X-Mobs[i].x>=-BG_Rec) && Mobs[i].HP>0)
			{
				testflag=4;
				target_ind=i;
			}
		}
	}

	if(oritation=="LEFT")
	{
		player_walk=1;//анимация направления
		//столкновение с объектом
		for(var i=0; i<objects.length; i++)
		{
			if(objects[i].solid)
			{
				if((((x+5)<=(objects[i].x+objects[i].W-BG_X+5)) && x-10>=(objects[i].x-BG_X)) && (y+BG_Rec>=(objects[i].y-BG_Y) && y+BG_Rec<=(objects[i].y+objects[i].H-BG_Y)))
				{
					colis=false;
				}
			}
		}

		//столкновение с НПС
		for(var i=0; i<NPC.length; i++)
		{
			if(NPC[i].solid)
			{
				if((((x+5)<=(NPC[i].x+NPC[i].W-BG_X+5)) && x-10>=(NPC[i].x-BG_X)) && (y+BG_Rec>=(NPC[i].y-BG_Y) && y+BG_Rec<=(NPC[i].y+BG_Rec-BG_Y)))
				{
					colis=false;
				}
			}
		}

		//столкновение с мобом
		for(var i=0; i<Mobs.length; i++)
		{
			if((y+BG_Y-Mobs[i].y<=BG_Rec && y+BG_Y-Mobs[i].y>=-BG_Rec) && (x+BG_X-Mobs[i].x<=BG_Rec && x+BG_X-Mobs[i].x>=-BG_Rec) && Mobs[i].HP>0)
			{
				testflag=4;
				target_ind=i;
			}
		}
	}

	return colis;
}

//обработка квестов
function Quest(num)
{
	if(Quests[num][0]=="item")
	{
		var finish=false, kol=0;
		for(var i=0; i<invx; i++)
		{
			for(var j=0; j<invy; j++)
			{
				if(!finish && Inv[i][j]!=-1)
				{
					if(Quests[num][1]==Items[Inv[i][j]].name)
					{
						kol++;
						Inv[i][j]=-1;
					}
				}
				if(!finish && kol==Quests[num][2])
				{
					xp+=Quests[num][3];
					gold+=Quests[num][4];
					finish=true;
					Quests[0]="finish";
				}
			}
		}
	}
	else if(Quests[num][0]=="mob")
	{}
	return finish;
}

//диалоги
function dialog()
{
	ctx.drawImage(Dialog, canvas.width/2-Dialog.width/2, canvas.height/2-Dialog.height/2);
	ctx.fillStyle = "#FFF";
	ctx.font = "italic 20pt Arial";
	for(var i=0; i<=DPoint; i++)
	{
		if(DText[Dialog_NPC][i]!="?" && DText[Dialog_NPC][i]!="?Q" && DText[Dialog_NPC][i]!="?F" && DText[Dialog_NPC][i]!="?N")
		{
			ctx.fillText(DText[Dialog_NPC][i], canvas.width/2-Dialog.width/2+20, canvas.height/2-Dialog.height/2+30*(i+1)+5);
		}

		if(DText[Dialog_NPC][i]=="?")
		{
			for(var j=0; j<DAnsver[Dialog_NPC].length; j++)
			{
				ctx.fillText(j+1 +". " + DAnsver[Dialog_NPC][j], canvas.width/2-Dialog.width/2+20, canvas.height-Dialog.height/3+30*(j+1)-30);
			}
			if(onePressed && DAnsver[Dialog_NPC][0]!=null)
			{
				DText[Dialog_NPC][i]="-"+DAnsver[Dialog_NPC][0];
			}
			else if(twoPressed && DAnsver[Dialog_NPC][1]!=null)
			{
				DText[Dialog_NPC][i]="-"+DAnsver[Dialog_NPC][1];
			}
			else if(threePressed && DAnsver[Dialog_NPC][2]!=null)
			{
				DText[Dialog_NPC][i]="-"+DAnsver[Dialog_NPC][2];
			}
			else if(fourPressed && DAnsver[Dialog_NPC][3]!=null)
			{
				DText[Dialog_NPC][i]="-"+DAnsver[Dialog_NPC][3];
			}
		}

		if(DText[Dialog_NPC][i]=="?Q")
		{
			ctx.fillText(1 +". " + QAnsver[0], canvas.width/2-Dialog.width/2+20, canvas.height-Dialog.height/3);
			ctx.fillText(2 +". " + QAnsver[1], canvas.width/2-Dialog.width/2+20, canvas.height-Dialog.height/3+30);

			if(onePressed && QAnsver[0]!=null)
			{
				DText[Dialog_NPC][i]="-"+QAnsver[0];
			}
			else if(twoPressed && QAnsver[1]!=null)
			{
				testflag=3;
			}
		}

		if(DText[Dialog_NPC][i]=="?F")
		{
			var finish=Quest(Dialog_NPC);
			if(!finish)
			{
				testflag=3;
			}
			else
			{
				DText[Dialog_NPC][i]="...";
			}
		}
	}
	if(DText[Dialog_NPC][DPoint]==null) testflag=3;
	if(enterPressed && DText[Dialog_NPC][DPoint]!="?" && DText[Dialog_NPC][DPoint]!="?Q" && DText[Dialog_NPC][DPoint]!="?F") DFlag=true;
	if(!enterPressed && DFlag)
	{
		DPoint++;
		DFlag=false;
	}

	if(DText[Dialog_NPC][DPoint]=="?N")
	{
		DText[Dialog_NPC][1]="...";
		DText[Dialog_NPC][2]=null;
		testflag=3;
	}
}

//отрисовка
function drawRect()
{
	BG_Rec=player.height/BG_Player_Slide;
	//камера
	for(var i=0; i<BG_Map_X; i++)
	{
		for(var j=0; j<BG_Map_Y; j++)
		{
			ctx.drawImage(grass, i*grass.width-BG_X, j*grass.height-BG_Y);
		}
	}

	//отрисовка объектов
	for(var i=0; i<objects.length; i++)
	{
		var temp = new Image();
		temp.src='./texture/'+objects[i].img;

		objects[i].H=temp.height;
		objects[i].W=temp.width;

		ctx.drawImage(temp, objects[i].x-BG_X, objects[i].y-BG_Y);
		temp.remove();
	}

	//отрисовка NPC
	for(var i=0; i<NPC.length; i++)
	{
		var temp = new Image();
		temp.src='./texture/'+NPC[i].img;

		NPC[i].H=temp.height/4;
		NPC[i].W=temp.width/NPC[i].slide;

		ctx.drawImage(temp, temp.width/NPC[i].slide*(NPC[i].cadr-1), 0, temp.width/NPC[i].slide*NPC[i].cadr, temp.height/4, NPC[i].x-BG_X, NPC[i].y-BG_Y, BG_Rec, BG_Rec);
		temp.remove();
	}

	//отрисовка предметов
	for(var i=0; i<Items.length; i++)
	{
		if(Items[i].x!=null)
		{
			var temp = new Image();
			temp.src='./texture/'+Items[i].img;

			ctx.drawImage(temp, Items[i].x-BG_X, Items[i].y-BG_Y, BG_Rec, BG_Rec);
			temp.remove();
			Put(i);
		}
	}

	//отрисовка мобов
	for(var i=0; i<Mobs.length; i++)
	{
		var temp = new Image();
		temp.src='./texture/'+Mobs[i].img;

		if(!Mobs[i].patrol && Mobs[i].HP>0)
		{
			Mobs[i].H=temp.height/4;
			Mobs[i].W=temp.width/Mobs[i].slide;
			ctx.drawImage(temp, 0, 0, temp.width/Mobs[i].slide, temp.height/4, Mobs[i].x-BG_X, Mobs[i].y-BG_Y, BG_Rec, BG_Rec);
		}
		temp.remove();

		
	//игрок
	ctx.beginPath();
	Anim(cadr, player_walk);
	ctx.closePath();
	}

	//ожидание нажатия клавишь управления
	if(testflag==3)
	{
		Dialog_NPC=-1;
		DPoint=0;
		if(upPressed || downPressed || leftPressed || rightPressed)
			testflag=0;
	}
}

//управление
function control()
{
	if(rightPressed && (BG_X+BG_Rec)<(grass.width*BG_Map_X-x) && collision("RIGHT") && testflag==0) 
		BG_X+=BG_Speed;

	if(leftPressed && BG_X>-x && collision("LEFT") && testflag==0) 
		BG_X-=BG_Speed;

	if(upPressed && BG_Y>-y  && collision("UP") && testflag==0) 
		BG_Y-=BG_Speed;

	if(downPressed && (BG_Y+BG_Rec)<(grass.height*BG_Map_Y-y) && collision("DOWN") && testflag==0) 
		BG_Y+=BG_Speed;
	
	if(flag)cadr+=1;

	if(escPressed && !MFlag)
	{
		//вход в меню
		if(testflag==0)
			MFlag=true;
		//вход в ожидание управления
		if(testflag==2)
		{
			testflag=3;
			Dialog_NPC=-1;
			DPoint=0;
		}
	}
	
	if(enterPressed && testflag==0)
	{
		//вход в диалог
		for(var i=0; i<NPC.length; i++)
		{
			//под нпс
			if(player_walk==3 && Math.abs((BG_Y+y-5)-NPC[i].y)<=BG_Rec && (Math.abs((BG_X+x+5)-NPC[i].x)<=BG_Rec/2))
			{
				testflag=2;
				Dialog_NPC=i;
			}
			//над нпс
			if(player_walk==0 && Math.abs(NPC[i].y-(BG_Y+y+5))<=BG_Rec  && (Math.abs((BG_X+x+5)-NPC[i].x)<=BG_Rec/2))
			{
				testflag=2;
				Dialog_NPC=i;
			}
			//справа от нпс
			if(player_walk==1 && Math.abs(NPC[i].x-(BG_X+x-5))<=BG_Rec  && (Math.abs((BG_Y+y+5)-NPC[i].y)<=BG_Rec/2))
			{
				testflag=2;
				Dialog_NPC=i;
			}
			//слева от нпс
			if(player_walk==2 && Math.abs((BG_X+x+5)-NPC[i].x)<=BG_Rec  && (Math.abs((BG_Y+y+5)-NPC[i].y)<=BG_Rec/2))
			{
				testflag=2;
				Dialog_NPC=i;
			}
		}
	}

	if(testflag==2)
	{
		dialog();
	}
}
//отрисовка GUI
function GUI()
{
	ctx.drawImage(player, 0, 0, player.width/4, player.height/4, 0, 0, BG_Rec, BG_Rec);
	
	//HP и MP
	ctx.fillStyle="#F00";
	ctx.fillRect(BG_Rec+10, 15, 10*heals, 10);
	ctx.fillStyle="#00F";
	ctx.fillRect(BG_Rec+10, 30, 10*mana, 10);
	
	//skills
	//подложка
	var tempH=canvas.width/2-razmer*4;
	ctx.fillStyle="#2477c3";
	ctx.fillRect(tempH, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer*3, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer*4, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer*5, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer*6, canvas.height-45, razmer, razmer);
	ctx.fillRect(tempH+razmer*7, canvas.height-45, razmer, razmer);

	//навыки
	var temp=new Image();
	temp.src='./texture/'+Atacks[0].img;
	ctx.drawImage(temp, tempH, canvas.height-45, razmer, razmer);
	var temp1=new Image();
	temp1.src='./texture/'+Atacks[1].img;
	ctx.drawImage(temp1, tempH+razmer, canvas.height-45, razmer, razmer);
	var temp2=new Image();
	temp2.src='./texture/'+Skills[0].img;
	ctx.drawImage(temp2, tempH+razmer*3, canvas.height-45, razmer, razmer);
	var temp3=new Image();
	temp3.src='./texture/'+Skills[1].img;
	ctx.drawImage(temp3, tempH+razmer*4, canvas.height-45, razmer, razmer);
	var temp4=new Image();
	temp4.src='./texture/'+Skills[2].img;
	ctx.drawImage(temp4, tempH+razmer*5, canvas.height-45, razmer, razmer);
	var temp5=new Image();
	temp5.src='./texture/'+Skills[3].img;
	ctx.drawImage(temp5, tempH+razmer*6, canvas.height-45, razmer, razmer);
	var temp6=new Image();
	temp6.src='./texture/'+Skills[4].img;
	ctx.drawImage(temp6, tempH+razmer*7, canvas.height-45, razmer, razmer);

	//рамка
	ctx.lineWidth=5;
	ctx.strokeStyle="#000"
	ctx.strokeRect(tempH, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer*3, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer*4, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer*5, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer*6, canvas.height-45, razmer, razmer);
	ctx.strokeRect(tempH+razmer*7, canvas.height-45, razmer, razmer);
	
	temp.remove();
	temp1.remove();
	temp2.remove();
	temp3.remove();
	temp4.remove();
	temp5.remove();
	temp6.remove();
}

//отрисовка меню
function menu(flag)
{
	if(flag)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(MFon, 0, 0, canvas.width, canvas.height);
		
		if(PMenu==1)
		{
			var y=canvas.height/4-10-BGameN.height/2;
			var x=50;
			ctx.drawImage(BGameN, x, y, BGameN.width/2, BGameN.height/2);
		}
		else
		{
			var y=canvas.height/4-10-BGame.height/2;
			var x=50;
			ctx.drawImage(BGame, x, y, BGame.width/2, BGame.height/2);
		}
		
		if(PMenu==2)
		{
			var y=canvas.height/4;
			var x=50;
			ctx.drawImage(BInventoryN, x, y, BInventoryN.width/2, BInventoryN.height/2);
			var Invent = new Image();
			Invent.src = './texture/inventory.png';
			ctx.drawImage(Invent, x+BInventoryN.width/2+10, y-10-BInventoryN.height/2, Invent.width, Invent.height);
			Invent.remove()
			for(var i=0; i<invx; i++)
			{
				for(var j=0; j<invy; j++)
				{
					if(Inv[i][j]!=-1)
					{
						var ITemp = new Image();
						ITemp.src='./texture/'+Items[Inv[i][j]].img;
						
						ctx.drawImage(ITemp, x+BInventoryN.width/2+BG_Rec/2+Invent.width/invx*i, y-BInventoryN.height/2+Invent.height/invy*j+BG_Rec/4, BG_Rec, BG_Rec);
						
						Invent.remove()
					}
				}
			}
		}
		else
		{
			var y=canvas.height/4;
			var x=50;
			ctx.drawImage(BInventory, x, y, BInventory.width/2, BInventory.height/2);
		}
		
		if(PMenu==3)
		{
			var y=canvas.height/4+10+BAboutN.height/2;
			var x=50;
			ctx.drawImage(BAboutN, x, y, BAboutN.width/2, BAboutN.height/2);
		}
		else
		{
			var y=canvas.height/4+10+BAbout.height/2;
			var x=50;
			ctx.drawImage(BAbout, x, y, BAbout.width/2, BAbout.height/2);
		}
		
		if(PMenu==4)
		{
			var y=canvas.height/4+20+BExitN.height/2*2;
			var x=50;
			ctx.drawImage(BExitN, x, y, BExitN.width/2, BExitN.height/2);
		}
		else
		{
			var y=canvas.height/4+20+BExitN.height/2*2
			var x=50;
			ctx.drawImage(BExit, x, y, BExit.width/2, BExit.height/2);
		}

		//управление
		if(downPressed)
		{
			testflag=1;
		}

		if(upPressed)
		{
			testflag=-1;
		}

		if(enterPressed)
		{
			if(PMenu==4)
			{
				MFlag=false;
				flag=false;
				PMenu=1;
			}
		}

		if(!downPressed && !upPressed)
		{
			if(testflag==1)
			{
				PMenu++;
				testflag=0;
				if(PMenu>4) PMenu=4;
			}

			if(testflag==-1)
			{
				PMenu--;
				testflag=0;
				if(PMenu<1) PMenu=1;
			}
		}
	}
}

//игра
function Game()
{
	drawRect();
	GUI();
	control();	
	console.log("XP "+xp+" gold "+gold);
}

//отрисовка
function BG_RPG()
{
	if(!initialization)
		DownObject();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(MFlag)
	{
		menu(MFlag);
	}
	else
	{
		if(testflag!=4)
		{
			Game();
		}
		else
		{
			target()
		}
	}
}